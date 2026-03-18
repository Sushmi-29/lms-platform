import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { getDB } from '../config/db';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
  verifyRefreshToken,
} from '../services/authService';

export const register = async (req: Request, res: Response) => {
  console.log("🚀 REGISTER HIT");
  console.log("📦 BODY:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }

  try {
    const db = getDB();
    console.log("✅ DB CONNECTED");

    // Check if user exists
    const [existingRows] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as [any[], any];

    console.log("🔍 Existing user check:", existingRows);

    if (existingRows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    console.log("🔐 Password hashed");

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    ) as [ResultSetHeader, any];

    console.log("✅ User inserted:", result);

    const userId = result.insertId;

    // Generate tokens
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storeRefreshToken(userId, refreshToken, expiresAt);

    console.log("🎉 REGISTER SUCCESS");

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: { id: userId, name, email },
    });

  } catch (error: any) {
    console.error("❌ REGISTER ERROR FULL:", error);

    return res.status(500).json({
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = getDB();

    const [userRows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as [any[], any];

    if (userRows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRows[0];

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storeRefreshToken(user.id, refreshToken, expiresAt);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error: any) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const tokenRow = await findRefreshToken(refreshToken);
    if (!tokenRow) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const userId = decoded.userId;

    const accessToken = generateAccessToken(userId);

    res.json({ accessToken });

  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    await deleteRefreshToken(refreshToken);
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error("❌ LOGOUT ERROR:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};