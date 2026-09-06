import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { 
  History, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Receipt,
  User
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export default async function PurchaseHistoryPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_token')?.value;

  if (!userId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Vui Lòng Đăng Nhập
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đăng nhập tài khoản để xem lại toàn bộ lịch sử các giao dịch đơn hàng bản vẽ của bạn.
        </p>
        <div className="pt-2">
          <Link
            href="/dang-nhap"
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition"
          >
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
              category: true,
            }
          }
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">Tài khoản</span>
        <span>&gt;</span>
        <span className="text-orange-600 font-semibold">Lịch sử mua hàng</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
              Lịch Sử Mua Hàng & Giao Dịch
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tất cả đơn hàng đã giao dịch qua VietQR, MoMo và chuyển khoản
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto inline-flex items-center text-xs font-bold text-slate-600 hover:text-orange-600 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 border border-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại trang chủ
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Bạn chưa có đơn hàng nào</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khi mua bản vẽ qua quét mã QR hoặc giỏ hàng, lịch sử giao dịch sẽ được lưu trữ tự động tại đây.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              Khám Phá Bản Vẽ Ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCompleted = order.status === 'COMPLETED';
            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-orange-300 transition"
              >
                {/* Order Top Bar */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800">
                      Mã đơn: <strong className="text-orange-600 font-mono text-sm">{order.orderCode}</strong>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center space-x-1 ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Đã thanh toán</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>Chờ chuyển khoản</span>
                        </>
                      )}
                    </span>

                    <span className="text-sm font-extrabold text-orange-600 font-mono">
                      {formatVND(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {order.orderItems.map((item) => {
                    const product = item.product;
                    return (
                      <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                            <img
                              src={product?.images[0]?.url || '/demo/cad-demo-1.png'}
                              alt={product?.title || 'Bản vẽ'}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                              {product?.title || 'Bản vẽ kỹ thuật'}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Định dạng: {product?.formats} • Dung lượng: {product?.fileSize}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {formatVND(item.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Action */}
                {isCompleted && order.downloadToken && (
                  <div className="px-5 py-3 bg-orange-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Link tải file còn hạn: <strong className="text-orange-600 font-semibold">72 giờ</strong>
                    </span>
                    <Link
                      href={`/tai-ve/${order.downloadToken}`}
                      className="inline-flex items-center px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Tải file bản vẽ
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
