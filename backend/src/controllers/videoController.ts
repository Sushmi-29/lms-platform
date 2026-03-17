import {getDB} from "../config/db";
import { Request, Response, NextFunction} from "express";
import { createVideo, getVideosBySection } from "../services/videoService";

export const createVideoController = async (req: Request, res: Response) => {
  try {
    const sectionId = Number(req.params.sectionId);

    const { title, youtube_url, duration_seconds, order_index } = req.body;

    const video = await createVideo(sectionId, {
      title,
      youtube_url,
      duration_seconds,
      order_index
    });

    res.status(201).json({
      data: video
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
export const getVideosBySectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = Number(req.params.sectionId);
    const videos = await getVideosBySection(sectionId);

    res.json({
      data: videos
    });
  } catch (error) {
    next(error);
  }
};
export const getVideoByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const videoId = Number(req.params.videoId);

    const db = getDB();

    const [rows] = await db.execute(
      "SELECT * FROM videos WHERE id = ?",
      [videoId]
    )as any[];

    res.json({
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};