import mysql from "mysql2/promise";
import { env } from "./env";

let connection: mysql.Connection;

export const connectDB = async () => {
  connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  console.log("✅ Connected to DB");
};

// ✅ ADD THIS (IMPORTANT FIX)
export const getDB = () => {
  if (!connection) {
    throw new Error("DB not connected");
  }
  return connection;
};

// ✅ ALSO EXPORT connection (for new code)
export { connection };