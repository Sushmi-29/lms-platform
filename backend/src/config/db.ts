import mysql from "mysql2/promise";
import { env } from "./env";

export let connection: mysql.Connection;

export const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log("✅ Connected to Aiven MySQL");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};
export default connection;