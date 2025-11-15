import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import {
  APP_LOGO,
  APP_TITLE,
  CATEGORIES,
  MARQUEE_TEXT,
  SOCIAL_LINKS,
  FOOTER_TEXT,
  getLoginUrl,
} from "@/const";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [duplicatedMarquee] = useState([...MARQUEE_TEXT, ...MARQUEE_TEXT]);

  // Sample articles data (will be replaced with real data from API)
  const recentArticles = [
    {
      id: 1,
      title: "أهمية القراءة في حياتنا",
      excerpt: "القراءة هي نافذة على العالم وطريق نحو المعرفة والثقافة...",
      category: "مقالات متفرقة",
      image: "https://placehold.co/300x200/0066cc/ffffff?text=Article1",
      date: "2024-11-16",
    },
    {
      id: 2,
      title: "الصحة النفسية والعافية",
      excerpt: "الصحة النفسية جزء أساسي من صحتنا العامة وسعادتنا...",
      category: "معلومات طبية",
      image: "https://placehold.co/300x200/0066cc/ffffff?text=Article2",
      date: "2024-11-15",
    },
    {
      id: 3,
      title: "سيرة الإمام الشافعي",
      excerpt: "حياة عالم من أعظم علماء الإسلام وأثره على الفقه الإسلامي...",
      category: "سيرة وتاريخ",
      image: "https://placehold.co/300x200/0066cc/ffffff?text=Article3",
      date: "2024-11-14",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top bar with logo and social links */}
          <div className="py-4 flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-600">{APP_TITLE}</h1>
                <p className="text-xs text-gray-600">
                  مدونة ثقافية وتعليمية
                </p>
              </div>
            </div>

            {/* Social links - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Twitter size={20} />
              </a>
              {user ? (
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  تسجيل الخروج
                </Button>
              ) : (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  size="sm"
                  className="ml-2"
                >
                  دخول
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation bar */}
          <nav className="border-t border-gray-200 py-3">
            <div className="flex flex-wrap gap-2 md:gap-6 text-sm md:text-base overflow-x-auto pb-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="nav-link whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link inline-flex"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link inline-flex"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link inline-flex"
              >
                <Twitter size={20} />
              </a>
              {user ? (
                <Button onClick={logout} variant="outline" className="w-full">
                  تسجيل الخروج
                </Button>
              ) : (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="w-full"
                >
                  دخول
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-content">
          {duplicatedMarquee.map((text, index) => (
            <div key={index} className="marquee-item">
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              أهلاً وسهلاً بك في مدونتنا
            </h2>
            <p className="text-lg mb-6 opacity-90">
              مدونة متخصصة في نشر المحتوى الثقافي والتعليمي والإسلامي والطبي
            </p>
            {user ? (
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                الذهاب إلى لوحة التحكم
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                ابدأ الآن
              </Button>
            )}
          </div>
        </section>

        {/* Articles section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              آخر المقالات
            </h2>
            <Link href="/articles" className="text-blue-600 hover:text-blue-800">
              عرض الكل <ChevronRight className="inline" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Card key={article.id} className="article-card">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
                <div className="article-content">
                  <div className="article-meta mb-2">
                    <span className="text-blue-600 font-semibold">
                      {article.category}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <Link
                    href={`/article/${article.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    اقرأ المزيد →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            ماذا نقدم
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "مقالات متنوعة", icon: "📚" },
              { title: "محتوى تعليمي", icon: "🎓" },
              { title: "معلومات طبية", icon: "⚕️" },
              { title: "سيرة وتاريخ", icon: "📜" },
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold mb-4">عن المدونة</h3>
              <p className="text-gray-400 text-sm">
                مدونة متخصصة في نشر المحتوى الثقافي والتعليمي والإسلامي والطبي
                بجودة عالية وأسلوب سهل الفهم.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-bold mb-4">روابط سريعة</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    عنا
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="hover:text-white">
                    جميع المقالات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold mb-4">تابعنا</h3>
              <div className="flex gap-3">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6">
            <p className="footer-text">{FOOTER_TEXT}</p>
            <p className="footer-text text-gray-500 mt-2">
              © 2024 جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
