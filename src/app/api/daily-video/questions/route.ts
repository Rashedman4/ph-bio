import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";
import { authOptions } from "@/lib/nextAuth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  console.log(content, session);
  const client = await pool.connect();
  try {
    const query = "INSERT INTO questions (user_id, content) VALUES ($1, $2)";
    await client.query(query, [session.user.id, content]);

    return NextResponse.json({ message: "Question added" }, { status: 201 });
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
      SELECT q.*, u.email, u.provider_email, u.provider
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
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
