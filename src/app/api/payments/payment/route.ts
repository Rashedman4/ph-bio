import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PaymentRequest {
  productType: "3_months" | "6_months" | "1_year";
}

export async function POST(req: NextRequest) {
  try {
    // Get the token and extract user email
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      );
    }
    if (!token.email) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      );
    }

    const { productType } = (await req.json()) as PaymentRequest;
    const userEmail = token.email;

    const client = await pool.connect();
    try {
      // Get price ID from packages table
      const {
        rows: [package_],
      } = await client.query(
        `SELECT stripe_price_id, interval, interval_count, amount 
         FROM packages 
         WHERE stripe_price_id = $1`,
        [productType]
      );

      if (!package_) {
        return NextResponse.json(
          { error: "Invalid product type" },
          { status: 400 }
        );
      }

      // Check existing subscription
      const {
        rows: [subscription],
      } = await client.query(
        `SELECT id, status 
         FROM subscriptions 
         WHERE user_id = (SELECT id FROM users WHERE email = $1)
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userEmail]
      );
      console.log(subscription);
      // Create or retrieve customer
      const customer = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });
      let customerId = customer.data[0]?.id;

      if (!customerId) {
        const newCustomer = await stripe.customers.create({ email: userEmail });
        customerId = newCustomer.id;
      }

      // Determine trial eligibility
      /*    const isEligibleForTrial =
        !subscription || subscription.status !== "active"; */

      // Create payment intent instead of checkout session
      const paymentIntent = await stripe.paymentIntents.create({
        customer: customerId,
        setup_future_usage: "off_session",
        amount: package_.amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productType,
          userEmail,
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
