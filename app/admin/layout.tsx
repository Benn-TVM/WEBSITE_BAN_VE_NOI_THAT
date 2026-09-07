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
  FolderTree,
  History,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

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
    { label: 'Nhật ký Hệ thống', href: '/admin/logs', icon: History },
    { label: 'Cấu hình Ngân hàng & QR', href: '/admin/settings', icon: Settings },
  ];

  const renderProfileDropdown = () => (
    <>
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/10"
        onClick={() => setIsProfileDropdownOpen(false)}
      />

      {/* Dropdown Menu Box */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2 text-left">
        
        {/* 1. Thời gian hiện tại */}
        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono shadow-xs">
          <Clock className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="truncate">{currentDateTime || 'Đang đồng bộ giờ...'}</span>
        </div>

        {/* 2. Tài khoản Admin */}
        <div className="flex items-center space-x-2.5 bg-orange-50/70 border border-orange-200 p-2.5 rounded-xl shadow-xs">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 font-mono truncate">
              {adminUser?.email || 'admin@gmail.com'}
            </span>
            <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ml-1.5">
              Admin
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 my-1"></div>

        {/* 3. Xem trang Web User */}
        <Link
          href="/"
          target="_blank"
          onClick={() => setIsProfileDropdownOpen(false)}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition shadow-xs"
        >
          <span>Xem trang Web User</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* 4. Đăng xuất Quản trị */}
        <button
          type="button"
          onClick={handleAdminLogout}
          className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition text-left cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
          <span>Đăng xuất Quản trị</span>
        </button>

      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col md:flex-row">
      
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 flex md:hidden items-center justify-between px-4 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-orange-600" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Crown className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-xs tracking-wider uppercase">
              ADMIN <span className="text-orange-600">PORTAL</span>
            </span>
          </Link>
        </div>

        {/* Admin Avatar Button on Mobile (Triggers Dropdown) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-slate-800 p-1 pr-2 rounded-full cursor-pointer shadow-xs focus:outline-none transition active:scale-95"
            aria-label="Admin Profile"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-orange-700">Admin</span>
            <ChevronDown className={`w-3 h-3 text-orange-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileDropdownOpen && renderProfileDropdown()}
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sheet */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white flex flex-col shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
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
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
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

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 text-center bg-slate-50/70">
          <p className="text-[11px] text-slate-400 font-medium">
            Hệ thống Quản trị Bản vẽ • v1.0
          </p>
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-screen sticky top-0 h-screen shadow-xs">
        
        {/* Desktop Admin Brand */}
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
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
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

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 text-center bg-slate-50/40">
          <p className="text-[11px] text-slate-400 font-medium">
            Hệ thống Quản trị Bản vẽ • v1.0
          </p>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Top Header */}
        <header className="hidden md:flex h-16 px-6 bg-white border-b border-slate-200 items-center justify-between gap-3 shadow-xs sticky top-0 z-20">
          <div className="text-xs text-slate-500 font-medium truncate">
            Hệ thống Quản trị & Kích hoạt mã VietQR tự động
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Admin Avatar Button on Desktop (Triggers Dropdown) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2.5 bg-slate-50 hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 py-1.5 px-3 rounded-full transition shadow-xs cursor-pointer focus:outline-none active:scale-98"
                aria-label="Admin Profile Menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 font-mono">
                  {adminUser?.email || 'admin@gmail.com'}
                </span>
                <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Admin
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && renderProfileDropdown()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}