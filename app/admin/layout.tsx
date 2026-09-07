'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderPlus, 
  Layers, 
  ShoppingCart, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Crown,
  ShieldAlert,
  Clock,
  ShieldCheck,
  Lock,
  FolderTree
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timePart = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentDateTime(`${datePart} | ${timePart}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Kiểm tra quyền Admin
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && (data.user.isAdmin || data.user.email === 'admin@gmail.com' || data.user.email === 'admin')) {
          setIsAuthorized(true);
          setAdminUser(data.user);
        } else {
          setIsAuthorized(false);
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        setIsAuthorized(false);
        router.replace('/admin/login');
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [pathname, router]);

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.replace('/admin/login');
  };

  // If on login page, render without admin sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#f4f6fa] text-slate-800">{children}</div>;
  }

  // Loading state when verifying admin session
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Đang xác thực quyền Quản trị viên...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state (not admin or not logged in)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
            Truy Cập Bị Từ Chối
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bạn chưa đăng nhập hoặc tài khoản hiện tại không có quyền truy cập vào bảng điều khiển Quản trị viên.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              Đăng Nhập Quản Trị
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Tổng quan (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý Bản vẽ', href: '/admin/products', icon: Layers },
    { label: 'Quản lý Danh mục', href: '/admin/categories', icon: FolderTree },
    { label: 'Thêm Bản vẽ Mới', href: '/admin/products/new', icon: FolderPlus },
    { label: 'Đơn hàng & Giao dịch QR', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Cấu hình Ngân hàng & QR', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xs">
        
        {/* Admin Brand */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-wider uppercase block">
                ADMIN <span className="text-orange-600">PORTAL</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                Quản trị bản vẽ mỹ nghệ
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition"
          >
            <span>Xem trang Web User</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition text-left cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất Quản trị</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="text-xs text-slate-500 font-medium truncate hidden md:block">
            Hệ thống Quản trị & Kích hoạt mã VietQR tự động
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-4 ml-auto">
            {/* Live Date & Time */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition px-3 py-1.5 rounded-lg border border-slate-200 font-mono shadow-xs">
              <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>{currentDateTime || 'Đang đồng bộ giờ...'}</span>
            </div>

            {/* Admin Account */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-slate-800 px-3 py-1.5 rounded-lg shadow-xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-800 font-mono">
                  {adminUser?.email || 'admin@gmail.com'}
                </span>
                <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}