import { connectDB, getDB } from "../config/db";

async function seedSections() {

  await connectDB();
  const db = getDB();

  // Clear existing sections (courses seed resets IDs)
  await db.execute("DELETE FROM sections");
  await db.execute("ALTER TABLE sections AUTO_INCREMENT = 1");

  const [subjectRows] = (await db.execute(
    `SELECT id, title FROM subjects ORDER BY id ASC`
  )) as [Array<{ id: number; title: string }>, any];

  for (const subject of subjectRows) {
    const base = subject.title;

    const sections = [
      { subject_id: subject.id, title: `${base}: Introduction`, order_index: 1 },
      { subject_id: subject.id, title: `${base}: Core Concepts`, order_index: 2 },
      { subject_id: subject.id, title: `${base}: Practice & Project`, order_index: 3 },
    ];

    for (const s of sections) {
      await db.execute(
        `INSERT INTO sections (subject_id, title, order_index)
         VALUES (?, ?, ?)`,
        [s.subject_id, s.title, s.order_index]
      );
    }
  }

  console.log("Sections seeded successfully!");
  process.exit();

}

seedSections();