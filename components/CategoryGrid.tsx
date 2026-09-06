'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  DoorOpen, 
  ShieldCheck, 
  Layers, 
  Palette, 
  Landmark, 
  Crown,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

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

export default function CategoryGrid() {
  const { hotline, cleanHotline } = useSettings();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CATEGORIES_DATA.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.slug}
            href={`/danh-muc/${cat.slug}`}
            className="group rounded-xl p-5 bg-white border border-slate-200 hover:border-orange-500 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                  {cat.count}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors uppercase tracking-wide mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="pt-4 mt-2 flex items-center text-xs font-bold text-orange-600 group-hover:text-orange-700">
              <span>Xem hồ sơ bản vẽ</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}

      {/* Special Box: Custom Request */}
      <div className="rounded-xl p-5 bg-gradient-to-br from-orange-600 to-amber-600 text-white flex flex-col justify-between shadow-md">
        <div>
          <div className="w-10 h-10 rounded-lg bg-white text-orange-600 flex items-center justify-center mb-3 font-extrabold text-lg shadow-sm">
            ★
          </div>
          <h3 className="text-base font-bold uppercase tracking-wide mb-1">
            Thiết Kế Theo Yêu Cầu
          </h3>
          <p className="text-xs text-orange-100 leading-relaxed">
            Nhận bóc tách bản vẽ, đo đạc phong thủy và dựng 3D công trình lăng mộ, cổng đá theo kích thước đất của bạn.
          </p>
        </div>
        <a
          href={`https://zalo.me/${cleanHotline}`}
          target="_blank"
          rel="noreferrer"
          className="pt-4 flex items-center text-xs font-bold text-white hover:text-amber-200 underline"
        >
          <span>Chat Zalo: {hotline}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </a>
      </div>
    </div>
  );
}