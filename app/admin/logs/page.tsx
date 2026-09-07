'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldAlert, 
  Clock, 
  User, 
  Loader2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface SystemLogItem {
  id: string;
  action: string;
  title: string;
  details?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
  createdAt: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isClearing, setIsClearing] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (levelFilter !== 'ALL') queryParams.set('level', levelFilter);

      const res = await fetch(`/api/admin/logs?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [levelFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleClearLogs = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử log hệ thống?')) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/admin/logs', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
      }
    } catch (e) {
      console.error(e);
      alert('Không thể xóa log');
    } finally {
      setIsClearing(false);
    }
  };

  const formatLogTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const datePart = d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${timePart} - ${datePart}`;
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Thành công
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
            Cảnh báo
          </span>
        );
      case 'DANGER':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3 mr-1 text-red-600" />
            Nguy hiểm
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3 mr-1 text-blue-600" />
            Thông tin
          </span>
        );
    }
  };

  // Stats calculation
  const totalCount = logs.length;
  const successCount = logs.filter((l) => l.level === 'SUCCESS').length;

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <History className="w-6 h-6 text-orange-600" />
            Nhật Ký Hệ Thống (System Audit Logs)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi chi tiết mọi hoạt động phát sinh: đăng nhập, tạo đơn, thanh toán, thay đổi bản vẽ và cấu hình.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="inline-flex items-center px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Làm Mới
          </button>

          <button
            type="button"
            onClick={handleClearLogs}
            disabled={isClearing || logs.length === 0}
            className="inline-flex items-center px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition shadow-xs disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Xóa Lịch Sử
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{totalCount}</div>
            <div className="text-xs text-slate-500 font-medium">Tổng số sự kiện ghi nhận</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{successCount}</div>
            <div className="text-xs text-slate-500 font-medium">Giao dịch & Thao tác thành công</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">Thời Gian Thực</div>
            <div className="text-xs text-slate-500 font-medium">Ghi nhận tức thì tự động</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo hành động, nội dung, email hoặc người thực hiện..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 text-xs focus:outline-none focus:border-orange-500 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Level Filter Tabs */}
        <div className="flex items-center space-x-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Mức độ:
          </span>
          {[
            { key: 'ALL', label: 'Tất cả' },
            { key: 'SUCCESS', label: 'Thành công' },
            { key: 'INFO', label: 'Thông tin' },
            { key: 'WARNING', label: 'Cảnh báo' },
            { key: 'DANGER', label: 'Nguy hiểm' },
          ].map((lvl) => (
            <button
              key={lvl.key}
              type="button"
              onClick={() => setLevelFilter(lvl.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                levelFilter === lvl.key
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Đang nạp nhật ký hệ thống...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Chưa có bản ghi log nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 w-44">Thời gian</th>
                  <th className="p-3.5 w-32">Mức độ</th>
                  <th className="p-3.5">Hành động & Nội dung chi tiết</th>
                  <th className="p-3.5 w-60">Tài khoản thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    
                    {/* Thời gian */}
                    <td className="p-3.5 align-top">
                      <div className="font-mono font-bold text-slate-800 text-[11px]">
                        {formatLogTime(log.createdAt)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getRelativeTime(log.createdAt)}
                      </div>
                    </td>

                    {/* Mức độ / Trạng thái */}
                    <td className="p-3.5 align-top">
                      {getLevelBadge(log.level)}
                    </td>

                    {/* Hành động & Nội dung chi tiết */}
                    <td className="p-3.5 align-top">
                      <div className="font-bold text-slate-900 text-sm">
                        {log.title}
                      </div>
                      {log.details && (
                        <div className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {log.details}
                        </div>
                      )}
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        Mã sự kiện: <span className="font-semibold text-slate-600">{log.action}</span>
                      </div>
                    </td>

                    {/* Tài khoản thực hiện */}
                    <td className="p-3.5 align-top">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {log.userName ? log.userName[0].toUpperCase() : 'U'}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-800 truncate">
                            {log.userName || 'Hệ thống tự động'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {log.userEmail || 'system@local'}
                          </div>
                        </div>
                      </div>
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
