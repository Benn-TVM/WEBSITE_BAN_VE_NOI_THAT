import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  ArrowLeft,
  FolderArchive
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export default async function DownloadPage({ params }: { params: { token: string } }) {
  const { token } = params;

  let order = await prisma.order.findUnique({
    where: { downloadToken: token },
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

  if (!order) {
    order = await prisma.order.findUnique({
      where: { orderCode: token },
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
  }

  if (!order) {
    return notFound();
  }

  const isExpired = order.downloadExpiresAt && new Date() > new Date(order.downloadExpiresAt);
  const remainingHours = order.downloadExpiresAt
    ? Math.max(0, Math.round((new Date(order.downloadExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))
    : 72;

  const hotlineSetting = await prisma.systemSetting.findUnique({ where: { key: 'HOTLINE' } });
  const hotline = hotlineSetting?.value || '0987.069.242';
  const cleanHotline = hotline.replace(/[^0-9]/g, '') || '0987069242';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <Link 
        href="/" 
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-orange-600 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Quay về Trang chủ
      </Link>

      {/* Main Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Status banner */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-50 via-white to-orange-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-0.5">
                Thanh toán đã hoàn tất
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
                Tải Xuống Hồ Sơ Bản Vẽ Kỹ Thuật
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Mã đơn hàng: <strong className="text-orange-600 font-mono">{order.orderCode}</strong> • Ngày mua: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 flex items-center font-medium">
              <Clock className="w-3.5 h-3.5 mr-1 text-orange-600" />
              Thời hạn link tải:
            </span>
            <span className="font-bold text-orange-600 mt-0.5">
              Còn {remainingHours} giờ
            </span>
          </div>
        </div>

        {/* Product Items List */}
        <div className="p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-orange-500 pl-3">
            Danh Sách Bản Vẽ Của Bạn:
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item) => {
              const product = item.product;
              return (
                <div 
                  key={item.id} 
                  className="p-4 md:p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                      <img 
                        src={product.images[0]?.url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80'} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                        {product.category?.name || 'Bản vẽ'}
                      </span>
                      <h3 className="text-sm md:text-base font-bold text-slate-900 mt-1 leading-snug">
                        {product.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5 font-mono">
                        <span>Định dạng: <strong className="text-slate-800">{product.formats}</strong></span>
                        <span>•</span>
                        <span>Dung lượng: <strong className="text-slate-800">{product.fileSize}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Download Action Button */}
                  <div className="shrink-0 pt-2 md:pt-0">
                    <a
                      href={`/api/download/${token}?productId=${product.id}`}
                      className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold uppercase tracking-wider text-xs shadow-sm transition"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải Xuống Bản Vẽ ({product.fileSize})
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions box */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center">
              <FolderArchive className="w-4 h-4 mr-1.5 text-orange-600" />
              Hướng Dẫn Mở & Sử Dụng File:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-slate-600">
              <li>File tải về là dạng nén <strong>.ZIP / .RAR</strong>. Nhấp chuột phải chọn <em>Extract Here</em> để giải nén.</li>
              <li>Bản vẽ 2D sử dụng phần mềm <strong>AutoCAD 2010 trở lên</strong> để mở và in ấn tỉ lệ chuẩn.</li>
              <li>File mẫu CNC / đục đá chạm trổ mở bằng <strong>JDpaint 5.21 / ArtCAM</strong> để xuất đường dao.</li>
              <li>Mô hình 3D phối cảnh tương thích <strong>3ds Max hoặc SketchUp 2020-2024</strong>.</li>
              <li>Lưu lại mã đơn <strong>{order.orderCode}</strong> nếu cần hỗ trợ kỹ thuật thêm.</li>
            </ul>
          </div>

          {/* Support Bar */}
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 mr-2 text-orange-600" />
              Cần hỗ trợ kỹ thuật hoặc chỉnh sửa kích thước bản vẽ?
            </div>
            <a
              href={`https://zalo.me/${cleanHotline}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
              Zalo Kỹ Thuật: {hotline}
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}