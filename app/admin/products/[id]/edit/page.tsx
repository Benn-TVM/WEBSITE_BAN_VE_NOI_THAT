'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Layers,
  ExternalLink
} from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    sku: '',
    price: 0,
    originalPrice: 0,
    formats: '',
    fileSize: '',
    dimensions: '',
    imageUrl: '',
    description: '',
    details: '',
    isFeatured: false,
    slug: '',
  });

  // Load product data & categories
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const catRes = await fetch('/api/admin/categories');
        const catData = await catRes.json();
        if (catData.success && catData.categories) {
          setCategories(catData.categories);
        }

        // Fetch product
        const prodRes = await fetch(`/api/admin/products?id=${productId}`);
        const prodData = await prodRes.json();
        
        if (prodData.success && prodData.product) {
          const p = prodData.product;
          setFormData({
            title: p.title || '',
            categoryId: p.categoryId || '',
            sku: p.sku || '',
            price: p.price || 0,
            originalPrice: p.originalPrice || 0,
            formats: p.formats || '',
            fileSize: p.fileSize || '',
            dimensions: p.dimensions || '',
            imageUrl: p.images?.[0]?.url || '',
            description: p.description || '',
            details: p.details || '',
            isFeatured: Boolean(p.isFeatured),
            slug: p.slug || '',
          });
        } else {
          alert('Không tìm thấy bản vẽ!');
          router.push('/admin/products');
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin bản vẽ:', err);
        alert('Lỗi kết nối máy chủ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Cập nhật bản vẽ thành công!');
        router.push('/admin/products');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật bản vẽ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Đang tải dữ liệu hồ sơ bản vẽ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
                Chỉnh Sửa Bản Vẽ
              </h1>
              {formData.sku && (
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                  {formData.sku}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật thông tin kỹ thuật, giá bán và hình ảnh cho bản vẽ.
            </p>
          </div>
        </div>

        {formData.slug && (
          <Link
            href={`/ban-ve/${formData.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition"
          >
            <span>Xem trang mua</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        )}
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
              placeholder="VD: Bản vẽ cổng đá tam quan 3 mái tứ trụ..."
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {categories.length === 0 && (
                <option value={formData.categoryId}>Mặc định</option>
              )}
            </select>
          </div>
        </div>

        {/* Pricing & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Giá bán (VNĐ) (*):
            </label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-bold text-orange-600 focus:outline-none focus:border-orange-500 focus:bg-white"
            />
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mã SKU:
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="VD: BV-CD-001"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm uppercase focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Technical specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Định dạng file đính kèm:
            </label>
            <input
              type="text"
              value={formData.formats}
              onChange={(e) => setFormData({ ...formData, formats: e.target.value })}
              placeholder="VD: AutoCAD .dwg, 3ds Max, JDpaint..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Dung lượng file nén:
            </label>
            <input
              type="text"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              placeholder="VD: 85 MB, 1.2 GB..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
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
              placeholder="VD: 10.5m x 4.2m Lỗ Ban..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Image Preview & URL */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Link hình ảnh demo bản vẽ (*):
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-36 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... hoặc link ảnh online"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                Nhập link ảnh rõ nét để hiển thị ở trang chủ, chi tiết sản phẩm và giỏ hàng.
              </p>
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô tả ngắn gọn về bản vẽ:
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giới thiệu về phong cách kiến trúc, đối tượng áp dụng..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Chi tiết các hạng mục bàn giao:
            </label>
            <textarea
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Hồ sơ gồm những file gì, hướng dẫn sử dụng, phần mềm yêu cầu..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Featured checkbox */}
        <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Đặt làm Bản vẽ Nổi Bật</div>
              <div className="text-[11px] text-slate-500">Hiển thị ưu tiên ở trang chủ và huy hiệu VIP</div>
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider transition"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu Thay Đổi
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
