import express from "express";
import { createVideoController, getVideosBySectionController, getVideoByIdController } from "../controllers/videoController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/* Create video */
router.post(
"/sections/:sectionId/videos",
authMiddleware,
createVideoController
);

/* Get videos of a section */
router.get(
"/sections/:sectionId/videos",
getVideosBySectionController
);

router.get(
    "/:videoId",
    getVideoByIdController
);

export default router;