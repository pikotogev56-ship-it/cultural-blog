import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { THEME_COLORS, CATEGORIES } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface QuoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuoteForm({ onClose, onSuccess }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    source: "",
    categoryId: 2,
  });

  const [isLoading, setIsLoading] = useState(false);
  const createQuote = trpc.quotes.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createQuote.mutateAsync({
        text: formData.text,
        author: formData.author,
        source: formData.source || undefined,
        categoryId: formData.categoryId,
      });

      toast.success("تم إضافة الاقتباس بنجاح!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في إضافة الاقتباس");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
            إضافة اقتباس جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quote text */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              نص الاقتباس
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="أدخل نص الاقتباس"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              rows={4}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              المؤلف / المصدر
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="من قال هذا الاقتباس؟"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              required
            />
          </div>

          {/* Source (optional) */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              المصدر (اختياري)
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="مثال: كتاب، محاضرة، إلخ"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
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

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.text || !formData.author}
              style={{ backgroundColor: THEME_COLORS.primary }}
              className="text-white hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "جاري الإضافة..." : "إضافة الاقتباس"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
