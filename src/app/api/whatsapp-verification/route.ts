import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phoneNumber } = await request.json();
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit pin

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO user_whatsapp (user_id, phone_number, pin_code)
        VALUES ($1, $2, $3)
        RETURNING pin_code
      `;
      const result = await client.query(query, [
        session.user.id,
        phoneNumber,
        pinCode,
      ]);

      return NextResponse.json(
        {
          pinCode: result.rows[0].pin_code,
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
