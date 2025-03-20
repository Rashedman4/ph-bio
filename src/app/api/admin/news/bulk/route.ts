import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(",") || [];
  if (!authorizedEmails.includes(session.user.email)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const newsItems = await req.json();
    if (!Array.isArray(newsItems)) {
      return NextResponse.json(
        { error: "Input must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = `
        INSERT INTO news (title_en, title_ar, symbol, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const results = [];
      for (const item of newsItems) {
        console.log(item.title.en);
        const result = await client.query(insertQuery, [
          item.title.en,
          item.title.ar,
          item.symbol,
          item.price,
        ]);
        results.push(result.rows[0]);
      }

      await client.query("COMMIT");
      return NextResponse.json(results, { status: 201 });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding news. error: " + error },
      { status: 500 }
    );
  }
}
