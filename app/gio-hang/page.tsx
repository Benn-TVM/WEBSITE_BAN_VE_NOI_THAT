'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  DownloadCloud, 
  FileText,
  ShoppingBag,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatVND } from '@/lib/vietqr';
import PaymentQRModal from '@/components/PaymentQRModal';

export default function CartPage() {
  const { user, openLoginModal } = useAuth();
  const { items, totalCount, totalAmount, totalXu, removeFromCart, clearCart } = useCart();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">Giỏ hàng của bạn</span>
      </nav>

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2.5">
            <span className="w-2 h-6 bg-orange-500 rounded-sm inline-block"></span>
            Giỏ Hàng ({totalCount} bản vẽ)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm tra danh sách hồ sơ bản vẽ kỹ thuật CAD & CNC trước khi thanh toán
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="self-start sm:self-auto inline-flex items-center text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Làm trống giỏ hàng
          </button>
        )}
      </div>

      {/* Cart Content */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-16 text-center shadow-xs space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bạn chưa thêm bản vẽ nào vào giỏ hàng. Hãy khám phá kho bản vẽ phong phú của chúng tôi để chọn mẫu ưng ý nhất!
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition active:scale-98"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Khám Phá Bản Vẽ Ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>Hồ sơ bản vẽ ({items.length})</span>
                <span>Đơn giá</span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const xu = Math.max(1, Math.round(item.price / 1000));
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                    >
                      {/* Product details */}
                      <div className="flex items-start space-x-3.5 sm:space-x-4 min-w-0 flex-1">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.image || '/demo/cad-demo-1.png'}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Title & metadata */}
                        <div className="space-y-1 min-w-0 flex-1">
                          {item.categoryName && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
                              {item.categoryName}
                            </span>
                          )}
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            <Link href={`/ban-ve/${item.slug}`} className="hover:text-orange-600 transition">
                              {item.title}
                            </Link>
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono pt-0.5">
                            {item.sku && <span>Mã: <strong className="text-slate-700">{item.sku}</strong></span>}
                            {item.formats && (
                              <>
                                <span>•</span>
                                <span>Định dạng: <strong className="text-slate-700">{item.formats}</strong></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="text-sm sm:text-base font-extrabold text-orange-600 font-mono">
                            {formatVND(item.price)}
                          </div>
                          <div className="text-[11px] text-amber-600 font-bold">
                            {xu} Xu
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-slate-400 hover:text-red-600 font-medium flex items-center space-x-1 sm:mt-2 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Back link */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700 space-x-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tiếp tục tìm kiếm thêm bản vẽ khác</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border-2 border-orange-500 p-5 sm:p-6 shadow-sm space-y-5 sticky top-20">
              
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                  <span>Tóm Tắt Đơn Hàng</span>
                  <span className="text-xs text-orange-600 font-bold font-mono">{totalCount} bản vẽ</span>
                </h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Tổng tiền bản vẽ:</span>
                  <span className="font-bold text-slate-900 font-mono">{formatVND(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chiết khấu ưu đãi:</span>
                  <span className="font-bold text-emerald-600 font-mono">- 0 đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quy đổi Xu:</span>
                  <span className="font-bold text-amber-600 font-mono">{totalXu} Xu</span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase">Tổng Thanh Toán:</div>
                  <div className="text-[11px] text-slate-400">Đã bao gồm đầy đủ quyền tải</div>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-extrabold text-orange-600 font-mono">
                    {formatVND(totalAmount)}
                  </div>
                  <div className="text-xs font-bold text-amber-600">
                    (~ {totalXu} Xu)
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    openLoginModal('Vui lòng đăng nhập tài khoản để tiến hành thanh toán đơn hàng!');
                    return;
                  }
                  setIsQRModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition active:scale-98 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Thanh Toán Ngay Bằng VietQR</span>
              </button>

              {/* Guarantee bullets */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kích hoạt link tải tức thì ngay sau khi chuyển khoản thành công.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Bảo hành file lỗi 1 đổi 1 trong 72 giờ và hỗ trợ kỹ thuật Zalo.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <DownloadCloud className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>File nén sạch .ZIP đầy đủ file AutoCAD .dwg và 3D/CNC.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Cart Multi-Product Payment QR Modal */}
      {isQRModalOpen && (
        <PaymentQRModal
          cartItems={items}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          onSuccess={() => {
            clearCart();
          }}
        />
      )}
    </div>
  );
}
