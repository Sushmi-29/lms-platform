import { connectDB, getDB } from "../config/db";

async function seedVideos() {

  await connectDB();
  const db = getDB();

  await db.execute("DELETE FROM videos");
  await db.execute("ALTER TABLE videos AUTO_INCREMENT = 1");

  const [subjects] = (await db.execute(
    `SELECT id, title, youtube_url FROM subjects ORDER BY id ASC`
  )) as [Array<{ id: number; title: string; youtube_url: string | null }>, any];

  for (const subject of subjects) {
    const [sections] = (await db.execute(
      `SELECT id, order_index FROM sections WHERE subject_id = ? ORDER BY order_index ASC`,
      [subject.id]
    )) as [Array<{ id: number; order_index: number }>, any];

    if (!sections.length) continue;

    const s1 = sections.find((s) => s.order_index === 1)?.id ?? sections[0].id;
    const s2 =
      sections.find((s) => s.order_index === 2)?.id ?? sections[Math.min(1, sections.length - 1)].id;
    const s3 =
      sections.find((s) => s.order_index === 3)?.id ?? sections[Math.min(2, sections.length - 1)].id;

    const baseTitle = subject.title;
    const introUrl = subject.youtube_url || "https://www.youtube.com/watch?v=W6NZfCO5SIk";

    const videos = [
      {
        section_id: s1,
        title: `${baseTitle} - Course Overview`,
        youtube_url: introUrl,
        duration_seconds: 1800,
        order_index: 1,
      },
      {
        section_id: s2,
        title: `${baseTitle} - Core Lesson`,
        youtube_url: introUrl,
        duration_seconds: 2400,
        order_index: 1,
      },
      {
        section_id: s3,
        title: `${baseTitle} - Practice Session`,
        youtube_url: introUrl,
        duration_seconds: 2100,
        order_index: 1,
      },
    ];

    for (const v of videos) {
      await db.execute(
        `INSERT INTO videos (section_id, title, youtube_url, duration_seconds, order_index)
         VALUES (?, ?, ?, ?, ?)`,
        [v.section_id, v.title, v.youtube_url, v.duration_seconds, v.order_index]
      );
    }
  }

  console.log("Videos seeded successfully!");
  process.exit();

}

seedVideos();