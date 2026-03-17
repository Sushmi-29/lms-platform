import { getDB } from '../config/db';

export interface Section {
  id: number;
  subject_id: number;
  title: string;
  order_index: number;
  videos: Video[];
}

export interface Video {
  id: number;
  section_id: number;
  title: string;
  youtube_url: string;
  duration_seconds: number;
  order_index: number;
}

export interface CreateSectionData {
  title: string;
  order_index: number;
}

export interface UpdateSectionData {
  title?: string;
  order_index?: number;
}

export const getSectionsBySubjectId = async (subjectId: number): Promise<Section[]> => {
  const db = getDB();

  const [rows] = await db.execute(`
    SELECT
      s.id as section_id, s.title as section_title, s.order_index as section_order,
      v.id as video_id, v.title as video_title, v.youtube_url, v.duration_seconds, v.order_index as video_order
    FROM sections s
    LEFT JOIN videos v ON s.id = v.section_id
    WHERE s.subject_id = ?
    ORDER BY s.order_index ASC, v.order_index ASC
  `, [subjectId]) as [any[], any];

  const sectionsMap = new Map<number, Section>();

  rows.forEach(row => {
    const sectionId = row.section_id;
    if (!sectionsMap.has(sectionId)) {
      sectionsMap.set(sectionId, {
        id: sectionId,
        subject_id: subjectId,
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

  return Array.from(sectionsMap.values()).sort((a, b) => a.order_index - b.order_index);
};

export const getSectionById = async (id: number): Promise<Section | null> => {
  const db = getDB();

  const [rows] = await db.execute(`
    SELECT
      s.id as section_id, s.subject_id, s.title as section_title, s.order_index as section_order,
      v.id as video_id, v.title as video_title, v.youtube_url, v.duration_seconds, v.order_index as video_order
    FROM sections s
    LEFT JOIN videos v ON s.id = v.section_id
    WHERE s.id = ?
    ORDER BY v.order_index ASC
  `, [id]) as [any[], any];

  if (rows.length === 0) {
    return null;
  }

  const sectionData = rows[0];
  const videos: Video[] = rows
    .filter(row => row.video_id)
    .map(row => ({
      id: row.video_id,
      section_id: id,
      title: row.video_title,
      youtube_url: row.youtube_url,
      duration_seconds: row.duration_seconds,
      order_index: row.video_order,
    }));

  return {
    id: sectionData.section_id,
    subject_id: sectionData.subject_id,
    title: sectionData.section_title,
    order_index: sectionData.section_order,
    videos,
  };
};

export const createSection = async (subjectId: number, data: CreateSectionData): Promise<Section> => {
  const db = getDB();
  const [result] = await db.execute(
    'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
    [subjectId, data.title, data.order_index]
  ) as [import('mysql2').ResultSetHeader, any];

  const sectionId = result.insertId;

  // Fetch the created section with videos (empty)
  const section = await getSectionById(sectionId);
  if (!section) {
    throw new Error('Failed to create section');
  }

  return section;
};

export const updateSection = async (id: number, data: UpdateSectionData): Promise<Section | null> => {
  const db = getDB();

  const fields = [];
  const values = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.order_index !== undefined) {
    fields.push('order_index = ?');
    values.push(data.order_index);
  }

  if (fields.length === 0) {
    return await getSectionById(id);
  }

  values.push(id);

  await db.execute(
    `UPDATE sections SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return await getSectionById(id);
};

export const deleteSection = async (id: number): Promise<boolean> => {
  const db = getDB();
  const [result] = await db.execute('DELETE FROM sections WHERE id = ?', [id]) as [import('mysql2').ResultSetHeader, any];
  return result.affectedRows > 0;
};