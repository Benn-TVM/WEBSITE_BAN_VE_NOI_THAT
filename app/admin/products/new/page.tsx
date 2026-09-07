'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Layers,
  Plus,
  Trash2,
  Eye,
  Download,
  Tag,
  FileCode2,
  Info,
  FolderPlus
} from 'lucide-react';

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
    slug: '',
    categoryId: 'cat-cong-da',
    sku: '',
    price: 200000,
    originalPrice: 350000,
    formats: 'AutoCAD .dwg, 3ds Max, JDpaint .jdp',
    fileSize: '85 MB',
    dimensions: 'Kích thước chuẩn Lỗ Ban phong thủy',
    fileName: '',
    description: '',
    details: 'Hồ sơ gồm: File AutoCAD 2D bổ chi tiết 100% cấu kiện; File 3D phối cảnh; Bảng dự toán khối lượng vật tư.',
    isFeatured: true,
    views: 0,
    downloads: 0,
  });

  // Multiple demo images array
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

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

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length === 1) {
      alert('Bản vẽ cần có ít nhất 1 ảnh đại diện!');
      return;
    }
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateImage = (index: number, newUrl: string) => {
    const updated = [...images];
    updated[index] = newUrl;
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validImages = images.filter((url) => url.trim().length > 0);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: validImages,
          imageUrl: validImages[0] || '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Đăng tải bản vẽ mới thành công! Bản vẽ đã xuất hiện trên website.');
        router.push('/admin/products');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi tạo bản vẽ');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể lưu bản vẽ mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  const xuConverted = Math.max(1, Math.round(formData.price / 1000));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-orange-600" />
            Đăng Tải Bản Vẽ Mới
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập đầy đủ thông số kỹ thuật, hình ảnh demo và giá bán để đưa hồ sơ lên website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PHẦN 1: THÔNG TIN CƠ BẢN & ĐỊNH DANH */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Tag className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              1. Thông Tin Nhận Diện & Phân Loại
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Tiêu đề */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tiêu đề bản vẽ (*):
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Bản vẽ cổng đá tam quan 3 mái tứ trụ chạm rồng đá Ninh Bình..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
              />
            </div>

            {/* Danh mục */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh mục phân loại (*):
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Slug URL */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Đường dẫn SEO (Slug URL - để trống sẽ tự sinh theo tiêu đề):
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-300 text-slate-500 px-3 py-2.5 text-xs rounded-l-xl font-mono">
                  /ban-ve/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ho-so-cong-da-tam-quan (tùy chọn)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-r-xl px-3 py-2.5 text-slate-900 text-xs font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Mã file SKU */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mã file SKU (Hiển thị [Mã file ...]):
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="VD: CD-TQ01 hoặc để trống tự sinh"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm uppercase font-mono font-bold focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* PHẦN 2: GIÁ BÁN & THƯƠNG MẠI */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileCode2 className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              2. Giá Bán & Thống Kê Hiển Thị
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Giá tải trọn gói (VNĐ) (*):
              </label>
              <input
                type="number"
                required
                min={0}
                step={1000}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-base font-extrabold text-orange-600 font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
              />
              <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                ≈ {xuConverted} Xu
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Giá gốc niêm yết (VNĐ):
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                (Hiển thị gạch ngang giảm giá)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                Lượt xem ban đầu:
              </label>
              <input
                type="number"
                min={0}
                value={formData.views}
                onChange={(e) => setFormData({ ...formData, views: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-mono focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Lượt mua ban đầu:
              </label>
              <input
                type="number"
                min={0}
                value={formData.downloads}
                onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-mono font-bold text-emerald-600 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* PHẦN 3: THÔNG SỐ KỸ THUẬT CAD & TỆP TIN */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              3. Thông Số Kỹ Thuật (Bảng Metadata Trang Chi Tiết)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Định dạng file:
              </label>
              <input
                type="text"
                value={formData.formats}
                onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
                placeholder="VD: AutoCAD .dwg, 3ds Max..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dung lượng file:
              </label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="VD: 85 MB, 1.5 GB..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kích thước / Phong thủy:
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="VD: Chuẩn Lỗ Ban, 10.5m x 4.2m..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên file nén (.zip/.rar):
              </label>
              <input
                type="text"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                placeholder="VD: Ho-so-cong-da-CD01.zip"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* PHẦN 4: HÌNH ẢNH DEMO CHI TIẾT (GALLERY CAD) */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-orange-600" />
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  4. Hình Ảnh Demo Bản Vẽ (Khung Xem Demo & Phóng To)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Ảnh đầu tiên là ảnh đại diện chính. Các ảnh tiếp theo sẽ hiển thị ở mục <strong>"HÌNH ẢNH DEMO BẢN VẼ"</strong> phóng to chi tiết.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-mono">
              {images.length} Ảnh
            </span>
          </div>

          {/* Danh sách ảnh hiện tại */}
          <div className="space-y-3">
            {images.map((url, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-24 h-18 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {url ? (
                    <img
                      src={url}
                      alt={`Demo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-orange-600 text-[9px] text-white text-center font-bold py-0.5 uppercase">
                      Ảnh chính
                    </span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      {idx === 0 ? '★ Ảnh đại diện chính (Cover Thumbnail):' : `Bản vẽ chi tiết demo #${idx + 1}:`}
                    </span>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUpdateImage(idx, e.target.value)}
                    placeholder="Nhập link ảnh (https://...)"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex sm:flex-col gap-1 shrink-0">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form thêm ảnh demo mới */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Dán link ảnh bản vẽ demo kỹ thuật CAD mới (https://...)"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Thêm Ảnh Demo
            </button>
          </div>
        </div>

        {/* PHẦN 5: NỘI DUNG MÔ TẢ & BÀN GIAO */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Info className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              5. Nội Dung Giới Thiệu & Chi Tiết Hồ Sơ Bàn Giao
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mô tả tóm tắt (Khung màu xám trên trang sản phẩm):
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Giới thiệu sơ lược về kiến trúc, đối tượng áp dụng, ưu điểm nổi bật..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Chi tiết hạng mục bàn giao (Hiển thị trong Tab "MÔ TẢ CHI TIẾT"):
              </label>
              <textarea
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="VD: File AutoCAD 2D bổ chi tiết 100% cấu kiện; File 3D phối cảnh; Bảng thống kê khối lượng vật tư..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* NỔI BẬT */}
        <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Đặt làm Bản vẽ Nổi Bật (VIP)</div>
              <div className="text-[11px] text-slate-500">Hiển thị ưu tiên ở trang chủ và gắn huy hiệu Nổi bật</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {/* THAO TÁC LƯU */}
        <div className="flex items-center justify-end space-x-3 pt-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider transition shadow-xs"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-7 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang đăng tải...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Đăng Tải Bản Vẽ Mới
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}