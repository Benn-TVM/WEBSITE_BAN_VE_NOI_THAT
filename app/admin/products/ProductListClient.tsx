'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderPlus, 
  Trash2, 
  ExternalLink, 
  Search, 
  Layers, 
  Sparkles,
  Download,
  Eye,
  Pencil
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useRouter } from 'next/navigation';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku?: string | null;
  price: number;
  formats: string;
  fileSize: string;
  isFeatured: boolean;
  views: number;
  downloads: number;
  category?: { name: string } | null;
  images: Array<{ url: string }>;
}

export default function ProductListClient({ initialProducts }: { initialProducts: ProductItem[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
    (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bản vẽ "${title}" khỏi hệ thống?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Lỗi khi xóa bản vẽ');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
            Kho Hồ Sơ Bản Vẽ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý {products.length} hồ sơ bản vẽ kỹ thuật đang bán trên hệ thống.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
        >
          <FolderPlus className="w-4 h-4 mr-1.5" />
          Đăng Tải Bản Vẽ Mới
        </Link>
      </div>

      {/* Filter search bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bản vẽ, mã SKU, danh mục..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-slate-500 font-mono font-medium">
          Hiển thị: <strong className="text-slate-800">{filtered.length}</strong>/{products.length} bản vẽ
        </span>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3.5">Ảnh & Bản vẽ</th>
                <th className="p-3.5">Mã SKU</th>
                <th className="p-3.5">Danh mục</th>
                <th className="p-3.5">Giá bán</th>
                <th className="p-3.5">Định dạng file</th>
                <th className="p-3.5">Lượt xem / mua</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={p.images[0]?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=200&q=80'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 hover:text-orange-600 transition line-clamp-1 block max-w-xs sm:max-w-sm">
                        {p.title}
                      </span>
                      {p.isFeatured && (
                        <span className="inline-flex items-center text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded mt-0.5">
                          <Sparkles className="w-2.5 h-2.5 mr-1" /> Nổi bật
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 font-medium">{p.sku || 'BV-VIP'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {p.category?.name || 'Mỹ nghệ'}
                    </span>
                  </td>
                  <td className="p-3.5 font-extrabold text-orange-600 font-mono text-sm">
                    {formatVND(p.price)}
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                    <div className="font-medium text-slate-800">{p.formats.split(',')[0]}</div>
                    <div className="text-[10px] text-slate-400">{p.fileSize}</div>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1 text-slate-400" />
                      {p.views} xem
                    </div>
                    <div className="flex items-center text-emerald-600 font-semibold">
                      <Download className="w-3 h-3 mr-1" />
                      {p.downloads} mua
                    </div>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <Link
                      href={`/ban-ve/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition inline-block"
                      title="Xem trang sản phẩm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition inline-block"
                      title="Chỉnh sửa bản vẽ"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition inline-block"
                      title="Xóa bản vẽ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}