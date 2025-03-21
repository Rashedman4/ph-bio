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
    const totalResult = await client.query("SELECT COUNT(*) FROM users");
    const result = await client.query(`
      SELECT id, email, provider_email, phonenumber, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    client.release();

    return NextResponse.json({
      users: result.rows,
      total: parseInt(totalResult.rows[0].count),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
