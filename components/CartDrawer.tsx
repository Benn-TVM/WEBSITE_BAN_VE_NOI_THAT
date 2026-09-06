'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  DownloadCloud, 
  FileText,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatVND } from '@/lib/vietqr';
import PaymentQRModal from '@/components/PaymentQRModal';

export default function CartDrawer() {
  const { user, openLoginModal } = useAuth();
  const { 
    items, 
    totalCount, 
    totalAmount, 
    totalXu, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!user) {
      closeCart();
      openLoginModal('Vui lòng đăng nhập tài khoản để tiến hành thanh toán bản vẽ!');
      return;
    }
    setIsQRModalOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>Giỏ Hàng Của Bạn</span>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full font-mono">
                  {totalCount}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">Hồ sơ bản vẽ kỹ thuật đã chọn</p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            title="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Giỏ hàng hiện đang trống</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Bạn chưa chọn bản vẽ nào. Hãy khám phá hàng trăm mẫu bản vẽ kiến trúc, hoa văn CNC chất lượng cao!
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition"
              >
                Khám Phá Bản Vẽ Ngay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const xu = Math.max(1, Math.round(item.price / 1000));
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-all shadow-2xs flex space-x-3 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                      <img
                        src={item.image || '/demo/cad-demo-1.png'}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/ban-ve/${item.slug}`}
                            onClick={closeCart}
                            className="text-xs font-bold text-slate-900 hover:text-orange-600 transition line-clamp-2 leading-snug"
                          >
                            {item.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition shrink-0"
                            title="Xóa khỏi giỏ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.categoryName && (
                          <span className="inline-block text-[10px] text-slate-500 mt-0.5">
                            Chuyên mục: <strong className="text-slate-700">{item.categoryName}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                        <div className="text-xs font-bold text-orange-600 font-mono">
                          {formatVND(item.price)}
                        </div>
                        <div className="text-[11px] text-amber-600 font-bold">
                          {xu} Xu
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer (only if has items) */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Total Price Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Số lượng:</span>
                <span className="font-bold text-slate-900 font-mono">{totalCount} bản vẽ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase">Tổng cộng:</span>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-orange-600 font-mono leading-none">
                    {formatVND(totalAmount)}
                  </div>
                  <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                    (~ {totalXu} Xu)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="p-2 rounded-lg bg-orange-50/70 border border-orange-200/60 text-[11px] text-orange-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Link tải file gửi tức thì • Hỗ trợ kỹ thuật 72h</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition active:scale-98"
              >
                <QrCode className="w-4 h-4" />
                <span>Thanh Toán Ngay Bằng VietQR ({totalCount})</span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/gio-hang"
                  onClick={closeCart}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 hover:text-orange-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                >
                  Xem Trang Giỏ Hàng
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-600 transition"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        )}

      </aside>

      {/* Cart Multi-Product Payment QR Modal */}
      {isQRModalOpen && (
        <PaymentQRModal
          cartItems={items}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onSuccess={() => {
            clearCart();
            closeCart();
          }}
        />
      )}
    </>
  );
}
