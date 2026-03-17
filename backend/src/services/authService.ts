import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/db';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const storeRefreshToken = async (userId: number, token: string, expiresAt: Date) => {
  const db = getDB();
  await db.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
};

export const deleteRefreshToken = async (token: string) => {
  const db = getDB();
  await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

export const findRefreshToken = async (token: string) => {
  const db = getDB();
  const [rows] = await db.execute(
    'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
    [token]
  ) as [any[], any] as [any[], any];
  return rows[0];
};