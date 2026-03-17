import express from "express";
import { checkSubscription, createSubscription } from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/:subjectId", authMiddleware, checkSubscription);

router.post("/", authMiddleware, createSubscription);

export default router;