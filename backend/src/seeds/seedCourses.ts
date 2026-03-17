import { connectDB, getDB } from "../config/db";

async function seedCourses() {
  await connectDB();
  const db = getDB();

  // Clear existing demo data (recommended for development)
  await db.execute("DELETE FROM videos");
  await db.execute("DELETE FROM sections");
  await db.execute("DELETE FROM subjects");

  // Reset auto-increment so IDs are stable for other seeds
  await db.execute("ALTER TABLE subjects AUTO_INCREMENT = 1");
  await db.execute("ALTER TABLE sections AUTO_INCREMENT = 1");
  await db.execute("ALTER TABLE videos AUTO_INCREMENT = 1");

  const courses: Array<{
    id: number;
    title: string;
    instructor: string;
    rating: number;
    price: number;
    description: string;
    youtube_url: string;
  }> = [
    {
      id: 1,
      title: "JavaScript Complete Course",
      instructor: "John Smilga",
      rating: 4.7,
      price: 499,
      description: "Learn JavaScript from basics to advanced",
      youtube_url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    },
    {
      id: 2,
      title: "React Complete Course",
      instructor: "Maximilian Schwarzmuller",
      rating: 4.8,
      price: 549,
      description: "Build powerful frontend apps with React",
      youtube_url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      instructor: "Traversy Media",
      rating: 4.6,
      price: 499,
      description: "Build scalable backend APIs using Node.js",
      youtube_url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    },
    {
      id: 4,
      title: "MongoDB for Developers",
      instructor: "Academind",
      rating: 4.5,
      price: 399,
      description: "Learn MongoDB database from scratch",
      youtube_url: "https://www.youtube.com/watch?v=ExcRbA7fy_A",
    },
    {
      id: 5,
      title: "HTML & CSS Bootcamp",
      instructor: "Kevin Powell",
      rating: 4.7,
      price: 349,
      description: "Complete frontend fundamentals with HTML & CSS",
      youtube_url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
    },

    // New courses (15) - requested list
    {
      id: 6,
      title: "Python Full Course",
      instructor: "freeCodeCamp",
      rating: 4.8,
      price: 499,
      description: "Master Python fundamentals and build practical programs.",
      youtube_url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    },
    {
      id: 7,
      title: "Java Programming Masterclass",
      instructor: "Telusko",
      rating: 4.7,
      price: 399,
      description: "Learn Java from core concepts to real-world development.",
      youtube_url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    },
    {
      id: 8,
      title: "C++ Complete Course",
      instructor: "CodeWithHarry",
      rating: 4.6,
      price: 349,
      description: "C++ from basics to OOP and problem solving.",
      youtube_url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
    },
    {
      id: 9,
      title: "Data Structures & Algorithms",
      instructor: "Abdul Bari",
      rating: 4.9,
      price: 599,
      description: "Strengthen DSA fundamentals for interviews and coding.",
      youtube_url: "https://www.youtube.com/watch?v=8hly31xKli0",
    },
    {
      id: 10,
      title: "SQL Full Course",
      instructor: "freeCodeCamp",
      rating: 4.7,
      price: 299,
      description: "Learn SQL queries, joins, and database fundamentals.",
      youtube_url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    },
    {
      id: 11,
      title: "Spring Boot Course",
      instructor: "Amigoscode",
      rating: 4.8,
      price: 499,
      description: "Build modern Java APIs and services with Spring Boot.",
      youtube_url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    },
    {
      id: 12,
      title: "MERN Stack Full Course",
      instructor: "freeCodeCamp",
      rating: 4.8,
      price: 599,
      description: "Full-stack web apps with MongoDB, Express, React, and Node.",
      youtube_url: "https://www.youtube.com/watch?v=7CqJlxBYj-M",
    },
    {
      id: 13,
      title: "HTML & CSS Complete Course",
      instructor: "SuperSimpleDev",
      rating: 4.6,
      price: 199,
      description: "Modern HTML & CSS layouts, responsiveness, and styling.",
      youtube_url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
    },
    {
      id: 14,
      title: "Git & GitHub Crash Course",
      instructor: "Traversy Media",
      rating: 4.7,
      price: 199,
      description: "Version control essentials: Git workflows and GitHub basics.",
      youtube_url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    },
    {
      id: 15,
      title: "Machine Learning Basics",
      instructor: "freeCodeCamp",
      rating: 4.8,
      price: 599,
      description: "ML fundamentals: data, models, training, and evaluation.",
      youtube_url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
    },
    {
      id: 16,
      title: "React Advanced Concepts",
      instructor: "Net Ninja",
      rating: 4.7,
      price: 499,
      description: "Take React deeper with advanced patterns and best practices.",
      youtube_url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    },
    {
      id: 17,
      title: "Node.js Backend Course",
      instructor: "Traversy Media",
      rating: 4.6,
      price: 399,
      description: "Build backend services and REST APIs with Node.js.",
      youtube_url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    },
    {
      id: 18,
      title: "MongoDB Full Course",
      instructor: "freeCodeCamp",
      rating: 4.6,
      price: 399,
      description: "MongoDB essentials: collections, queries, indexes, and CRUD.",
      youtube_url: "https://www.youtube.com/watch?v=ofme2o29ngU",
    },
    {
      id: 19,
      title: "Docker Basics",
      instructor: "TechWorld with Nana",
      rating: 4.7,
      price: 299,
      description: "Docker fundamentals: images, containers, volumes, and compose.",
      youtube_url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    },
    {
      id: 20,
      title: "System Design Basics",
      instructor: "Gaurav Sen",
      rating: 4.8,
      price: 699,
      description: "Learn core system design principles and common patterns.",
      youtube_url: "https://www.youtube.com/watch?v=xpDnVSmNFX0",
    },

    // Additional courses (10) - SkillForge expansion
    {
      id: 21,
      title: "Python for Beginners",
      instructor: "CodeWithHarry",
      rating: 4.6,
      price: 399,
      description: "Start Python from scratch with fundamentals and practice.",
      youtube_url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    },
    {
      id: 22,
      title: "Java Full Course",
      instructor: "Telusko",
      rating: 4.7,
      price: 499,
      description: "Comprehensive Java course covering core to advanced topics.",
      youtube_url: "https://www.youtube.com/watch?v=grEKMHGYyns",
    },
    {
      id: 23,
      title: "C++ Programming",
      instructor: "freeCodeCamp",
      rating: 4.5,
      price: 349,
      description: "Learn C++ programming with OOP and problem-solving practice.",
      youtube_url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
    },
    {
      id: 24,
      title: "Data Structures & Algorithms",
      instructor: "Apna College",
      rating: 4.8,
      price: 599,
      description: "DSA fundamentals with patterns to improve coding interviews.",
      youtube_url: "https://www.youtube.com/watch?v=8hly31xKli0",
    },
    {
      id: 25,
      title: "SQL for Beginners",
      instructor: "Programming with Mosh",
      rating: 4.6,
      price: 299,
      description: "SQL basics: queries, filtering, joins, and real examples.",
      youtube_url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
    },
    {
      id: 26,
      title: "Spring Boot Crash Course",
      instructor: "Amigoscode",
      rating: 4.7,
      price: 449,
      description: "Build Spring Boot APIs quickly with best practices.",
      youtube_url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    },
    {
      id: 27,
      title: "MERN Stack Full Course",
      instructor: "freeCodeCamp",
      rating: 4.8,
      price: 699,
      description: "Build a full MERN app with auth, CRUD, and deployment tips.",
      youtube_url: "https://www.youtube.com/watch?v=7CqJlxBYj-M",
    },
    {
      id: 28,
      title: "HTML & CSS Complete Course",
      instructor: "SuperSimpleDev",
      rating: 4.5,
      price: 199,
      description: "Responsive HTML & CSS layouts with modern styling.",
      youtube_url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
    },
    {
      id: 29,
      title: "Git & GitHub Mastery",
      instructor: "Programming with Mosh",
      rating: 4.6,
      price: 249,
      description: "Master Git commands, branching, and GitHub collaboration.",
      youtube_url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    },
    {
      id: 30,
      title: "React Advanced Concepts",
      instructor: "Codevolution",
      rating: 4.7,
      price: 549,
      description: "Advanced React concepts to write scalable UI applications.",
      youtube_url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    },
  ];

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];

    await db.execute(
      `INSERT INTO subjects
      (id, title, description, order_index, instructor, thumbnail, rating, price, youtube_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.title,
        c.description,
        i + 1,
        c.instructor,
        null,
        c.rating,
        c.price,
        c.youtube_url,
      ]
    );
  }

  console.log("Courses seeded successfully!");
  process.exit();
}

seedCourses();