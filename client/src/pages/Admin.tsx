import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Quote,
  Menu,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Settings,
  Home,
} from "lucide-react";
import { THEME_COLORS } from "@/const";
import ArticleForm from "@/components/ArticleForm";
import QuoteForm from "@/components/QuoteForm";
import CategoryForm from "@/components/CategoryForm";

type AdminTab = "dashboard" | "articles" | "categories" | "quotes" | "settings";

export default function Admin() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      setLocation("/");
      return;
    }
    if (user.role !== "admin") {
      setLocation("/");
      return;
    }
  }, [user, setLocation]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "articles", label: "المقالات", icon: FileText },
    { id: "categories", label: "الأقسام", icon: FolderOpen },
    { id: "quotes", label: "الاقتباسات", icon: Quote },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: THEME_COLORS.background }}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 border-r border-gray-300`}
        style={{ backgroundColor: THEME_COLORS.headerBg }}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-300">
          <h2
            className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}
            style={{ color: THEME_COLORS.primary }}
          >
            لوحة التحكم
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: activeTab === item.id ? THEME_COLORS.primary : "transparent",
                }}
              >
                <Icon size={20} />
                <span className={!sidebarOpen ? "hidden" : ""}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setLocation("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-gray-700 hover:bg-gray-100 mb-2"
          >
            <Home size={20} />
            <span className={!sidebarOpen ? "hidden" : ""}>العودة للموقع</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className={!sidebarOpen ? "hidden" : ""}>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: THEME_COLORS.text }}>
              مرحباً {user.name}
            </h1>
            <p className="text-gray-600">أهلاً وسهلاً في لوحة التحكم الخاصة بك</p>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">إجمالي المقالات</p>
                      <p className="text-3xl font-bold" style={{ color: THEME_COLORS.primary }}>
                        3
                      </p>
                    </div>
                    <FileText size={32} style={{ color: THEME_COLORS.primary, opacity: 0.3 }} />
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">الأقسام</p>
                      <p className="text-3xl font-bold" style={{ color: THEME_COLORS.primary }}>
                        8
                      </p>
                    </div>
                    <FolderOpen size={32} style={{ color: THEME_COLORS.primary, opacity: 0.3 }} />
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">الاقتباسات</p>
                      <p className="text-3xl font-bold" style={{ color: THEME_COLORS.primary }}>
                        3
                      </p>
                    </div>
                    <Quote size={32} style={{ color: THEME_COLORS.primary, opacity: 0.3 }} />
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">المستخدمون</p>
                      <p className="text-3xl font-bold" style={{ color: THEME_COLORS.primary }}>
                        1
                      </p>
                    </div>
                    <LayoutDashboard size={32} style={{ color: THEME_COLORS.primary, opacity: 0.3 }} />
                  </div>
                </Card>
              </div>

              <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: THEME_COLORS.text }}>
                  ملخص النشاط
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded">
                    <div>
                      <p className="font-semibold">آخر مقالة منشورة</p>
                      <p className="text-sm text-gray-600">أهمية القراءة في حياتنا</p>
                    </div>
                    <span className="text-xs text-gray-500">2024-11-16</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded">
                    <div>
                      <p className="font-semibold">الموقع نشط وجاهز</p>
                      <p className="text-sm text-gray-600">جميع الخدمات تعمل بشكل طبيعي</p>
                    </div>
                    <span className="text-xs text-green-600">✓ نشط</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة المقالات
                </h2>
                <Button
                  onClick={() => setShowArticleForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90"
                >
                  <Plus size={20} className="mr-2" />
                  مقالة جديدة
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, title: "أهمية القراءة في حياتنا", category: "مقالات متفرقة", date: "2024-11-16" },
                  { id: 2, title: "الصحة النفسية والعافية", category: "معلومات طبية", date: "2024-11-15" },
                  { id: 3, title: "سيرة الإمام الشافعي", category: "سيرة وتاريخ", date: "2024-11-14" },
                ].map((article) => (
                  <Card key={article.id} className="p-4" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold" style={{ color: THEME_COLORS.text }}>
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {article.category} • {article.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة الأقسام
                </h2>
                <Button
                  onClick={() => setShowCategoryForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90"
                >
                  <Plus size={20} className="mr-2" />
                  قسم جديد
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "مقالات متفرقة", count: 1 },
                  { name: "من بطون الكتب", count: 0 },
                  { name: "سيرة وتاريخ", count: 1 },
                  { name: "معلومات طبية", count: 1 },
                  { name: "مساحة للكُتاب", count: 0 },
                  { name: "عنا", count: 0 },
                  { name: "سياسة الخصوصية", count: 0 },
                ].map((cat, idx) => (
                  <Card key={idx} className="p-4" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold" style={{ color: THEME_COLORS.text }}>
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600">{cat.count} مقالة</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit size={16} />
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
                  إدارة الاقتباسات
                </h2>
                <Button
                  onClick={() => setShowQuoteForm(true)}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90"
                >
                  <Plus size={20} className="mr-2" />
                  اقتباس جديد
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { text: "العلم نور والجهل ظلام", author: "علي بن أبي طالب" },
                  { text: "من طلب العلا بغير كد وتعب أضاع العمر في طلب المحال", author: "أحمد شوقي" },
                  { text: "الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى", author: "الحكمة الشعبية" },
                ].map((quote, idx) => (
                  <Card key={idx} className="p-4" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="italic text-gray-700 mb-2">"{quote.text}"</p>
                        <p className="text-sm text-gray-600">— {quote.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
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
              <h2 className="text-2xl font-bold mb-6" style={{ color: THEME_COLORS.text }}>
                إعدادات الموقع
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold mb-4" style={{ color: THEME_COLORS.text }}>
                    الألوان
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">اللون الأساسي</label>
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
                    <div>
                      <label className="block text-sm font-semibold mb-2">لون الخلفية</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue={THEME_COLORS.background}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          defaultValue={THEME_COLORS.background}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold mb-4" style={{ color: THEME_COLORS.text }}>
                    معلومات الموقع
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">عنوان الموقع</label>
                      <input
                        type="text"
                        defaultValue="معتز العلقمي"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">الوصف</label>
                      <textarea
                        defaultValue="مدونة متخصصة في نشر المحتوى الثقافي والتعليمي والإسلامي والطبي"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold mb-4" style={{ color: THEME_COLORS.text }}>
                    وسائل التواصل
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">فيسبوك</label>
                      <input
                        type="text"
                        placeholder="رابط فيسبوك"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">إنستغرام</label>
                      <input
                        type="text"
                        placeholder="رابط إنستغرام"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">تويتر</label>
                      <input
                        type="text"
                        placeholder="رابط تويتر"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ backgroundColor: THEME_COLORS.headerBg }}>
                  <h3 className="font-bold mb-4" style={{ color: THEME_COLORS.text }}>
                    الخطوط
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">خط العنوان</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded">
                        <option>Playfair Display</option>
                        <option>Cairo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">خط النص</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded">
                        <option>Cairo</option>
                        <option>Playfair Display</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>

              <Button
                style={{ backgroundColor: THEME_COLORS.primary }}
                className="text-white hover:opacity-90 mt-6"
              >
                حفظ التغييرات
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Forms */}
      {showArticleForm && (
        <ArticleForm
          onClose={() => setShowArticleForm(false)}
          onSuccess={() => setShowArticleForm(false)}
        />
      )}
      {showQuoteForm && (
        <QuoteForm
          onClose={() => setShowQuoteForm(false)}
          onSuccess={() => setShowQuoteForm(false)}
        />
      )}
      {showCategoryForm && (
        <CategoryForm
          onClose={() => setShowCategoryForm(false)}
          onSuccess={() => setShowCategoryForm(false)}
        />
      )}
    </div>
  );
}
