import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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

  try {
    const body = await req.json();
    const { title, symbol, price } = body;

    const client = await pool.connect();
    const query = `
      INSERT INTO news (title_en, title_ar, symbol, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await client.query(query, [
      title.en,
      title.ar,
      symbol,
      price,
    ]);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding news. error: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

  try {
    const body = await req.json();
    const { id } = body;
    const client = await pool.connect();
    const newResult = await client.query("SELECT * FROM news WHERE id = $1", [
      id,
    ]);
    console.log(newResult);

    if (newResult.rowCount === 0) {
      client.release();
      return NextResponse.json({ error: "news not found" }, { status: 404 });
    }

    await client.query("DELETE FROM news WHERE id = $1", [id]);
    client.release();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting news. Error: " + error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM news`;
    const result = await client.query(query);
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching news, error: " + error },
      { status: 500 }
    );
  }
}
