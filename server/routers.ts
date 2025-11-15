import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getRecentArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getAllCategories,
  getCategoryBySlug,
  getRandomQuotes,
  getMenuItems,
  getSetting,
  getAllSettings,
  getArticleComments,
  getAllTags,
  getArticleTags,
  getDb,
} from "./db";
import {
  articles,
  categories,
  quotes,
  menuItems,
  siteSettings,
  comments,
  tags,
  articleTags,
} from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Blog content procedures
  articles: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(articles).orderBy(desc(articles.createdAt));
    }),

    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await getRecentArticles(input.limit);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getArticleBySlug(input.slug);
      }),

    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await getArticlesByCategory(input.categoryId, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          content: z.string(),
          excerpt: z.string().optional(),
          categoryId: z.number().optional(),
          featuredImage: z.string().optional(),
          isPublished: z.boolean().default(true),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(articles).values({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.isPublished ? new Date() : null,
        });

        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          categoryId: z.number().optional(),
          featuredImage: z.string().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...updateData } = input;
        return await db
          .update(articles)
          .set({
            ...updateData,
            publishedAt:
              updateData.isPublished === true ? new Date() : undefined,
          })
          .where(eq(articles.id, id));
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.delete(articles).where(eq(articles.id, input.id));
      }),
  }),

  categories: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(categories).orderBy(desc(categories.createdAt));
    }),

    getAll: publicProcedure.query(async () => {
      return await getAllCategories();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getCategoryBySlug(input.slug);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          icon: z.string().optional(),
          color: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.insert(categories).values(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          color: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...updateData } = input;
        return await db
          .update(categories)
          .set(updateData)
          .where(eq(categories.id, id));
      }),
  }),

  quotes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
    }),

    getRandom: publicProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(async ({ input }) => {
        return await getRandomQuotes(input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          text: z.string(),
          author: z.string(),
          source: z.string().optional(),
          categoryId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.insert(quotes).values(input);
      }),
  }),

  menu: router({
    getItems: publicProcedure.query(async () => {
      return await getMenuItems();
    }),

    create: protectedProcedure
      .input(
        z.object({
          label: z.string(),
          url: z.string(),
          icon: z.string().optional(),
          parentId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.insert(menuItems).values(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          label: z.string().optional(),
          url: z.string().optional(),
          icon: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { id, ...updateData } = input;
        return await db
          .update(menuItems)
          .set(updateData)
          .where(eq(menuItems.id, id));
      }),
  }),

  settings: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await getSetting(input.key);
      }),

    getAll: publicProcedure.query(async () => {
      return await getAllSettings();
    }),

    update: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const existing = await db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.key, input.key))
          .limit(1);

        if (existing.length > 0) {
          return await db
            .update(siteSettings)
            .set({ value: input.value })
            .where(eq(siteSettings.key, input.key));
        } else {
          return await db.insert(siteSettings).values(input);
        }
      }),
  }),

  comments: router({
    getByArticle: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return await getArticleComments(input.articleId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return await db.insert(comments).values({
          ...input,
          authorId: ctx.user.id,
          isApproved: false,
        });
      }),
  }),

  tags: router({
    getAll: publicProcedure.query(async () => {
      return await getAllTags();
    }),

    getByArticle: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return await getArticleTags(input.articleId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
