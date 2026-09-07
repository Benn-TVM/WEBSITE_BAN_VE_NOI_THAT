'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  Download,
  AlertCircle
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import Link from 'next/link';

interface OrderItem {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  downloadToken?: string | null;
  downloadCount: number;
  createdAt: Date | string;
  orderItems: Array<{
    product: {
      title: string;
      slug: string;
    };
  }>;
}

export default function OrdersClient({ initialOrders }: { initialOrders: OrderItem[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [activatingCode, setActivatingCode] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'ALL' ? true : o.status === statusFilter;
    const matchSearch = 
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(search));
    return matchStatus && matchSearch;
  });

  const handleManualActivate = async (orderCode: string) => {
    if (!confirm(`Xác nhận kích hoạt thanh toán thủ công cho đơn ${orderCode}?`)) return;

    setActivatingCode(orderCode);
    try {
      const res = await fetch(`/api/orders/${orderCode}/confirm`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map((o) => o.orderCode === orderCode ? { ...o, status: 'COMPLETED' } : o));
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kích hoạt đơn');
    } finally {
      setActivatingCode(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
            Quản Lý Đơn Hàng & Giao Dịch QR
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi danh sách khách mua bản vẽ, đối soát mã giao dịch và kích hoạt link tải file.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status tabs */}
        <div className="flex space-x-1.5 text-xs font-semibold overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              statusFilter === 'ALL' ? 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              statusFilter === 'COMPLETED' ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Đã thanh toán ({orders.filter(o => o.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              statusFilter === 'PENDING' ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Chờ thanh toán ({orders.filter(o => o.status === 'PENDING').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-semibold">Mã đơn</th>
                <th className="p-3.5 font-semibold">Khách hàng</th>
                <th className="p-3.5 font-semibold">Bản vẽ đã chọn</th>
                <th className="p-3.5 font-semibold">Số tiền</th>
                <th className="p-3.5 font-semibold">Phương thức</th>
                <th className="p-3.5 font-semibold">Trạng thái</th>
                <th className="p-3.5 font-semibold">Lượt tải</th>
                <th className="p-3.5 text-right font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-orange-600">{ord.orderCode}</td>
                  <td className="p-3.5 font-sans text-slate-800">
                    <div className="font-semibold text-slate-900">{ord.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ord.customerPhone || ord.customerEmail}</div>
                  </td>
                  <td className="p-3.5 font-sans text-slate-700 max-w-xs truncate">
                    {ord.orderItems[0]?.product?.title || 'Bản vẽ'}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {formatVND(ord.totalAmount)}
                  </td>
                  <td className="p-3.5 text-slate-600 font-sans">{ord.paymentMethod}</td>
                  <td className="p-3.5 font-sans">
                    {ord.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 mr-1 text-amber-600" />
                        Chờ thanh toán
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-500 font-sans">
                    {ord.downloadCount} lượt
                  </td>
                  <td className="p-3.5 text-right space-x-2 font-sans">
                    {ord.status === 'PENDING' ? (
                      <button
                        onClick={() => handleManualActivate(ord.orderCode)}
                        disabled={activatingCode === ord.orderCode}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-xs transition"
                      >
                        {activatingCode === ord.orderCode ? 'Đang duyệt...' : 'Duyệt thủ công'}
                      </button>
                    ) : (
                      <Link
                        href={`/tai-ve/${ord.downloadToken || ord.orderCode}`}
                        target="_blank"
                        className="p-1 rounded text-slate-600 hover:text-orange-600 transition inline-flex items-center text-[11px] font-semibold"
                        title="Xem trang tải file"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Link tải
                      </Link>
                    )}
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