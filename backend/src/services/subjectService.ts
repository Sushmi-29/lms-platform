import { getDB } from "../config/db";

export interface Subject {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  youtube_url: string | null;
  rating: number | null;
  price: number | null;
  instructor: string | null;
  order_index: number;
  contents?: { title: string; time: number }[];
}

export interface CreateSubjectData {
  title: string;
  description?: string;
  order_index: number;
}

export interface UpdateSubjectData {
  title?: string;
  description?: string;
  order_index?: number;
}

export interface Video {
  id: number;
  section_id: number;
  title: string;
  youtube_url: string;
  duration_seconds: number;
  order_index: number;
}

export interface Section {
  id: number;
  subject_id: number;
  title: string;
  order_index: number;
  videos: Video[];
}

export interface SubjectWithSections {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  youtube_url: string | null;
  rating: number | null;
  price: number | null;
  instructor: string | null;
  order_index: number;
  sections: Section[];
  contents?: { title: string; time: number }[];
}

function generateThumbnail(
  youtubeUrl: string | null,
  existingThumbnail: string | null
): string | null {
  if (youtubeUrl) {
    const match = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  return existingThumbnail;
}

/* -------------------- GET ALL SUBJECTS -------------------- */

export const getAllSubjects = async (): Promise<Subject[]> => {
  const db = getDB();

  const [rows] = await db.execute(
    `SELECT id,title,description,thumbnail,youtube_url,rating,price,instructor,order_index
     FROM subjects
     ORDER BY order_index ASC`
  ) as [any[], any];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnail: generateThumbnail(row.youtube_url, row.thumbnail),
    youtube_url: row.youtube_url,
    rating: row.rating,
    price: row.price,
    instructor: row.instructor,
    order_index: row.order_index,
  }));
};

/* -------------------- GET SUBJECT BY ID -------------------- */

export const getSubjectById = async (
  id: number
): Promise<SubjectWithSections | null> => {
  const db = getDB();

  const [subjectRows] = await db.execute(
    `SELECT id,title,description,thumbnail,youtube_url,rating,price,instructor,order_index,contents
     FROM subjects
     WHERE id = ?`,
    [id]
  ) as [any[], any];

  if (subjectRows.length === 0) return null;

  const subject = subjectRows[0];

  console.log("DB CONTENTS:", subject.contents);

  let contents: { title: string; time: number }[] = [];

  if (subject.contents) {
    if (typeof subject.contents === "string") {
      try {
        contents = JSON.parse(subject.contents);
      } catch {
        contents = [];
      }
    } else {
      contents = subject.contents;
    }
  }

  const [sectionRows] = await db.execute(
    `
    SELECT
      s.id as section_id,
      s.title as section_title,
      s.order_index as section_order,
      v.id as video_id,
      v.title as video_title,
      v.youtube_url,
      v.duration_seconds,
      v.order_index as video_order
    FROM sections s
    LEFT JOIN videos v ON s.id = v.section_id
    WHERE s.subject_id = ?
    ORDER BY s.order_index ASC, v.order_index ASC
  `,
    [id]
  ) as [any[], any];

  const sectionsMap = new Map<number, Section>();

  sectionRows.forEach((row) => {
    const sectionId = row.section_id;

    if (!sectionsMap.has(sectionId)) {
      sectionsMap.set(sectionId, {
        id: sectionId,
        subject_id: id,
        title: row.section_title,
        order_index: row.section_order,
        videos: [],
      });
    }

    if (row.video_id) {
      sectionsMap.get(sectionId)!.videos.push({
        id: row.video_id,
        section_id: sectionId,
        title: row.video_title,
        youtube_url: row.youtube_url,
        duration_seconds: row.duration_seconds,
        order_index: row.video_order,
      });
    }
  });

  const sections = Array.from(sectionsMap.values()).sort(
    (a, b) => a.order_index - b.order_index
  );

  return {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    thumbnail: generateThumbnail(subject.youtube_url, subject.thumbnail),
    youtube_url: subject.youtube_url,
    rating: subject.rating,
    price: subject.price,
    instructor: subject.instructor,
    order_index: subject.order_index,
    sections: sections,
    contents: subject.contents,
  };
};

/* -------------------- CREATE SUBJECT -------------------- */

export const createSubject = async (
  data: CreateSubjectData
): Promise<Subject> => {
  const db = getDB();

  const [result] = await db.execute(
    `INSERT INTO subjects (title,description,order_index)
     VALUES (?,?,?)`,
    [data.title, data.description || null, data.order_index]
  ) as [import("mysql2").ResultSetHeader, any];

  const subjectId = result.insertId;

  const [rows] = await db.execute(
    `SELECT * FROM subjects WHERE id=?`,
    [subjectId]
  ) as [any[], any];

  const subject = rows[0];

  return {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    thumbnail: generateThumbnail(subject.youtube_url, subject.thumbnail),
    youtube_url: subject.youtube_url,
    rating: subject.rating,
    price: subject.price,
    instructor: subject.instructor,
    order_index: subject.order_index,
  };
};

/* -------------------- UPDATE SUBJECT -------------------- */

export const updateSubject = async (
  id: number,
  data: UpdateSubjectData
): Promise<Subject | null> => {
  const db = getDB();

  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    fields.push("title=?");
    values.push(data.title);
  }

  if (data.description !== undefined) {
    fields.push("description=?");
    values.push(data.description);
  }

  if (data.order_index !== undefined) {
    fields.push("order_index=?");
    values.push(data.order_index);
  }

  if (fields.length === 0) return null;

  values.push(id);

  await db.execute(
    `UPDATE subjects SET ${fields.join(",")} WHERE id=?`,
    values
  );

  const [rows] = await db.execute(
    `SELECT * FROM subjects WHERE id=?`,
    [id]
  ) as [any[], any];

  if (rows.length === 0) return null;

  const subject = rows[0];

  return {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    thumbnail: generateThumbnail(subject.youtube_url, subject.thumbnail),
    youtube_url: subject.youtube_url,
    rating: subject.rating,
    price: subject.price,
    instructor: subject.instructor,
    order_index: subject.order_index,
  };
};

/* -------------------- DELETE SUBJECT -------------------- */

export const deleteSubject = async (id: number): Promise<boolean> => {
  const db = getDB();

  const [result] = await db.execute(
    `DELETE FROM subjects WHERE id=?`,
    [id]
  ) as [import("mysql2").ResultSetHeader, any];

  return result.affectedRows > 0;
};