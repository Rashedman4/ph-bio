import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import pool from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Missing signature or webhook secret", {
      status: 402,
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Add debug logging
    console.log("Webhook signature verified successfully");
    console.log("Event type:", event.type);

    const client = await pool.connect();
    try {
      switch (event.type) {
        case "customer.subscription.created": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = (customer as Stripe.Customer).email;

          if (!customerEmail) {
            throw new Error("Customer email not found");
          }

          // Get the price ID from the subscription
          const priceId = subscription.items.data[0]?.price.id;
          if (!priceId) {
            throw new Error("Price ID not found in subscription");
          }

          // Get package details
          const {
            rows: [package_],
          } = await client.query(
            `SELECT id, interval, interval_count 
             FROM packages 
             WHERE stripe_price_id = $1`,
            [priceId]
          );

          if (!package_) {
            throw new Error(`Package not found for price ID: ${priceId}`);
          }

          // Calculate end date based on package interval
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + package_.interval_count);

          // Create subscription record
          const subscriptionResult = await client.query(
            `INSERT INTO subscriptions (
              user_id,
              package_id,
              status,
              start_date,
              end_date,
              stripe_subscription_id,
              stripe_customer_id,
              current_period_start,
              current_period_end
            ) VALUES (
              (SELECT id FROM users WHERE email = $1),
              $2,
              $3,
              NOW(),
              $4,
              $5,
              $6,
              to_timestamp($7),
              to_timestamp($8)
            ) RETURNING id`,
            [
              customerEmail,
              package_.id,
              subscription.status,
              endDate,
              subscription.id,
              customerId,
              subscription.current_period_start,
              subscription.current_period_end,
            ]
          );

          const subscriptionId = subscriptionResult.rows[0].id;

          // Record the initial transaction if there's an invoice
          if (subscription.latest_invoice) {
            const invoice = await stripe.invoices.retrieve(
              subscription.latest_invoice as string
            );
            if (invoice.payment_intent) {
              await client.query(
                `INSERT INTO transactions (
                  user_id,
                  subscription_id,
                  stripe_invoice_id,
                  stripe_payment_intent_id,
                  amount,
                  currency,
                  status,
                  payment_method,
                  metadata
                ) VALUES (
                  (SELECT id FROM users WHERE email = $1),
                  $2,
                  $3,
                  $4,
                  $5,
                  $6,
                  $7,
                  $8,
                  $9
                )`,
                [
                  customerEmail,
                  subscriptionId,
                  invoice.id,
                  invoice.payment_intent,
                  invoice.amount_paid,
                  invoice.currency,
                  invoice.status,
                  "card",
                  JSON.stringify(invoice),
                ]
              );
            }
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          //  const customerId = subscription.customer as string;

          // Update subscription status
          await client.query(
            `UPDATE subscriptions 
             SET status = $1, 
                 end_date = $2,
                 current_period_start = to_timestamp($3),
                 current_period_end = to_timestamp($4),
                 cancel_at_period_end = $5
             WHERE stripe_subscription_id = $6`,
            [
              subscription.status,
              new Date(subscription.current_period_end * 1000),
              subscription.current_period_start,
              subscription.current_period_end,
              subscription.cancel_at_period_end,
              subscription.id,
            ]
          );

          // If subscription was canceled, record the canceled_at date
          if (subscription.canceled_at) {
            await client.query(
              `UPDATE subscriptions 
               SET canceled_at = to_timestamp($1)
               WHERE stripe_subscription_id = $2`,
              [subscription.canceled_at, subscription.id]
            );
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;

          // Mark subscription as canceled and set ended_at
          await client.query(
            `UPDATE subscriptions 
             SET status = 'canceled',
                 ended_at = NOW()
             WHERE stripe_subscription_id = $1`,
            [subscription.id]
          );
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeSubscriptionId = invoice.subscription as string;

          if (stripeSubscriptionId) {
            // Get our database subscription ID first
            const { rows: subscriptionRows } = await client.query(
              `SELECT id, user_id FROM subscriptions WHERE stripe_subscription_id = $1`,
              [stripeSubscriptionId]
            );

            if (subscriptionRows.length > 0) {
              const { id: subscriptionId, user_id: userId } =
                subscriptionRows[0];

              // Update subscription status to active
              await client.query(
                `UPDATE subscriptions 
                 SET status = 'active'
                 WHERE id = $1`,
                [subscriptionId]
              );

              // Record the transaction
              if (invoice.payment_intent) {
                await client.query(
                  `INSERT INTO transactions (
                    user_id,
                    subscription_id,
                    stripe_invoice_id,
                    stripe_payment_intent_id,
                    amount,
                    currency,
                    status,
                    payment_method,
                    metadata
                  ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                  )`,
                  [
                    userId,
                    subscriptionId,
                    invoice.id,
                    invoice.payment_intent,
                    invoice.amount_paid,
                    invoice.currency,
                    invoice.status,
                    "card",
                    JSON.stringify(invoice),
                  ]
                );
              }
            }
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeSubscriptionId = invoice.subscription as string;

          if (stripeSubscriptionId) {
            // Get our database subscription ID first
            const { rows: subscriptionRows } = await client.query(
              `SELECT id, user_id FROM subscriptions WHERE stripe_subscription_id = $1`,
              [stripeSubscriptionId]
            );

            if (subscriptionRows.length > 0) {
              const { id: subscriptionId, user_id: userId } =
                subscriptionRows[0];

              // Update subscription status to past_due
              await client.query(
                `UPDATE subscriptions 
                 SET status = 'past_due'
                 WHERE id = $1`,
                [subscriptionId]
              );

              // Record the failed transaction
              if (invoice.payment_intent) {
                await client.query(
                  `INSERT INTO transactions (
                    user_id,
                    subscription_id,
                    stripe_invoice_id,
                    stripe_payment_intent_id,
                    amount,
                    currency,
                    status,
                    payment_method,
                    metadata
                  ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                  )`,
                  [
                    userId,
                    subscriptionId,
                    invoice.id,
                    invoice.payment_intent,
                    invoice.amount_due,
                    invoice.currency,
                    "failed",
                    "card",
                    JSON.stringify(invoice),
                  ]
                );
              }
            }
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new NextResponse("Webhook processed successfully", {
        status: 200,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    // Add more detailed error logging
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      console.error("Signature verification failed:", {
        payload: payload.slice(0, 100), // Log first 100 chars of payload
        signature: sig,
      });
    }
    return new NextResponse(
      error instanceof Error ? error.message : "Unknown error",
      { status: 400 }
    );
  }
}
