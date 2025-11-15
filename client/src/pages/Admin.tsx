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
  LogOut,
} from "lucide-react";
import { THEME_COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ArticleEditor from "@/components/ArticleEditor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type AdminTab = "articles" | "categories" | "quotes" | "settings";

export default function Admin() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("articles");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showArticleEditor, setShowArticleEditor] = useState(false);

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
    { id: "articles", label: "إدارة المقالات", icon: "📝" },
    { id: "categories", label: "إدارة الأقسام", icon: "📂" },
    { id: "quotes", label: "إدارة الاقتباسات", icon: "💬" },
    { id: "settings", label: "الإعدادات", icon: "⚙️" },
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
          {sidebarItems.map((item) => (
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
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
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
            <ArticlesTab
              onShowEditor={() => setShowArticleEditor(true)}
              showEditor={showArticleEditor}
              onCloseEditor={() => setShowArticleEditor(false)}
            />
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && <CategoriesTab />}

          {/* Quotes Tab */}
          {activeTab === "quotes" && <QuotesTab />}

          {/* Settings Tab */}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

// Articles Tab Component
function ArticlesTab({
  onShowEditor,
  showEditor,
  onCloseEditor,
}: {
  onShowEditor: () => void;
  showEditor: boolean;
  onCloseEditor: () => void;
}) {
  const { data: articles, refetch } = trpc.articles.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const deleteArticle = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المقالة بنجاح!");
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
          إدارة المقالات
        </h2>
        <Button
          onClick={onShowEditor}
          style={{ backgroundColor: THEME_COLORS.primary }}
          className="text-white hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={20} />
          مقالة جديدة
        </Button>
      </div>

      {showEditor && (
        <ArticleEditor
          onClose={onCloseEditor}
          onSuccess={() => refetch()}
        />
      )}

      <div className="space-y-4">
        {articles && articles.length > 0 ? (
          articles.map((article: any) => (
            <Card
              key={article.id}
              className="p-6"
              style={{ backgroundColor: THEME_COLORS.headerBg }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.excerpt || "بدون ملخص"}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    <span>
                      القسم:{" "}
                      {categories?.find((c: any) => c.id === article.categoryId)
                        ?.name || "غير محدد"}
                    </span>
                    <span>
                      {article.isPublished ? "✓ منشور" : "⊘ مسودة"}
                    </span>
                    <span>{new Date(article.createdAt).toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info("قريباً: تحرير المقالة")}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذه المقالة؟")) {
                        deleteArticle.mutate({ id: article.id });
                      }
                    }}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center text-gray-500">
            لا توجد مقالات حتى الآن
          </Card>
        )}
      </div>
    </div>
  );
}

// Categories Tab Component
function CategoriesTab() {
  const { data: categories, refetch } = trpc.categories.list.useQuery();
  const [newCategoryName, setNewCategoryName] = useState("");
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء القسم بنجاح!");
      setNewCategoryName("");
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("يرجى إدخال اسم القسم");
      return;
    }

    const slug = newCategoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    createCategory.mutate({
      name: newCategoryName,
      slug,
      description: "",
      color: THEME_COLORS.primary,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
          إدارة الأقسام
        </h2>
      </div>

      {/* Add new category */}
      <Card className="p-6 mb-8" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <h3 className="font-bold text-lg mb-4">إضافة قسم جديد</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="اسم القسم"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCreateCategory();
            }}
          />
          <Button
            onClick={handleCreateCategory}
            disabled={createCategory.isPending}
            style={{ backgroundColor: THEME_COLORS.primary }}
            className="text-white hover:opacity-90"
          >
            إضافة
          </Button>
        </div>
      </Card>

      {/* Categories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories && categories.length > 0 ? (
          categories.map((cat: any) => (
            <Card
              key={cat.id}
              className="p-6"
              style={{ backgroundColor: THEME_COLORS.headerBg }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: THEME_COLORS.text }}>
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {cat.description || "بدون وصف"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 size={16} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 col-span-2 text-center text-gray-500">
            لا توجد أقسام حتى الآن
          </Card>
        )}
      </div>
    </div>
  );
}

// Quotes Tab Component
function QuotesTab() {
  const { data: quotes, refetch } = trpc.quotes.list.useQuery();
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const createQuote = trpc.quotes.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الاقتباس بنجاح!");
      setNewQuoteText("");
      setNewQuoteAuthor("");
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleCreateQuote = () => {
    if (!newQuoteText.trim() || !newQuoteAuthor.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    createQuote.mutate({
      text: newQuoteText,
      author: newQuoteAuthor,
      source: "",
      categoryId: 1,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ color: THEME_COLORS.text }}>
          إدارة الاقتباسات
        </h2>
      </div>

      {/* Add new quote */}
      <Card className="p-6 mb-8" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <h3 className="font-bold text-lg mb-4">إضافة اقتباس جديد</h3>
        <div className="space-y-4">
          <textarea
            value={newQuoteText}
            onChange={(e) => setNewQuoteText(e.target.value)}
            placeholder="نص الاقتباس"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
          />
          <input
            type="text"
            value={newQuoteAuthor}
            onChange={(e) => setNewQuoteAuthor(e.target.value)}
            placeholder="اسم المؤلف"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={handleCreateQuote}
            disabled={createQuote.isPending}
            style={{ backgroundColor: THEME_COLORS.primary }}
            className="text-white hover:opacity-90 w-full"
          >
            إضافة الاقتباس
          </Button>
        </div>
      </Card>

      {/* Quotes list */}
      <div className="space-y-4">
        {quotes && quotes.length > 0 ? (
          quotes.map((quote: any) => (
            <Card
              key={quote.id}
              className="p-6"
              style={{ backgroundColor: THEME_COLORS.headerBg }}
            >
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
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center text-gray-500">
            لا توجد اقتباسات حتى الآن
          </Card>
        )}
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8" style={{ color: THEME_COLORS.text }}>
        الإعدادات
      </h2>

      <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-4">إعدادات الموقع</h3>
            <p className="text-gray-600">
              يمكنك تخصيص إعدادات الموقع من خلال لوحة التحكم. هذه الميزة قيد التطوير.
            </p>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h3 className="font-bold text-lg mb-4">وسائل التواصل الاجتماعي</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  رابط فيسبوك
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  رابط إنستغرام
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  رابط تويتر
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
