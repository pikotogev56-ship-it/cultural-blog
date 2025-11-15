import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { THEME_COLORS, CATEGORIES } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Suspense, lazy } from "react";

// Lazy load Quill
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";

interface ArticleFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArticleForm({ onClose, onSuccess }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: 2, // Default to "مقالات متفرقة"
    featuredImage: "",
    isPublished: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const createArticle = trpc.articles.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      await createArticle.mutateAsync({
        title: formData.title,
        slug: slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 100),
        categoryId: formData.categoryId,
        featuredImage: formData.featuredImage || undefined,
        isPublished: formData.isPublished,
      });

      toast.success("تم إضافة المقالة بنجاح!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في إضافة المقالة");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-300" style={{ backgroundColor: THEME_COLORS.headerBg }}>
          <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
            إضافة مقالة جديدة
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              عنوان المقالة
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="أدخل عنوان المقالة"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              style={{ borderColor: THEME_COLORS.primary }}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              القسم
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
            >
              {CATEGORIES.filter(cat => cat.slug !== "home").map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الملخص (اختياري)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="ملخص قصير للمقالة"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              rows={2}
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              صورة المقالة (رابط الصورة)
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              محتوى المقالة
            </label>
            <div className="border border-gray-300 rounded overflow-hidden" style={{ minHeight: "300px" }}>
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <ReactQuill
                  value={formData.content}
                  onChange={handleContentChange}
                  theme="snow"
                  placeholder="اكتب محتوى المقالة هنا..."
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
                />
              </Suspense>
            </div>
          </div>

          {/* Publish checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              id="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isPublished" className="text-sm font-semibold" style={{ color: THEME_COLORS.text }}>
              نشر المقالة الآن
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title || !formData.content}
              style={{ backgroundColor: THEME_COLORS.primary }}
              className="text-white hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "جاري الإضافة..." : "إضافة المقالة"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
