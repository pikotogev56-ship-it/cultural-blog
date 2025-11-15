import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  articles,
  categories,
  quotes,
  menuItems,
  siteSettings,
  comments,
  tags,
  articleTags,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Article queries
export async function getRecentArticles(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(articles)
    .where(eq(articles.isPublished, true))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getArticlesByCategory(categoryId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(articles)
    .where(eq(articles.categoryId, categoryId))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

// Category queries
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories).orderBy(categories.order);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Quote queries
export async function getRandomQuotes(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(quotes)
    .where(eq(quotes.isPublished, true))
    .orderBy(quotes.order)
    .limit(limit);
}

// Menu queries
export async function getMenuItems() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isActive, true))
    .orderBy(menuItems.order);
}

// Settings queries
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  return result.length > 0 ? result[0].value : null;
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(siteSettings);
}

// Comment queries
export async function getArticleComments(articleId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(comments)
    .where(eq(comments.articleId, articleId))
    .orderBy(desc(comments.createdAt));
}

// Tag queries
export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tags);
}

export async function getArticleTags(articleId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(articleTags)
    .where(eq(articleTags.articleId, articleId));
}
