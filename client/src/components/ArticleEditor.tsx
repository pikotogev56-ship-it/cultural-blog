import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { THEME_COLORS } from "@/const";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

interface ArticleEditorProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArticleEditor({ onClose, onSuccess }: ArticleEditorProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [featuredImage, setFeaturedImage] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = trpc.categories.getAll.useQuery();
  const createArticle = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("تم نشر المقالة بنجاح!");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, create a data URL (in production, upload to S3)
    const reader = new FileReader();
    reader.onload = (event) => {
      setFeaturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    try {
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await createArticle.mutateAsync({
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        categoryId,
        featuredImage: featuredImage || undefined,
        isPublished,
      });
    } catch (error) {
      console.error("Error publishing article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-8" style={{ backgroundColor: THEME_COLORS.headerBg }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
          مقالة جديدة
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            العنوان *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان المقالة"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": THEME_COLORS.primary } as any}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            الملخص
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="أدخل ملخص المقالة"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 h-24"
            style={{ "--tw-ring-color": THEME_COLORS.primary } as any}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            القسم *
          </label>
          <select
            value={categoryId || ""}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": THEME_COLORS.primary } as any}
          >
            <option value="">اختر القسم</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            الصورة المميزة
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload size={16} />
              اختر صورة
            </button>
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            المحتوى *
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
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
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold">نشر المقالة الآن</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handlePublish}
            disabled={isLoading || createArticle.isPending}
            style={{ backgroundColor: THEME_COLORS.primary }}
            className="text-white hover:opacity-90"
          >
            {isLoading || createArticle.isPending ? "جاري النشر..." : "نشر المقالة"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            إلغاء
          </Button>
        </div>
      </div>
    </Card>
  );
}
