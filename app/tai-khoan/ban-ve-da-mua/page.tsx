import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { 
  FolderArchive, 
  Download, 
  Clock, 
  ShieldCheck, 
  User, 
  ArrowLeft,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export default async function MyPurchasedDrawingsPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_token')?.value;

  if (!userId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Vui Lòng Đăng Nhập Tài Khoản
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đăng nhập tài khoản để xem lại toàn bộ hồ sơ bản vẽ bạn đã mua và tải lại bất cứ lúc nào.
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const hotlineSetting = await prisma.systemSetting.findUnique({ where: { key: 'HOTLINE' } });
  const hotline = hotlineSetting?.value || '0987.069.242';
  const cleanHotline = hotline.replace(/[^0-9]/g, '') || '0987069242';

  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
      status: 'COMPLETED',
    },
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
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-orange-600 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Quay lại Cửa hàng
        </Link>
      </div>

      {/* User profile banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                {user?.name || 'Khách hàng'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                Thành viên
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Email: {user?.email} {user?.phone && `• SĐT: ${user.phone}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs bg-slate-50 px-5 py-3 rounded-xl border border-slate-200">
          <div>
            <div className="text-slate-500 font-medium">Bản vẽ đã sở hữu:</div>
            <div className="text-lg font-extrabold text-orange-600 font-mono">
              {orders.length} <span className="text-xs font-normal text-slate-600">bộ hồ sơ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Drawings List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center border-l-4 border-orange-500 pl-3">
          <FolderArchive className="w-5 h-5 mr-2 text-orange-600" />
          Hồ Sơ Bản Vẽ Đã Mua (Tải Lại Bất Cứ Lúc Nào)
        </h2>

        {orders.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
            <p className="text-slate-500 text-xs">Bạn chưa mua bản vẽ nào trên tài khoản này.</p>
            <Link
              href="/"
              className="inline-block text-xs font-bold text-orange-600 hover:underline"
            >
              Khám phá các bản vẽ mỹ nghệ ngay →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              return order.orderItems.map((item) => {
                const p = item.product;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={p.images[0]?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] uppercase font-bold text-orange-600 px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                            {p.category?.name || 'Mỹ nghệ'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Đơn: {order.orderCode}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 mt-1 leading-snug">
                          {p.title}
                        </h3>
                        <div className="text-xs text-slate-500 mt-1.5 font-mono flex items-center space-x-3">
                          <span>Định dạng: <strong className="text-slate-700">{p.formats}</strong></span>
                          <span>•</span>
                          <span>Dung lượng: <strong className="text-slate-700">{p.fileSize}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-3">
                      <Link
                        href={`/tai-ve/${order.downloadToken || order.orderCode}`}
                        className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1.5" />
                        Tải Xuống ({p.fileSize})
                      </Link>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        )}
      </div>

      {/* Support box */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-xs">
        <div className="flex items-center text-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
          Hồ sơ của bạn được lưu trữ vĩnh viễn trên hệ thống.
        </div>
        <a href={`tel:${cleanHotline}`} className="text-orange-600 font-bold hover:underline flex items-center">
          <PhoneCall className="w-3.5 h-3.5 mr-1" />
          Hỗ trợ: {hotline}
        </a>
      </div>
    </div>
  );
}