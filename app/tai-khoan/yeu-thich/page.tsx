'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ProductCard';

export default function FavoriteDrawingsPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">Tài khoản</span>
        <span>&gt;</span>
        <span className="text-orange-600 font-semibold">Bản vẽ ưu thích</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0 border border-red-100">
            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
              Bản Vẽ Ưu Thích Của Bạn
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {favorites.length > 0
                ? `Bạn đang có ${favorites.length} bản vẽ trong danh sách yêu thích`
                : 'Danh sách các bản vẽ bạn đã bấm yêu thích để lưu lại tham khảo'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Xóa tất cả
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-orange-600 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 border border-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Khám phá thêm
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Chưa có bản vẽ nào trong mục yêu thích</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khi xem bất kỳ bản vẽ nào, hãy bấm nút <Heart className="w-3.5 h-3.5 inline text-rose-500" /> để lưu vào danh sách xem lại sau.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              Xem Kho Bản Vẽ
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={{
                id: fav.id,
                title: fav.title,
                slug: fav.slug,
                sku: fav.sku,
                price: fav.price,
                originalPrice: fav.originalPrice,
                formats: fav.formats || 'AutoCAD .dwg',
                fileSize: fav.fileSize || '',
                views: 0,
                downloads: 0,
                category: fav.categoryName ? { name: fav.categoryName, slug: '' } : null,
                images: fav.image ? [{ url: fav.image }] : [],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
