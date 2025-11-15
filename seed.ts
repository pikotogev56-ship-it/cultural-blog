import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  users,
  categories,
  articles,
  quotes,
  siteSettings,
} from "./drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Starting database seed...");

  try {
    // Add categories
    console.log("📁 Adding categories...");
    await db.insert(categories).values([
      {
        name: "الرئيسية",
        slug: "home",
        description: "الصفحة الرئيسية للمدونة",
        icon: "home",
        color: "#5B9BD5",
        order: 1,
      },
      {
        name: "مقالات متفرقة",
        slug: "articles",
        description: "مقالات متنوعة وشاملة",
        icon: "newspaper",
        color: "#5B9BD5",
        order: 2,
      },
      {
        name: "من بطون الكتب",
        slug: "books",
        description: "اقتباسات واستخلاصات من الكتب المهمة",
        icon: "book",
        color: "#5B9BD5",
        order: 3,
      },
      {
        name: "سيرة وتاريخ",
        slug: "history",
        description: "سير الأعلام والأحداث التاريخية",
        icon: "history",
        color: "#5B9BD5",
        order: 4,
      },
      {
        name: "معلومات طبية",
        slug: "medical",
        description: "معلومات صحية وطبية مهمة",
        icon: "heart",
        color: "#5B9BD5",
        order: 5,
      },
      {
        name: "مساحة للكُتاب",
        slug: "writers",
        description: "مساحة مفتوحة للكتاب والمساهمين",
        icon: "pen",
        color: "#5B9BD5",
        order: 6,
      },
      {
        name: "عنا",
        slug: "about",
        description: "معلومات عن المدونة والمؤلف",
        icon: "info",
        color: "#5B9BD5",
        order: 7,
      },
      {
        name: "سياسة الخصوصية",
        slug: "privacy",
        description: "سياسة الخصوصية والشروط",
        icon: "shield",
        color: "#5B9BD5",
        order: 8,
      },
    ]);

    // Add sample articles
    console.log("📝 Adding sample articles...");
    await db.insert(articles).values([
      {
        title: "أهمية القراءة في حياتنا",
        slug: "importance-of-reading",
        content:
          "القراءة هي نافذة على العالم وطريق نحو المعرفة والثقافة. تساعدنا على فهم أنفسنا والعالم من حولنا...",
        excerpt: "القراءة هي نافذة على العالم وطريق نحو المعرفة والثقافة...",
        categoryId: 2,
        authorId: 1,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "الصحة النفسية والعافية",
        slug: "mental-health-wellness",
        content:
          "الصحة النفسية جزء أساسي من صحتنا العامة وسعادتنا. يجب أن نهتم بها مثلما نهتم بصحتنا الجسدية...",
        excerpt: "الصحة النفسية جزء أساسي من صحتنا العامة وسعادتنا...",
        categoryId: 5,
        authorId: 1,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: "سيرة الإمام الشافعي",
        slug: "imam-shafii-biography",
        content:
          "محمد بن إدريس الشافعي هو أحد أعظم علماء الإسلام وصاحب المذهب الشافعي في الفقه الإسلامي...",
        excerpt: "حياة عالم من أعظم علماء الإسلام وأثره على الفقه الإسلامي...",
        categoryId: 4,
        authorId: 1,
        isPublished: true,
        publishedAt: new Date(),
      },
    ]);

    // Add sample quotes
    console.log("💬 Adding sample quotes...");
    await db.insert(quotes).values([
      {
        text: "العلم نور والجهل ظلام",
        author: "علي بن أبي طالب",
        source: "الحكم والأمثال الإسلامية",
        categoryId: 2,
        isPublished: true,
        order: 1,
      },
      {
        text: "من طلب العلا بغير كد وتعب أضاع العمر في طلب المحال",
        author: "أحمد شوقي",
        source: "الشعر العربي",
        categoryId: 2,
        isPublished: true,
        order: 2,
      },
      {
        text: "الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى",
        author: "الحكمة الشعبية",
        source: "الأمثال الشعبية",
        categoryId: 5,
        isPublished: true,
        order: 3,
      },
    ]);

    // Add site settings
    console.log("⚙️ Adding site settings...");
    await db.insert(siteSettings).values([
      {
        key: "site_title",
        value: "معتز العلقمي",
        type: "string",
      },
      {
        key: "primary_color",
        value: "#5B9BD5",
        type: "color",
      },
      {
        key: "secondary_color",
        value: "#f5f1e8",
        type: "color",
      },
      {
        key: "site_description",
        value: "مدونة ثقافية وتعليمية متخصصة في نشر المحتوى الثقافي والتعليمي والإسلامي والطبي",
        type: "string",
      },
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
