import { getDB } from "../config/db";
import { Request, Response } from "express";

export const checkSubscription = async (req: Request, res: Response) => {
    try {

        const db = getDB();

        const userId = (req as any).user.id;
        const { subjectId } = req.params;

        const [rows]: any = await db.query(
            "SELECT * FROM subscriptions WHERE user_id = ? AND subject_id = ?",
            [userId, subjectId]
        );

        res.json({
            subscribed: rows.length > 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    try {

        const db = getDB();
        const userId = (req as any).user.id;
        const { subjectId } = req.body;

        await db.query(
            "INSERT INTO subscriptions (user_id, subject_id) VALUES (?, ?)",
            [userId, subjectId]
        );

        res.json({
            message: "Subscription created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};