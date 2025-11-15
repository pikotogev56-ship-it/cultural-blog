import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import { THEME_COLORS } from "@/const";
import ArticleForm from "@/components/ArticleForm";
import QuoteForm from "@/components/QuoteForm";
import CategoryForm from "@/components/CategoryForm";

type AdminTab = "dashboard" | "articles" | "categories" | "quotes" | "settings";

export default function Admin() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("articles");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      setLocation("/");
    } else if (user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const sidebarItems = [
    { id: "articles", label: "إدارة المقالات", icon: Home },
    { id: "categories", label: "إدارة الأقسام", icon: Menu },
    { id: "quotes", label: "إدارة الاقتباسات", icon: Edit2 },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: THEME_COLORS.background }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 border-l border-gray-300 flex flex-col`}
        style={{ backgroundColor: THEME_COLORS.headerBg }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
              لوحة التحكم
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-200 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: activeTab === item.id ? THEME_COLORS.primary : "transparent",
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-300 space-y-2">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-semibold" style={{ color: THEME_COLORS.text }}>
                {user.name || "المسؤول"}
              </p>
              <p className="text-gray-500 text-xs">{user.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut size={16} className="mr-2" />
            {sidebarOpen && "تسجيل خروج"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة المقالات
                </h2>
                <Button
                  onClick={() => setShowArticleForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={20} />
                  مقالة جديدة
                </Button>
              </div>

              <div className="space-y-4">
                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
                        أهمية القراءة في حياتنا
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">القسم: مقالات متفرقة</p>
                      <p className="text-xs text-gray-500 mt-1">2024-11-16</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
                        الحضارة الإسلامية والعلوم
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">القسم: سيرة وتاريخ</p>
                      <p className="text-xs text-gray-500 mt-1">2024-11-15</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة الأقسام
                </h2>
                <Button
                  onClick={() => setShowCategoryForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={20} />
                  قسم جديد
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "مقالات متفرقة", count: 1, icon: "📚" },
                  { name: "من بطون الكتب", count: 2, icon: "📖" },
                  { name: "سيرة وتاريخ", count: 1, icon: "📜" },
                  { name: "معلومات طبية", count: 0, icon: "⚕️" },
                ].map((cat, idx) => (
                  <Card key={idx} className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <h3 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{cat.count} مقالة</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quotes Tab */}
          {activeTab === "quotes" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة الاقتباسات
                </h2>
                <Button
                  onClick={() => setShowQuoteForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={20} />
                  اقتباس جديد
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { text: "العلم نور والجهل ظلام", author: "الإمام الشافعي" },
                  { text: "الوقت هو أثمن ما يملكه الإنسان", author: "الحكماء" },
                ].map((quote, idx) => (
                  <Card key={idx} className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="italic text-lg" style={{ color: THEME_COLORS.text }}>
                          "{quote.text}"
                        </p>
                        <p className="text-sm text-gray-600 mt-2">— {quote.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: THEME_COLORS.text }}>
                الإعدادات
              </h2>

              <div className="space-y-6 max-w-2xl">
                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold text-lg mb-4" style={{ color: THEME_COLORS.text }}>
                    الألوان
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        اللون الأساسي
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue={THEME_COLORS.primary}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          defaultValue={THEME_COLORS.primary}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold text-lg mb-4" style={{ color: THEME_COLORS.text }}>
                    روابط التواصل الاجتماعي
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">فيسبوك</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">إنستغرام</label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">تويتر</label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </Card>

                <Button
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90 w-full"
                >
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Forms */}
      {showArticleForm && (
        <ArticleForm
          onClose={() => setShowArticleForm(false)}
          onSuccess={() => {
            setShowArticleForm(false);
            // Refresh articles list
          }}
        />
      )}
      {showQuoteForm && (
        <QuoteForm
          onClose={() => setShowQuoteForm(false)}
          onSuccess={() => {
            setShowQuoteForm(false);
            // Refresh quotes list
          }}
        />
      )}
      {showCategoryForm && (
        <CategoryForm
          onClose={() => setShowCategoryForm(false)}
          onSuccess={() => {
            setShowCategoryForm(false);
            // Refresh categories list
          }}
        />
      )}
    </div>
  );
}
