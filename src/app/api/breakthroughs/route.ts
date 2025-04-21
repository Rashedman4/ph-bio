import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    const query = `
      SELECT * FROM breakthroughs 
      ORDER BY created_at DESC 
      LIMIT 3;
    `;
    const result = await client.query(query);
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching breakthroughs, error: " + error },
      { status: 500 }
    );
  }
}
