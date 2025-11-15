import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Bold, Italic, List, Link as LinkIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { THEME_COLORS } from "@/const";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ArticleEditorProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArticleEditor({ onClose, onSuccess }: ArticleEditorProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = trpc.categories.getAll.useQuery();
  const createArticle = trpc.articles.create.useMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, create a data URL (in production, upload to S3)
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    try {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      await createArticle.mutateAsync({
        title,
        slug,
        excerpt: summary || title,
        content,
        categoryId: parseInt(categoryId),
        featuredImage: imageUrl,
        isPublished: isPublished,
      });

      alert("تم نشر المقالة بنجاح!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error publishing article:", error);
      alert("حدث خطأ في نشر المقالة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: THEME_COLORS.background }}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ backgroundColor: THEME_COLORS.headerBg }}>
          <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
            مقالة جديدة
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              العنوان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المقالة"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"

            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الملخص
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="أدخل ملخص قصير للمقالة"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الصورة الرمزية
            </label>
            <div className="flex items-center gap-4">
              {imageUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2" style={{ borderColor: THEME_COLORS.primary }}>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90"
                style={{ backgroundColor: THEME_COLORS.primary }}
              >
                <Upload size={20} />
                رفع صورة
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
                القسم *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              >
                <option value="">اختر القسم</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
                اسم الكاتب
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="أدخل اسم الكاتب"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              محتوى المقالة *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                placeholder="اكتب محتوى المقالة هنا..."
                style={{ minHeight: "300px" }}
              />
            </div>
          </div>

          {/* Publish Options */}
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: THEME_COLORS.headerBg }}>
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="publish" className="cursor-pointer font-semibold" style={{ color: THEME_COLORS.text }}>
              نشر المقالة الآن
            </label>
            <span className="text-sm text-gray-600 ml-auto">
              {isPublished ? "سيتم نشرها فوراً" : "سيتم حفظها كمسودة"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-4 p-6 border-t" style={{ backgroundColor: THEME_COLORS.headerBg }}>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading}
            style={{ backgroundColor: THEME_COLORS.primary }}
            className="text-white hover:opacity-90"
          >
            {isLoading ? "جاري النشر..." : isPublished ? "نشر المقالة" : "حفظ كمسودة"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
