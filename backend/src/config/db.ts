import mysql from 'mysql2/promise';
import { env } from './env';

let connection: mysql.Connection;

export const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    });

    console.log("DB CONFIG:", {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  database: env.DB_NAME
});

    console.log('✅ Connected to Aiven MySQL');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const getDB = () => connection;