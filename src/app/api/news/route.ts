import { NextResponse } from "next/server";
import pool from "@/lib/db";

const NEWS_PER_PAGE = 15;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const offset = (page - 1) * NEWS_PER_PAGE;

  try {
    const client = await pool.connect();

    // Get total count
    const countResult = await client.query("SELECT COUNT(*) FROM news");
    const totalNews = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalNews / NEWS_PER_PAGE);

    // Get paginated news
    const query = `
      SELECT *
      FROM news
      ORDER BY published_date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await client.query(query, [NEWS_PER_PAGE, offset]);
    client.release();

    return NextResponse.json(
      {
        news: result.rows,
        totalPages,
        currentPage: page,
        totalNews,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching news, error: " + error },
      { status: 500 }
    );
  }
}
