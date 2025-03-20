import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER, // Your PostgreSQL user
  host: process.env.DB_HOST, // Your PostgreSQL host
  database: process.env.DB_NAME, // Your PostgreSQL database name
  password: process.env.DB_PASS, // Your PostgreSQL password
  port: parseInt(process.env.DB_PORT as string, 10), // Your PostgreSQL port
});

pool.on("connect", () => {});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
