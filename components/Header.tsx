'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  DoorOpen, 
  Layers, 
  Palette, 
  Landmark, 
  Crown, 
  LogIn,
  UserPlus,
  User,
  LogOut,
  FolderArchive,
  LayoutGrid,
  ChevronDown,
  ArrowRight,
  Flame,
  Award,
  ShoppingCart,
  Heart,
  Download,
  History,
  Settings
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES_DATA = [
  {
    name: 'Hoa văn',
    slug: 'hoa-van',
    desc: 'Chạm khắc CNC hoa sen, rồng phượng, chữ Phúc Lộc Thọ',
    icon: Sparkles,
    count: '150+ File',
  },
  {
    name: 'Cổng đá',
    slug: 'cong-da',
    desc: 'Cổng tam quan 3 mái, cổng tứ trụ nhà thờ họ, đình chùa',
    icon: DoorOpen,
    count: '85+ File',
  },
  {
    name: 'Lan can',
    slug: 'lan-can',
    desc: 'Lan can đá mỹ nghệ, con tiện đá cẩm thạch, bưng hoa sen',
    icon: ShieldCheck,
    count: '120+ File',
  },
  {
    name: 'Vách ngăn',
    slug: 'vach-ngan',
    desc: 'Vách CNC phong thủy, bình phong chắn gió phòng thờ',
    icon: Layers,
    count: '65+ File',
  },
  {
    name: 'Phù điêu',
    slug: 'phu-dieu',
    desc: 'Tranh đá tứ quý, vinh quy bái tổ, bát mã truy phong',
    icon: Palette,
    count: '95+ File',
  },
  {
    name: 'Mộ / Lăng mộ',
    slug: 'mo-lang-mo',
    desc: 'Khu lăng mộ đá gia tộc, mộ đá đơn, mộ đôi, lăng thờ chung',
    icon: Landmark,
    count: '110+ File',
  },
  {
    name: 'Trang trí',
    slug: 'trang-tri',
    desc: 'Cột rồng đá, đỉnh hương, đèn đá lục giác, rồng bậc thềm',
    icon: Crown,
    count: '75+ File',
  },
];

export default function Header() {
  const { hotline, cleanHotline } = useSettings();
  const { totalCount, openCart, clearCart } = useCart();
  const { user, openLoginModal, openRegisterModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    clearCart();
    setUserMenuOpen(false);
    await logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm max-w-full">
        {/* Top Micro Bar */}
        <div className="bg-slate-50 text-slate-600 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="flex items-center text-slate-700 font-medium">
                <PhoneCall className="w-3.5 h-3.5 mr-1 text-orange-600 shrink-0" />
                <span className="hidden xs:inline">Hotline/Zalo:</span>
                <strong className="text-orange-600 ml-1">{hotline}</strong>
              </span>
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="hidden md:flex items-center text-slate-600 truncate max-w-md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                File chuẩn kỹ thuật 100% – Mở là chạy – Đã thi công thực tế
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Hỗ trợ kỹ thuật 24/7
            </div>
          </div>
        </div>

        {/* Main Header (Logo, Search, User Buttons) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[6px] sm:rounded-[7px] flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-wider text-slate-900 block uppercase leading-none">
                BẢN VẼ <span className="text-orange-600">MỸ NGHỆ</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block font-medium mt-0.5">
                Thư viện bản vẽ kiến trúc & hoa văn
              </span>
            </div>
          </Link>

          {/* Search Bar with Orange Action Button (Desktop & Tablet) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên bản vẽ (hoặc) mã file: cổng đá, lăng mộ, phù điêu, CAD, CNC..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-4 pr-12 py-2.5 border-2 border-orange-500 focus:outline-none focus:bg-white shadow-inner"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-3.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition font-semibold text-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* User Actions & Shopping Cart */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center justify-center p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 transition group"
              title="Xem giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm font-mono">
                  {totalCount}
                </span>
              )}
              <span className="hidden lg:inline text-xs font-bold ml-1.5">
                Giỏ hàng
              </span>
            </button>

            {/* User Account / Avatar Button (Nằm ở góc phải, thay thế vị trí 3 gạch cũ) */}
            {user ? (
              /* User Profile Menu */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm hover:bg-orange-700 transition shadow-sm ring-2 ring-orange-200 hover:ring-orange-300 cursor-pointer"
                  aria-label="Tài khoản cá nhân"
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <div className="font-bold text-slate-900 text-sm truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/tai-khoan/yeu-thich"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                        >
                          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Bản vẽ ưa thích</span>
                        </Link>

                        <Link
                          href="/tai-khoan/ban-ve-da-mua"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                        >
                          <Download className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Bản vẽ đã mua</span>
                        </Link>

                        <Link
                          href="/tai-khoan/lich-su-mua-hang"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                        >
                          <History className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Lịch sử mua hàng</span>
                        </Link>

                        <Link
                          href="/tai-khoan/cai-dat"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                        >
                          <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Cài đặt thông tin</span>
                        </Link>
                      </div>

                      {(user.email === 'admin@gmail.com' || (user as any).isAdmin) && (
                        <div className="pt-1 border-t border-slate-100">
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-orange-600 hover:bg-orange-50 transition font-bold"
                          >
                            <Crown className="w-4 h-4 text-orange-600 shrink-0" />
                            <span>Trang Quản Trị (Admin)</span>
                          </Link>
                        </div>
                      )}

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Login / Register */
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-slate-500" />
                  <span className="text-[11px] sm:text-xs">Đăng Nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => openRegisterModal()}
                  className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  <span>Đăng Ký</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Quick Search Bar (Directly accessible on mobile) */}
        <div className="md:hidden px-3 pb-2.5 pt-0.5">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm: cổng đá, lăng mộ, CNC, CAD..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-3 pr-10 py-2 border border-orange-500 focus:outline-none focus:bg-white shadow-xs"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-2.5 rounded bg-orange-600 text-white flex items-center justify-center font-semibold text-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Mobile Category Ribbon (Horizontal scroll) */}
        <div className="md:hidden bg-[#ea580c] text-white overflow-x-auto py-2 px-3 flex items-center space-x-2 no-scrollbar shadow-xs">
          {/* Nút 3 gạch mở menu chuyển xuống bên trái chữ "Tất cả" */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-2.5 py-1 rounded-full bg-black/25 hover:bg-white/25 active:bg-black/40 text-white text-xs font-bold shrink-0 flex items-center justify-center transition border border-white/20 shadow-xs cursor-pointer"
            aria-label="Menu danh mục"
            title="Menu danh mục"
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5 text-amber-200" /> : <Menu className="w-3.5 h-3.5 text-white" />}
          </button>

          <Link
            href="/"
            className="whitespace-nowrap px-3 py-1 rounded-full bg-black/20 hover:bg-white/20 text-[11px] font-bold shrink-0"
          >
            Tất cả
          </Link>
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-black/15 hover:bg-white/20 text-[11px] font-medium shrink-0 flex items-center"
            >
              <cat.icon className="w-3 h-3 mr-1 text-amber-200" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Vibrant Orange Navigation Bar (Desktop & Tablet) */}
        <nav className="bg-[#ea580c] text-white shadow-md hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              
              {/* MEGA DROPDOWN: DANH MỤC CHUYÊN NGÀNH */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center px-5 py-3 text-xs font-extrabold uppercase tracking-wider bg-black/20 hover:bg-black/30 text-white transition cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 mr-2 text-amber-200" />
                  <span>DANH MỤC CHUYÊN NGÀNH</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Panel (8 Category Cards like user requested) */}
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-[840px] bg-white text-slate-800 rounded-b-2xl shadow-2xl border-2 border-orange-500 p-5 z-50 animate-fade-in grid grid-cols-2 gap-3.5">
                    {CATEGORIES_DATA.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/danh-muc/${cat.slug}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="group p-3.5 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all flex items-start space-x-3 shadow-xs"
                        >
                          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800 group-hover:text-orange-600 transition truncate">
                                {cat.name}
                              </h4>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700">
                                {cat.count}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                              {cat.desc}
                            </p>
                            <span className="text-[10px] font-bold text-orange-600 flex items-center mt-1 group-hover:underline">
                              Xem hồ sơ bản vẽ <ArrowRight className="w-2.5 h-2.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}

                    {/* Special 8th Item: Thiết kế theo yêu cầu */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block mb-0.5">
                          Dịch Vụ Kỹ Thuật
                        </span>
                        <h4 className="text-xs font-extrabold uppercase tracking-wide">
                          Thiết Kế Theo Yêu Cầu
                        </h4>
                        <p className="text-[11px] text-orange-100 mt-0.5 line-clamp-1">
                          Bóc tách bản vẽ, đo đạc phong thủy Lỗ Ban
                        </p>
                      </div>
                      <a
                        href={`https://zalo.me/${cleanHotline}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white text-orange-600 font-bold text-xs hover:bg-orange-50 shrink-0 shadow-sm ml-2"
                      >
                        Chat Zalo
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/"
                className="px-3.5 py-3 text-xs font-semibold hover:bg-orange-700 transition"
              >
                Trang chủ
              </Link>
              
              {/* Quick links to top categories on navbar */}
              <Link
                href="/danh-muc/cong-da"
                className="px-3 py-3 text-xs font-semibold hover:bg-orange-700 transition"
              >
                Cổng đá
              </Link>
              <Link
                href="/danh-muc/mo-lang-mo"
                className="px-3 py-3 text-xs font-semibold hover:bg-orange-700 transition"
              >
                Mộ / Lăng mộ
              </Link>
              <Link
                href="/danh-muc/phu-dieu"
                className="px-3 py-3 text-xs font-semibold hover:bg-orange-700 transition"
              >
                Phù điêu
              </Link>
              <Link
                href="/danh-muc/hoa-van"
                className="px-3 py-3 text-xs font-semibold hover:bg-orange-700 transition"
              >
                Hoa văn CNC
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-3.5 py-4 space-y-3.5 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center">
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                Danh Mục Chuyên Ngành:
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-xs"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES_DATA.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/danh-muc/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  <cat.icon className="w-3.5 h-3.5 mr-2 text-orange-500 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}

              {/* 8th Item: Thiết kế theo yêu cầu */}
              <a
                href={`https://zalo.me/${cleanHotline}`}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold shadow-xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span className="truncate">Thiết Kế Theo Yêu Cầu (Zalo)</span>
                </div>
                <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded font-extrabold shrink-0">
                  Chat Ngay
                </span>
              </a>
            </div>

            {/* Mobile Cart Action */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); openCart(); }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-orange-600" />
                  <span>Giỏ hàng của bạn</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold shadow-xs">
                  {totalCount} bản vẽ
                </span>
              </button>
            </div>

            {/* Mobile Auth actions */}
            <div className="pt-1 flex flex-col gap-2">
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs truncate">{user.name}</div>
                      <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        Mã TV: {user.memberCode || ('fad' + user.id.slice(-6).toLowerCase())}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="mt-1.5 text-[11px] font-semibold text-emerald-600">
                      Số dư: <strong>{user.xu || 0} Xu</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      href="/tai-khoan/yeu-thich"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:text-rose-600 hover:border-rose-300 transition"
                    >
                      <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-500 shrink-0" />
                      <span className="truncate">Bản vẽ ưu thích</span>
                    </Link>
                    <Link
                      href="/tai-khoan/ban-ve-da-mua"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:text-blue-600 hover:border-blue-300 transition"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
                      <span className="truncate">Bản vẽ đã mua</span>
                    </Link>
                    <Link
                      href="/tai-khoan/lich-su-mua-hang"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:text-amber-600 hover:border-amber-300 transition"
                    >
                      <History className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
                      <span className="truncate">Lịch sử mua hàng</span>
                    </Link>
                    <Link
                      href="/tai-khoan/cai-dat"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:text-slate-900 hover:border-slate-400 transition"
                    >
                      <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                      <span className="truncate">Cài đặt thông tin</span>
                    </Link>
                  </div>

                  {(user.email === 'admin@gmail.com' || (user as any).isAdmin) && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center p-2.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200"
                    >
                      <Crown className="w-3.5 h-3.5 mr-1.5" />
                      Trang Quản Trị (Admin)
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); openLoginModal(); }}
                    className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-200"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); openRegisterModal(); }}
                    className="p-2.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
                  >
                    Đăng Ký
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center pt-1 text-[11px] text-slate-500">
                <span className="flex items-center">
                  <PhoneCall className="w-3.5 h-3.5 mr-1 text-orange-600" />
                  Hotline hỗ trợ kỹ thuật: <strong className="ml-1 text-slate-700 font-semibold">{hotline}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}