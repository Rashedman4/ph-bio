import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { unstable_cache } from "next/cache";

// Cache key and revalidation time
const CACHE_KEY = "signals";
const CACHE_TIME = 30; // 30 seconds

// Cached function
const getSignals = unstable_cache(
  async () => {
    const result = await pool.query("SELECT * FROM signals ORDER BY id DESC");
    return result.rows;
  },
  [CACHE_KEY],
  { revalidate: CACHE_TIME }
);

// GET handler
export const GET = async () => {
  try {
    const data = await getSignals();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching signals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
