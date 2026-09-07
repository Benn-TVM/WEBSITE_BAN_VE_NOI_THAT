'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FolderPlus, Sparkles, Image as ImageIcon } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'cat-hoa-van', name: 'Hoa văn' },
  { id: 'cat-cong-da', name: 'Cổng đá' },
  { id: 'cat-lan-can', name: 'Lan can' },
  { id: 'cat-vach-ngan', name: 'Vách ngăn' },
  { id: 'cat-phu-dieu', name: 'Phù điêu' },
  { id: 'cat-mo-lang-mo', name: 'Mộ / Lăng mộ' },
  { id: 'cat-trang-tri', name: 'Trang trí' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'cat-cong-da',
    sku: '',
    price: 200000,
    originalPrice: 350000,
    formats: 'AutoCAD .dwg, 3ds Max, JDpaint .jdp',
    fileSize: '85 MB',
    dimensions: 'Kích thước chuẩn Lỗ Ban phong thủy',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: '',
    details: 'Hồ sơ gồm: File AutoCAD 2D bổ chi tiết 100% cấu kiện; File 3D phối cảnh; Bảng dự toán khối lượng vật tư.',
    isFeatured: true,
  });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data.categories[0].id,
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert('Thêm bản vẽ mới thành công!');
        router.push('/admin/products');
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể lưu bản vẽ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
            Thêm Bản Vẽ Mới
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập thông số, giá bán và ảnh demo để đưa bản vẽ lên bán trên website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tiêu đề bản vẽ (*):
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Bản vẽ cổng đá tam quan 3 mái tứ trụ Ninh Bình..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Danh mục (*):
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SKU, Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mã SKU:
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="VD: CD-089"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Giá bán (VNĐ) (*):
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-orange-600 text-sm font-bold focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Giá gốc trước giảm:
            </label>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
            />
          </div>
        </div>

        {/* Technical specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Định dạng phần mềm:
            </label>
            <input
              type="text"
              value={formData.formats}
              onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
              placeholder="AutoCAD .dwg, 3ds Max, JDpaint..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Dung lượng tải về:
            </label>
            <input
              type="text"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              placeholder="VD: 120 MB"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kích thước thiết kế:
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="VD: Rộng 6.2m x Cao 5.8m"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Image Preview URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
            <ImageIcon className="w-3.5 h-3.5 mr-1 text-orange-600" />
            Link Ảnh Demo / Render (URL):
          </label>
          <input
            type="text"
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
          />
          {formData.imageUrl && (
            <div className="mt-2.5 w-32 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
              <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Mô tả chi tiết bản vẽ:
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả công năng, vị trí thi công, chất lượng cấu kiện mộng ngàm..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Danh mục hồ sơ đính kèm trong file nén:
          </label>
          <textarea
            rows={3}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Gồm file CAD 2D, file 3D, file xuất máy CNC..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:bg-white leading-relaxed"
          ></textarea>
        </div>

        {/* Featured checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded text-orange-600 bg-slate-100 border-slate-300 focus:ring-orange-500"
          />
          <label htmlFor="isFeatured" className="text-xs text-slate-700 font-semibold cursor-pointer flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-600" />
            Đặt làm Bản Vẽ Nổi Bật trên Trang Chủ
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm active:scale-95 transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang lưu bản vẽ...' : 'Lưu & Đăng Bán Ngay'}
          </button>
        </div>

      </form>
    </div>
  );
}