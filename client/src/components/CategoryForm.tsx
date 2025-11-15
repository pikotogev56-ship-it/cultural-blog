import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { THEME_COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryForm({ onClose, onSuccess }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: THEME_COLORS.primary,
  });

  const [isLoading, setIsLoading] = useState(false);
  const createCategory = trpc.categories.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createCategory.mutateAsync({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        icon: formData.icon || undefined,
        color: formData.color,
      });

      toast.success("تم إضافة القسم بنجاح!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في إضافة القسم");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconOptions = ["📚", "🎓", "⚕️", "📜", "✍️", "🏛️", "📖", "🔬"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl" style={{ backgroundColor: THEME_COLORS.headerBg }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold" style={{ color: THEME_COLORS.text }}>
            إضافة قسم جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              اسم القسم
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="أدخل اسم القسم"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الرابط (Slug)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="سيتم إنشاؤه تلقائياً"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              readOnly
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الوصف (اختياري)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="وصف القسم"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
              rows={3}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              الرمز (اختياري)
            </label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`text-2xl p-2 rounded border-2 transition ${
                    formData.icon === icon
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME_COLORS.text }}>
              اللون
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2"
                placeholder="#5B9BD5"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name}
              style={{ backgroundColor: THEME_COLORS.primary }}
              className="text-white hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "جاري الإضافة..." : "إضافة القسم"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
