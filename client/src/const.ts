export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "معتز العلقمي";

export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "https://placehold.co/128x128/0066cc/ffffff?text=معتز";

// Site configuration
export const SITE_NAME = "معتز العلقمي";
export const SITE_DESCRIPTION = "مدونة ثقافية وتعليمية متخصصة في نشر المحتوى الثقافي والتعليمي والإسلامي والطبي";
export const SITE_AUTHOR = "معتز العلقمي";

// Social media links
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/your-profile",
  instagram: "https://www.instagram.com/your-profile",
  twitter: "https://twitter.com/your-profile",
};

// Categories
export const CATEGORIES = [
  { id: 1, name: "الرئيسية", slug: "home", icon: "home" },
  { id: 2, name: "مقالات متفرقة", slug: "articles", icon: "newspaper" },
  { id: 3, name: "من بطون الكتب", slug: "books", icon: "book" },
  { id: 4, name: "سيرة وتاريخ", slug: "history", icon: "history" },
  { id: 5, name: "معلومات طبية", slug: "medical", icon: "heart" },
  { id: 6, name: "مساحة للكُتاب", slug: "writers", icon: "pen" },
  { id: 7, name: "عنا", slug: "about", icon: "info" },
  { id: 8, name: "سياسة الخصوصية", slug: "privacy", icon: "shield" },
];

// Marquee text
export const MARQUEE_TEXT = ["ثقافي", "تعليمي", "إسلامي", "طبي"];

// Color theme - Soft sky blue and warm gray/brown
export const THEME_COLORS = {
  primary: "#5B9BD5", // Soft sky blue
  secondary: "#f5f1e8", // Warm beige/light brown
  accent: "#4A7BA7", // Darker sky blue
  text: "#2c2c2c", // Dark gray
  lightText: "#ffffff", // White
  background: "#f5f1e8", // Warm beige background
  darkBackground: "#e8dfd5", // Darker beige
  headerBg: "#ffffff", // White header
  footerBg: "#2c2c2c", // Dark footer
};

// Footer
export const FOOTER_TEXT = "حقوق النشر محفوظة لمعتز العلقمي";

// Type definitions
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface SocialLink {
  facebook: string;
  instagram: string;
  twitter: string;
}

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find(cat => cat.slug === slug);
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
