import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  FileCheck, 
  Crown, 
  ArrowRight,
  Search,
  CheckCircle2,
  Activity,
  Flame,
  Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: { q?: string; cat?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const searchQuery = searchParams.q?.trim() || '';

  let featuredProducts: any[] = [];
  let recentProducts: any[] = [];

  try {
    // Fetch featured products
    featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        ...(searchQuery ? {
          OR: [
            { title: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { formats: { contains: searchQuery } },
            { sku: { contains: searchQuery } },
          ]
        } : {})
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    // Fetch all recent products
    recentProducts = await prisma.product.findMany({
      where: {
        ...(searchQuery ? {
          OR: [
            { title: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { formats: { contains: searchQuery } },
            { sku: { contains: searchQuery } },
          ]
        } : {})
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
  } catch (error) {
    console.error('Database fetch error in HomePage:', error);
  }

  return (
    <div className="space-y-10 pb-12">
      
      {/* HERO BANNER SECTION (Inspired by KhoBanVe & FileThietKe) */}
      <section className="bg-white border-b border-slate-200 py-4 sm:py-6 md:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            
            {/* Left/Center Banner (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-white border border-orange-200 p-4 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full bg-orange-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Thư Viện Bản Vẽ Kỹ Thuật Đá & CNC</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
                  Kho Bản Vẽ <span className="text-orange-600">Kiến Trúc Đá & CNC</span> Chuẩn Thi Công
                </h1>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hơn 500+ bộ hồ sơ chi tiết: <strong>Cổng đá, Lăng mộ, Lan can, Phù điêu, Hoa văn CNC</strong>. Bổ mộng ngàm 100% khớp thực tế, xuất file máy đục đá và bản vẽ thi công ngay.
                </p>

                {/* Features list */}
                <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mr-1.5 sm:mr-2 shrink-0" />
                    Bản vẽ phong phú, đa dạng phần mềm
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mr-1.5 sm:mr-2 shrink-0" />
                    Chất lượng chi tiết, đã thi công
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mr-1.5 sm:mr-2 shrink-0" />
                    Thanh toán VietQR tải file tức thì
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 mr-1.5 sm:mr-2 shrink-0" />
                    Bảo hành mở file, hỗ trợ kỹ thuật
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                  <a
                    href="#ban-ve-moi"
                    className="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition"
                  >
                    Xem Bản Vẽ Mới Nhất
                  </a>
                  <a
                    href="/danh-muc/cong-da"
                    className="w-full sm:w-auto text-center px-4 sm:px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:border-orange-500 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
                  >
                    7 Chuyên Mục Hồ Sơ
                  </a>
                </div>
              </div>

              {/* Decorative Guarantee Stamp */}
              <div className="hidden md:flex absolute right-6 bottom-6 w-28 h-28 rounded-full border-4 border-dashed border-amber-400 bg-amber-100/60 p-2 items-center justify-center text-center rotate-[-12deg] shadow-sm select-none">
                <div>
                  <Award className="w-7 h-7 text-orange-600 mx-auto" />
                  <div className="text-[10px] font-extrabold uppercase text-orange-700 leading-tight mt-1">
                    CAM KẾT 100%<br/>HÀI LÒNG
                  </div>
                </div>
              </div>
            </div>

            {/* Right Activity Box (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
                    <Activity className="w-4 h-4 mr-1.5 text-orange-600" />
                    Hoạt Động Mới Nhất
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-2 text-[11px] sm:text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800">KTS Hoàng Quân</span> vừa download <span className="text-orange-600 font-semibold">"Hồ sơ cổng đá tam quan"</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800">Xưởng đá Ninh Vân</span> vừa download <span className="text-orange-600 font-semibold">"Bộ file CNC hoa văn tứ linh"</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800">Minh Thắng</span> vừa download <span className="text-orange-600 font-semibold">"Bản vẽ khu lăng mộ đá xanh"</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800">Trần Văn Kiên</span> vừa đăng ký thành viên mới
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-500">
                  Giao dịch an toàn & mở khóa file tự động 24/7
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEARCH FILTER NOTIFICATION */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs text-orange-900">
            <div>
              Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong> ({recentProducts.length} bản vẽ)
            </div>
            <Link href="/" className="font-bold text-orange-600 hover:underline">
              Xóa tìm kiếm
            </Link>
          </div>
        </div>
      )}

      {/* SECTION: BẢN VẼ MỚI NHẤT */}
      <section id="ban-ve-moi" className="max-w-7xl mx-auto px-3 sm:px-4 scroll-mt-20">
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2.5 border-b-2 border-orange-500">
          <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center">
            <span className="bg-orange-600 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded mr-1.5 sm:mr-2 uppercase font-extrabold">HOT</span>
            Bản Vẽ Mới Nhất
          </h2>
          <Link
            href="/danh-muc/cong-da"
            className="text-[11px] sm:text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {recentProducts.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SECTION: BẢN VẼ NỔI BẬT */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2.5 border-b-2 border-orange-500">
            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-orange-600" />
              Bản Vẽ Bán Chạy & Được Đánh Giá Cao
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}