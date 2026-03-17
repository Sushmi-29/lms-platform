import { getDB } from "../config/db";

export const createVideo = async (sectionId: number, data: any) => {

  const { title, youtube_url, duration_seconds, order_index } = data;

  const db = getDB();

  const [result]: any = await db.execute(
    `INSERT INTO videos 
    (section_id, title, youtube_url, duration_seconds, order_index)
    VALUES (?, ?, ?, ?, ?)`,
    [sectionId, title, youtube_url, duration_seconds, order_index]
  );

  return {
    id: result.insertId,
    section_id: sectionId,
    title,
    youtube_url,
    duration_seconds,
    order_index
  };
};
export const getVideosBySection = async (sectionId: number) => {
  const db = getDB();

  const [rows] = await db.execute(
    "SELECT * FROM videos WHERE section_id = ? ORDER BY order_index ASC",
    [sectionId]
  );

  return rows;
};