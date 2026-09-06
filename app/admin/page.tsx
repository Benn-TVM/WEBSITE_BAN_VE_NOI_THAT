import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  DollarSign, 
  ShoppingCart, 
  Layers, 
  DownloadCloud, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  FolderPlus,
  Settings
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Aggregate stats
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const completedOrders = await prisma.order.findMany({
    where: { status: 'COMPLETED' },
  });
  const pendingOrdersCount = await prisma.order.count({
    where: { status: 'PENDING' },
  });

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDownloads = completedOrders.reduce((sum, o) => sum + o.downloadCount, 0);

  // Recent 5 orders
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      orderItems: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan doanh thu, đơn hàng thanh toán QR và dữ liệu kho bản vẽ.
          </p>
        </div>

        <div className="flex space-x-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-orange-700 transition"
          >
            <FolderPlus className="w-4 h-4 mr-1.5" />
            Thêm Bản Vẽ Mới
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 shadow-xs transition"
          >
            <Settings className="w-4 h-4 mr-1.5" />
            Cấu Hình QR
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-orange-600 font-mono">
            {formatVND(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center mt-2">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Đã thanh toán qua QR / MoMo
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Đơn Thành Công
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {completedOrders.length} <span className="text-xs font-normal text-slate-400">đơn</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-2">
            Đang chờ thanh toán: {pendingOrdersCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kho Bản Vẽ
            </span>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalProducts} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Phân bố trong {totalCategories} danh mục
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lượt Tải Xuống
            </span>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <DownloadCloud className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {totalDownloads} <span className="text-xs font-normal text-slate-400">lượt</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2">
            Link tải bảo mật 72h
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Đơn Hàng Gần Đây
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
          >
            <span>Xem toàn bộ đơn hàng</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có đơn hàng nào được tạo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Bản vẽ</th>
                  <th className="p-3">Số tiền</th>
                  <th className="p-3">Phương thức</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-orange-600">{ord.orderCode}</td>
                    <td className="p-3 font-sans text-slate-800">
                      <div className="font-semibold">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.customerPhone || ord.customerEmail}</div>
                    </td>
                    <td className="p-3 font-sans text-slate-700 max-w-xs truncate">
                      {ord.orderItems[0]?.product?.title || 'Bản vẽ'}
                    </td>
                    <td className="p-3 font-bold text-orange-600">{formatVND(ord.totalAmount)}</td>
                    <td className="p-3 text-slate-600 font-sans">{ord.paymentMethod}</td>
                    <td className="p-3">
                      {ord.status === 'COMPLETED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          Chờ thanh toán
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}