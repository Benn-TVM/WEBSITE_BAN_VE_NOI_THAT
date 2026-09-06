'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Eye, Layers, Sparkles, Star, ShoppingCart, Heart } from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku?: string | null;
    price: number;
    originalPrice?: number | null;
    formats: string;
    fileSize: string;
    dimensions?: string | null;
    isFeatured?: boolean;
    views: number;
    downloads: number;
    category?: {
      name: string;
      slug: string;
    } | null;
    images?: Array<{ url: string }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, openLoginModal } = useAuth();
  const { addToCart, isItemInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
  const inCart = isItemInCart(product.id);
  const isFav = isFavorite(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group rounded-xl bg-white border border-slate-200 hover:border-orange-500 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden bg-white border-b border-slate-100 flex items-center justify-center p-1.5">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category & Badge overlay */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-wrap gap-1 sm:gap-1.5 z-10">
          {product.category && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider rounded bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-xs truncate max-w-[120px]">
              {product.category.name}
            </span>
          )}
          {product.isFeatured && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-bold rounded bg-orange-500 text-white flex items-center shadow-xs">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              HOT
            </span>
          )}
        </div>

        {discountPercent && (
          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-bold rounded bg-red-600 text-white shadow">
            -{discountPercent}%
          </div>
        )}

        {/* Formats label bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1.5 sm:p-2 flex items-center justify-between text-[10px] sm:text-[11px] text-white">
          <span className="truncate max-w-[70%] font-mono font-medium">
            {product.formats.split(',')[0]}
          </span>
          <span className="text-white font-mono text-[9px] sm:text-[10px] bg-black/40 px-1 sm:px-1.5 py-0.5 rounded backdrop-blur-xs">
            {product.fileSize}
          </span>
        </div>
      </div>

      {/* Body info */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/ban-ve/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-1 sm:mb-2 min-h-[32px] sm:min-h-[40px]">
              {product.title}
            </h3>
          </Link>

          {/* Software & 5 Star Rating like KhoBanVe */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3">
            <span className="text-slate-600 font-medium truncate max-w-[50%]">{product.formats.split(',')[0]}</span>
            <div className="flex items-center text-amber-500 shrink-0">
              <div className="hidden xs:flex">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] sm:text-[11px] text-slate-400 ml-1 font-semibold">5.0</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-medium">Giá tải file:</div>
            <div className="flex items-baseline space-x-1 sm:space-x-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-orange-600 font-mono leading-none">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  openLoginModal('Vui lòng đăng nhập để lưu bản vẽ vào mục Yêu thích!');
                  return;
                }
                toggleFavorite({
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  sku: product.sku,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: primaryImage,
                  formats: product.formats,
                  fileSize: product.fileSize,
                  categoryName: product.category?.name,
                });
              }}
              className={`p-1.5 rounded-lg border transition ${
                isFav
                  ? 'bg-rose-50 text-rose-500 border-rose-300'
                  : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border-slate-200 hover:border-rose-300'
              }`}
              title={isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  openLoginModal('Vui lòng đăng nhập để thêm bản vẽ vào giỏ hàng!');
                  return;
                }
                addToCart({
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  sku: product.sku,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: primaryImage,
                  formats: product.formats,
                  fileSize: product.fileSize,
                  categoryName: product.category?.name,
                });
              }}
              className={`p-1.5 rounded-lg border transition ${
                inCart
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'
              }`}
              title={inCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  openLoginModal('Vui lòng đăng nhập tài khoản trước khi mua bản vẽ!');
                  return;
                }
                window.location.href = `/ban-ve/${product.slug}`;
              }}
              className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 text-center cursor-pointer"
            >
              Mua
            </button>
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-50 border-t border-slate-100 flex justify-between text-[10px] sm:text-[11px] text-slate-500">
        <span className="flex items-center">
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-slate-400" />
          {product.views} xem
        </span>
        <span className="flex items-center text-emerald-600 font-medium">
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
          {product.downloads} đã tải
        </span>
      </div>
    </div>
  );
}