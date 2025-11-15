import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, ArrowLeft, Save, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { THEME_COLORS } from "@/const";
import { toast } from "sonner";

type ArticleFormData = {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  featuredImage?: string;
  isPublished: boolean;
};

export default function ArticlesManager() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    excerpt: "",
    content: "",
    categoryId: 1,
    isPublished: true,
  });

  // Fetch articles
  const { data: articlesData } = trpc.articles.list.useQuery();
  const { data: categoriesData } = trpc.categories.list.useQuery();

  // Mutations
  const createArticle = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("تم نشر المقالة بنجاح!");
      resetForm();
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const updateArticle = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث المقالة بنجاح!");
      resetForm();
      setShowForm(false);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const deleteArticle = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المقالة بنجاح!");
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  useEffect(() => {
    if (articlesData) setArticles(articlesData);
    if (categoriesData) setCategories(categoriesData);
  }, [articlesData, categoriesData]);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      categoryId: 1,
      isPublished: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("يرجى ملء جميع الحقول المطلوبة!");
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    if (editingId) {
      updateArticle.mutate({
        id: editingId,
        ...formData,
        slug,
      });
    } else {
      createArticle.mutate({
        ...formData,
        slug,
      });
    }
  };

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      categoryId: article.categoryId,
      featuredImage: article.featuredImage,
      isPublished: article.isPublished,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المقالة؟")) {
      deleteArticle.mutate({ id });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>يرجى تسجيل الدخول أولاً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME_COLORS.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ color: THEME_COLORS.primary }}>
            إدارة المقالات
          </h1>
          {!showForm && (
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              style={{ backgroundColor: THEME_COLORS.primary }}
              className="text-white hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={20} />
              مقالة جديدة
            </Button>
          )}
        </div>

        {/* Article Form */}
        {showForm && (
          <div
            className="mb-8 p-6 rounded-lg border-2"
            style={{
              borderColor: THEME_COLORS.primary,
              backgroundColor: "#f9f9f9",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "تحرير المقالة" : "مقالة جديدة"}
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  العنوان *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="أدخل عنوان المقالة"
                  className="w-full"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  الملخص
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="أدخل ملخص المقالة"
                  className="w-full h-24"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  القسم *
                </label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      categoryId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  المحتوى *
                </label>
                <ReactQuill
                  value={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                  theme="snow"
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      ["blockquote", "code-block"],
                      [{ header: 1 }, { header: 2 }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  className="h-64 mb-12"
                />
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">نشر المقالة الآن</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  className="text-white hover:opacity-90 flex items-center gap-2"
                  disabled={
                    createArticle.isPending || updateArticle.isPending
                  }
                >
                  <Save size={20} />
                  {editingId ? "حفظ التعديلات" : "نشر المقالة"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">المقالات المنشورة</h2>
          {articles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              لا توجد مقالات حتى الآن
            </p>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
                  style={{
                    borderColor: THEME_COLORS.primary,
                    backgroundColor: "#fff",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          القسم:{" "}
                          {categories.find((c) => c.id === article.categoryId)
                            ?.name || "غير محدد"}
                        </span>
                        <span>
                          {article.isPublished ? "منشور" : "مسودة"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
