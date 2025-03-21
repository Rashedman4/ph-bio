import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

// Function to fetch current price (replace with your actual API call)
async function fetchCurrentPrice(symbol: string) {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=${process.env.MY_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    return data[0].price;
  } catch (error) {
    console.error("Error fetching price:", error);
    throw error;
  }
}

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

    const { symbol, enterPrice, firstTarget, secondTarget, reason } = body;

    // Try to fetch current price first
    let currentPrice;
    try {
      currentPrice = await fetchCurrentPrice(symbol);
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Invalid symbol or unable to fetch current price" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO signals (symbol, type, enter_price, price_now, first_target, second_target, reason)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await client.query(query, [
      symbol,
      "Buy",
      enterPrice,
      currentPrice,
      firstTarget,
      secondTarget,
      reason,
    ]);
    client.release();

    // Revalidate the customer-facing signals route
    revalidatePath("/api/signals");

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding signal. error: " + error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const {
      id,
      symbol,
      type,
      enterPrice,
      priceNow,
      firstTarget,
      secondTarget,
      reason,
    } = await req.json();
    const client = await pool.connect();
    const query = `
      UPDATE signals
      SET symbol = $1, type = $2, enter_price = $3, price_now = $4, first_target = $5, second_target = $6, reason=$7
      WHERE id = $8
      RETURNING *;
    `;
    const result = await client.query(query, [
      symbol,
      type,
      enterPrice,
      priceNow,
      firstTarget,
      secondTarget,
      reason,
      id,
    ]);
    client.release();
    revalidatePath("/api/signals");

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating signal, error: " + error },
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
    const { id, closeSignal } = body;
    const client = await pool.connect();
    const signalResult = await client.query(
      "SELECT * FROM signals WHERE id = $1",
      [id]
    );

    if (signalResult.rowCount === 0) {
      client.release();
      return NextResponse.json({ error: "Signal not found" }, { status: 404 });
    }
    if (closeSignal === "yes") {
      const signal = signalResult.rows[0];
      const success = signal.enter_price < signal.price_now ? true : false;
      const historyQuery = `
      INSERT INTO signal_history (symbol, entrance_date, closing_date, in_price, out_price, success)
      VALUES ($1, $2, CURRENT_DATE, $3, $4, $5);
    `;
      await client.query(historyQuery, [
        signal.symbol,
        signal.date_opened,
        signal.enter_price,
        signal.price_now,
        success,
      ]);
    }
    await client.query("DELETE FROM signals WHERE id = $1", [id]);
    client.release();
    revalidatePath("/api/signals");
    revalidatePath("/api/signalHistory");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting signal. Error: " + error },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession();
  //const isAdmin = session?.user?.email === "rashed111222@yahoo.com";
  const email = session?.user?.email;
  const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(",") || [];
  const isAdmin = authorizedEmails.includes(email || "");

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const client = await pool.connect();
    const query = `SELECT * FROM signals`;
    const result = await client.query(query);
    client.release();

    if (isAdmin) {
      // Update prices and check targets for each signal
      const updatedSignals = await Promise.all(
        result.rows.map(async (signal) => {
          const currentPrice = await fetchCurrentPrice(signal.symbol);
          // Update the price
          const updateQuery = `
                      UPDATE signals
                      SET price_now = $1
                      WHERE id = $2
                      RETURNING *;
                    `;
          const updateResult = await client.query(updateQuery, [
            currentPrice,
            signal.id,
          ]);
          if (currentPrice >= signal.first_target) {
            // Close the signal if first target is reached
            await DELETE(
              new NextRequest(`${process.env.NEXTAUTH_URL}`, {
                method: "DELETE",
                body: JSON.stringify({ id: signal.id, closeSignal: "yes" }),
              })
            );
            return null; // Signal closed, don't include in the response
          } else {
            return updateResult.rows[0];
          }
        })
      );

      // Filter out null values (closed signals)
      const activeSignals = updatedSignals.filter((signal) => signal !== null);
      return NextResponse.json(activeSignals, { status: 200 });
    } else {
      // For non-admin users, just return the signals without updating
      return NextResponse.json(result.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching signals, error: " + error },
      { status: 500 }
    );
  }
}
