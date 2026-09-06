'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  MapPin, 
  FileCheck, 
  QrCode, 
  Crown,
  Sparkles
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { hotline, cleanHotline, supportEmail } = useSettings();
  return (
    <footer className="bg-slate-900 text-slate-300 pt-8 sm:pt-12 pb-8 mt-12 sm:mt-16 border-t-4 border-orange-500">
      {/* Guarantees row in dark box */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3.5 p-2.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="p-1.5 sm:p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
              <FileCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Bản Vẽ Thực Tế</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">100% file đã thi công</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3.5 p-2.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="p-1.5 sm:p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
              <QrCode className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Thanh Toán QR</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Quét mã tải file ngay</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3.5 p-2.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="p-1.5 sm:p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Bảo Hành Mở File</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Hỗ trợ kỹ thuật 24/7</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3.5 p-2.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="p-1.5 sm:p-2.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Đa Dạng Phần Mềm</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">CAD, 3D, JDpaint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-slate-800">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg uppercase tracking-wider">
              BẢN VẼ <span className="text-orange-400">MỸ NGHỆ</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Thư viện chia sẻ và kinh doanh bản vẽ kiến trúc đá mỹ nghệ, lăng mộ, cổng đá, phù điêu và hoa văn điêu khắc CNC chất lượng hàng đầu Việt Nam.
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-orange-400" />
              <span>Hotline/Zalo: <a href={`https://zalo.me/${cleanHotline}`} target="_blank" rel="noreferrer" className="text-white hover:text-orange-400 transition font-bold">{hotline}</a></span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>Email: <a href={`mailto:${supportEmail}`} className="text-white hover:text-orange-400 transition font-bold">{supportEmail}</a></span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Làng nghề đá Ninh Vân, Hoa Lư, Ninh Bình</span>
            </div>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-3 border-orange-500 pl-2">
            Danh Mục Bản Vẽ
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/danh-muc/hoa-van" className="hover:text-orange-400 transition">Bản vẽ Hoa văn CNC chạm khắc</Link></li>
            <li><Link href="/danh-muc/cong-da" className="hover:text-orange-400 transition">Hồ sơ Cổng đá tam quan, tứ trụ</Link></li>
            <li><Link href="/danh-muc/lan-can" className="hover:text-orange-400 transition">Bản vẽ Lan can đá, con tiện</Link></li>
            <li><Link href="/danh-muc/vach-ngan" className="hover:text-orange-400 transition">Vách ngăn phong thủy, bình phong</Link></li>
            <li><Link href="/danh-muc/phu-dieu" className="hover:text-orange-400 transition">Tranh Phù điêu tứ quý, tùng hạc</Link></li>
            <li><Link href="/danh-muc/mo-lang-mo" className="hover:text-orange-400 transition">Hồ sơ Khu lăng mộ đá gia tộc</Link></li>
            <li><Link href="/danh-muc/trang-tri" className="hover:text-orange-400 transition">Cột rồng đá, đỉnh hương, đèn đá</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-3 border-orange-500 pl-2">
            Hỗ Trợ Khách Hàng
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• Hướng dẫn quét mã QR thanh toán nhanh</li>
            <li>• Cách tải và giải nén file nén .RAR / .ZIP</li>
            <li>• Phần mềm tương thích: AutoCAD 2007-2024</li>
            <li>• Đọc file JDpaint, ArtCAM cho máy khắc CNC</li>
            <li>• Chính sách hoàn tiền nếu file bị lỗi hoặc thiếu</li>
            <li>• Nhận chỉnh sửa kích thước bản vẽ theo yêu cầu</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-3 border-orange-500 pl-2">
            Thanh Toán Tiện Lợi
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Hỗ trợ thanh toán tự động qua tất cả ngân hàng Việt Nam và Ví MoMo:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div className="p-2 rounded bg-slate-800 text-center text-slate-200 border border-slate-700">
              VietQR (Napas 247)
            </div>
            <div className="p-2 rounded bg-slate-800 text-center text-pink-400 border border-slate-700">
              Ví MoMo
            </div>
            <div className="p-2 rounded bg-slate-800 text-center text-slate-200 border border-slate-700">
              Chuyển khoản 24/7
            </div>
            <div className="p-2 rounded bg-slate-800 text-center text-amber-300 border border-slate-700">
              Kích hoạt tức thì
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2026 Bản Vẽ Mỹ Nghệ & Nội Thất. Giao diện trực quan chuẩn sàn thiết kế.</p>
        <p>Hệ thống tự động kích hoạt tải file 24/7 không cần chờ duyệt.</p>
      </div>
    </footer>
  );
}