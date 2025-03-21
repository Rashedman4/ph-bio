import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT s.id, u.email, p.name as package_name, p.price, s.end_date
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN packages p ON s.package_id = p.id
      WHERE s.status = 'active'
      ORDER BY s.end_date ASC
    `);
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching subscriptions" },
      { status: 500 }
    );
  }
}
