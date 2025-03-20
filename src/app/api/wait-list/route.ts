import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import pool from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    // Check if user is already in waitlist
    const checkQuery = "SELECT * FROM waitinglist WHERE user_id = $1";
    const checkResult = await client.query(checkQuery, [session.user.id]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { message: "Already on waitlist" },
        { status: 409 }
      );
    }

    // Add to waitlist
    const insertQuery = "INSERT INTO waitinglist (user_id) VALUES ($1)";
    await client.query(insertQuery, [session.user.id]);

    return NextResponse.json({ message: "Added to waitlist" }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (session) {
    if (session.user) {
      if (session.user.email) {
        const authorizedEmails =
          process.env.AUTHORIZED_EMAILS?.split(",") || [];
        if (!authorizedEmails.includes(session.user.email)) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
      } else {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  }

  const client = await pool.connect();
  try {
    const query = `
      SELECT w.user_id,w.created_at, u.email, u.provider, u.provider_email, u.firstname, u.lastname
      FROM waitinglist w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
    `;
    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
