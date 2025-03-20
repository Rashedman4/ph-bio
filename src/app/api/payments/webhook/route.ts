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
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const { productType, userEmail } = paymentIntent.metadata;

          // Get package details
          const {
            rows: [package_],
          } = await client.query(
            `SELECT id, interval, interval_count 
             FROM packages 
             WHERE stripe_price_id = $1`,
            [productType]
          );

          if (!package_) {
            throw new Error(`Package not found for type: ${productType}`);
          }

          // Calculate end date based on package interval
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + package_.interval_count);

          // Create subscription record
          await client.query(
            `INSERT INTO subscriptions (
              user_id,
              package_id,
              status,
              start_date,
              end_date,
              stripe_payment_intent_id
            ) VALUES (
              (SELECT id FROM users WHERE email = $1),
              $2,
              'active',
              NOW(),
              $3,
              $4
            )`,
            [userEmail, package_.id, endDate, paymentIntent.id]
          );
          break;
        }

        /*  case "customer.subscription.created": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = (customer as Stripe.Customer).email;
          if (!customerEmail) {
            throw new Error("Customer email not found");
          }

          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null;

          const endDate = new Date();
          const intervalCount =
            subscription.items.data[0]?.price?.recurring?.interval_count || 1;
          endDate.setMonth(endDate.getMonth() + intervalCount);

          await client.query(
            `INSERT INTO subscriptions (
              user_id, 
              stripe_subscription_id, 
              package_id,
              status,
              start_date,
              end_date,
              trial_end
            ) VALUES (
              (SELECT id FROM users WHERE email = $1),
              $2,
              (SELECT id FROM packages WHERE stripe_price_id = $3),
              $4,
              NOW(),
              $5,
              $6
            )`,
            [
              customerEmail,
              subscription.id,
              subscription.items.data[0]?.price.id,
              subscription.status,
              endDate,
              trialEnd,
            ]
          );
          break;
        }
 */
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = checkoutSession.subscription as string;

          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            // Update the subscription data when checkout session is completed
            await client.query(
              "UPDATE subscriptions SET stripe_subscription_id = $1, status = 'active', current_period_start = to_timestamp($2), current_period_end = to_timestamp($3) WHERE stripe_customer_id = $4",
              [
                subscription.id,
                subscription.current_period_start,
                subscription.current_period_end,
                checkoutSession.customer,
              ]
            );
          }
          break;

        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const updatedSubscription = event.data.object;
          await client.query(
            "UPDATE subscriptions SET status = $1, current_period_start = to_timestamp($2), current_period_end = to_timestamp($3) WHERE stripe_subscription_id = $4",
            [
              updatedSubscription.status,
              updatedSubscription.current_period_start,
              updatedSubscription.current_period_end,
              updatedSubscription.id,
            ]
          );
          break;

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
