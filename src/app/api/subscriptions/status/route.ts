import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    // Get the token and extract user email
    const session = await getServerSession();

    if (!session?.user.email) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      );
    }

    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `SELECT status, end_date 
         FROM subscriptions 
         WHERE user_id = (SELECT id FROM users WHERE email = $1)
         AND status = 'active'
         AND end_date > NOW()
         ORDER BY created_at DESC 
         LIMIT 1`,
        [session.user.email]
      );

      return NextResponse.json({
        isActive: rows.length > 0,
        endDate: rows[0]?.end_date || null,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
