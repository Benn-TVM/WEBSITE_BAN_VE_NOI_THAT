'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  QrCode, 
  Heart, 
  Eye, 
  Star, 
  Edit3, 
  Info, 
  Check, 
  ImageIcon, 
  X, 
  ZoomIn, 
  Share2, 
  CheckCircle2,
  FileText,
  Layers,
  ChevronRight,
  PhoneCall,
  ShoppingCart
} from 'lucide-react';
import { formatVND } from '@/lib/vietqr';
import PaymentQRModal from '@/components/PaymentQRModal';
import ProductCard from '@/components/ProductCard';
import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

interface ProductDetailClientProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku?: string | null;
    price: number;
    originalPrice?: number | null;
    formats: string;
    fileSize: string;
    description: string;
    details?: string | null;
    dimensions?: string | null;
    views: number;
    downloads: number;
    fileName?: string | null;
    createdAt: string | Date;
    category?: {
      name: string;
      slug: string;
    } | null;
    images: Array<{ id: string; url: string; isPrimary: boolean; caption?: string | null }>;
  };
  relatedProducts?: any[];
}

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const { hotline, cleanHotline } = useSettings();
  const { user, openLoginModal } = useAuth();
  const { addToCart, isItemInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const inCart = isItemInCart(product.id);
  const isLiked = isFavorite(product.id);

  const primaryImage = product.images?.[0]?.url || '';

  const handleToggleFavorite = () => {
    if (!user) {
      openLoginModal('Vui lòng đăng nhập để lưu bản vẽ vào mục Yêu thích!');
      return;
    }
    toggleFavorite({
      id: product.id,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice,
      image: primaryImage,
      formats: product.formats,
      fileSize: product.fileSize,
      categoryName: product.category?.name,
    });
  };
  // Demo images list (technical CAD blueprints provided by user)
  const demoDrawings = [
    {
      url: '/demo/cad-demo-1.png',
      title: 'Bản vẽ 1: Mặt bằng bố trí kiến trúc & nội thất tổng thể',
      shortTitle: 'Mặt bằng nội thất',
    },
    {
      url: '/demo/cad-demo-2.png',
      title: 'Bản vẽ 2: Mặt bằng thiết kế hệ thống trần đèn & thiết bị kỹ thuật',
      shortTitle: 'Mặt bằng trần đèn',
    },
    {
      url: '/demo/cad-demo-3.png',
      title: 'Bản vẽ 3: Bản vẽ mặt đứng chi tiết thi công KIDS CLUB E03',
      shortTitle: 'Mặt đứng E03',
    },
  ];

  const cadDemoImages = [
    ...demoDrawings.map((d) => d.url),
    ...(product.images || []).map((img) => img.url),
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  const [selectedImage, setSelectedImage] = useState(cadDemoImages[0]);

  // States
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [guideModal, setGuideModal] = useState<'free' | 'paid' | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Derive file code
  const fileCode = product.sku ? product.sku.replace(/[^0-9]/g, '') || '230487' : '230487';
  
  // Format price in Xu (1 Xu = 1.000đ)
  const xuAmount = Math.max(1, Math.round(product.price / 1000));

  // Date formatted
  const postDate = new Date(product.createdAt || Date.now()).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  // Tags cloud
  const tags = [
    'Thiết kế',
    'Thiết kế nội thất',
    'Mặt bằng',
    'Mặt cắt',
    'Khu vui chơi',
    'Mặt bằng nội thất',
    product.dimensions || '13x14m',
    product.category?.name || 'AutoCAD',
    'Chi tiết cấu kiện',
    'File chuẩn thi công'
  ];




  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
      setReviewText('');
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 py-1">
          <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
          <span className="text-slate-400 font-mono">&gt;</span>
          <Link href="/danh-muc/autocad" className="hover:text-orange-600 transition">Autocad</Link>
          <span className="text-slate-400 font-mono">&gt;</span>
          {product.category && (
            <>
              <Link href={`/danh-muc/${product.category.slug}`} className="hover:text-orange-600 transition">
                {product.category.name}
              </Link>
              <span className="text-slate-400 font-mono">&gt;</span>
            </>
          )}
          <span className="text-slate-700 font-medium truncate max-w-xs md:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* TOP MAIN PRODUCT CARD (Border & White Background) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Thumbnail, View Demo & Tags (5 cols) */}
            <div className="md:col-span-4 lg:col-span-4 space-y-3.5">
              
              {/* Product Preview Image Frame */}
              <div className="border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs group relative">
                <div className="aspect-[4/3] rounded overflow-hidden bg-slate-50 relative cursor-pointer border border-slate-100 flex items-center justify-center" onClick={() => setLightboxImage(selectedImage)}>
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Thumbnails list */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 px-0.5">
                  {cadDemoImages.slice(0, 3).map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`h-14 rounded border overflow-hidden bg-slate-50 transition-all flex items-center justify-center p-0.5 ${
                        selectedImage === imgUrl ? 'border-orange-500 ring-2 ring-orange-400/40 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                      title={demoDrawings[i]?.shortTitle || `Bản vẽ ${i + 1}`}
                    >
                      <img src={imgUrl} alt={`Thumb ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>

                {/* View Demo Images Link */}
                <button
                  type="button"
                  onClick={() => scrollToSection('hinh-anh-demo')}
                  className="w-full pt-2.5 pb-1 text-orange-600 hover:text-orange-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Xem {cadDemoImages.length} Ảnh demo chi tiết</span>
                </button>
              </div>

              {/* Blue Button: Xem thêm FILE GẦN GIỐNG */}
              <button
                type="button"
                onClick={() => scrollToSection('file-gan-giong')}
                className="w-full py-2.5 px-4 rounded bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center shadow-xs transition active:scale-98"
              >
                <span>Xem thêm FILE GẦN GIỐNG</span>
              </button>

              {/* Keywords / Tags Cloud */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/?q=${encodeURIComponent(tag)}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded border border-slate-200 transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

            </div>

            {/* RIGHT COLUMN: Title, Stats, Price, Download, Table (8 cols) */}
            <div className="md:col-span-8 lg:col-span-8 space-y-3.5">
              
              {/* Title with Blue File Code */}
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 leading-snug">
                {product.title}{' '}
                <span className="text-[#2563eb] font-bold">[Mã file {fileCode}]</span>
              </h1>

              {/* Ratings and Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-2.5">
                {/* Left: Star rating & review link */}
                <div className="flex items-center space-x-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700">1 Đánh giá</span>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex items-center space-x-1 text-slate-600 hover:text-orange-600 font-medium transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Viết đánh giá</span>
                  </button>
                </div>

                {/* Right: Download, View, Favorite Counts */}
                <div className="flex items-center space-x-3 text-slate-500 font-mono text-xs">
                  <span className="flex items-center space-x-1" title="Lượt tải">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700">{product.downloads || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Lượt xem">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-700">{product.views || 13}</span>
                  </span>
                  <button type="button" onClick={handleToggleFavorite} className="flex items-center space-x-1 hover:text-rose-600 transition" title={isLiked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}>
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    <span className={`font-bold ${isLiked ? 'text-rose-600' : 'text-slate-700'}`}>{isLiked ? 'Đã thích' : 'Thích'}</span>
                  </button>
                </div>
              </div>

              {/* Price Box (Như trước) */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase">Giá tải trọn gói:</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-mono tracking-tight">
                    {formatVND(product.price)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-right">
                      <div className="text-[10px] sm:text-[11px] text-slate-400">Giá gốc:</div>
                      <div className="text-xs sm:text-sm text-slate-400 line-through font-mono">
                        {formatVND(product.originalPrice)}
                      </div>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition shadow-xs ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : 'text-slate-400'}`} />
                    <span>{isLiked ? 'ĐÃ THÍCH' : 'YÊU THÍCH'}</span>
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="space-y-2 sm:space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        openLoginModal('Vui lòng đăng nhập tài khoản trước khi mua bản vẽ!');
                        return;
                      }
                      setIsQRModalOpen(true);
                    }}
                    className="w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-[0.98] transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 shrink-0" />
                    <span className="truncate">Mua Ngay ({formatVND(product.price)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        openLoginModal('Vui lòng đăng nhập để thêm bản vẽ vào giỏ hàng!');
                        return;
                      }
                      addToCart({
                        id: product.id,
                        title: product.title,
                        slug: product.slug,
                        sku: product.sku,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: selectedImage || '/demo/cad-demo-1.png',
                        formats: product.formats,
                        fileSize: product.fileSize,
                        categoryName: product.category?.name,
                      });
                    }}
                    className={`w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border-2 font-extrabold text-xs uppercase tracking-wider shadow-xs active:scale-[0.98] transition flex items-center justify-center space-x-2 cursor-pointer ${
                      inCart
                        ? 'bg-orange-50 text-orange-600 border-orange-500'
                        : 'bg-white hover:bg-orange-50 text-orange-600 border-orange-400'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span className="truncate">{inCart ? 'Đã Có Trong Giỏ' : 'Thêm Vào Giỏ Hàng'}</span>
                  </button>
                </div>

                <a
                  href={`https://zalo.me/${cleanHotline}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 sm:px-6 rounded-xl bg-slate-100 text-slate-700 hover:text-orange-600 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 shrink-0 text-orange-600" />
                  <span>Tư Vấn Zalo: {hotline}</span>
                </a>
              </div>

              {/* Dashed Divider */}
              <div className="border-t border-dashed border-slate-300 my-2"></div>

              {/* File Info Metadata Table */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Danh mục:</span>
                  <span className="text-orange-600 font-semibold hover:underline cursor-pointer">Autocad</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Thể loại:</span>
                  <span className="text-orange-600 font-semibold hover:underline cursor-pointer">{product.category?.name || 'Kỹ thuật - Cơ khí'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Nhóm file:</span>
                  <span className="text-blue-600 font-semibold flex items-center space-x-1">
                    <span>File chất lượng</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Ngày đăng:</span>
                  <span className="text-slate-800 font-mono">{postDate}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Loại file:</span>
                  <span className="text-slate-800 font-medium">Full file</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-slate-500 shrink-0">Dung lượng:</span>
                  <span className="text-slate-800 font-mono font-medium">{product.fileSize || '36.8 MB'}</span>
                </div>
              </div>

              {/* Guarantees Box with Orange Dashed Border */}
              <div className="border border-dashed border-orange-400 bg-orange-50/30 rounded-lg p-2.5 flex flex-wrap items-center justify-around gap-2 text-xs font-bold text-emerald-700">
                <div className="flex items-center space-x-1">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>File đã kiểm thử</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>File chất lượng</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>File đầy đủ và chi tiết</span>
                </div>
              </div>

              {/* Guide Buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="text-slate-800 font-bold">Hướng dẫn:</span>
                <button
                  type="button"
                  onClick={() => setGuideModal('free')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-xs transition"
                >
                  Tải file miễn phí
                </button>
                <button
                  type="button"
                  onClick={() => setGuideModal('paid')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-xs transition"
                >
                  Tải file có phí
                </button>
              </div>

              {/* Short Summary Gray Box */}
              <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-200/60">
                {product.description || 'Thiết kế nội thất khu vui chơi trẻ em 13x14m. Rất thích hợp tham khảo học tập phát triển'}
              </div>

            </div>

          </div>
        </div>

        {/* DETAILED DESCRIPTION WITH ORANGE TAB (Image 2 & Image 3) */}
        <div className="mt-8">
          {/* Orange Tab Header */}
          <div className="inline-block bg-[#ea580c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-2.5 rounded-t-lg shadow-xs">
            MÔ TẢ CHI TIẾT
          </div>

          {/* Bordered Container (Orange Border) */}
          <div className="bg-white border-2 border-orange-500 rounded-b-xl rounded-tr-xl p-5 sm:p-8 shadow-xs space-y-6">
            
            {/* Detailed text explanation */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 border-b border-slate-100 pb-5">
              <p className="font-semibold text-slate-900">{product.title}</p>
              <p>File CAD thiết kế bao gồm:</p>
              <ul className="list-none space-y-1 pl-1 text-slate-700 font-mono text-xs">
                <li>+ Mặt bằng kiến trúc & bố trí công năng tổng thể</li>
                <li>+ Mặt cắt kỹ thuật chi tiết cấu kiện</li>
                <li>+ Chi tiết hoa văn, mộng ngàm và thông số chuẩn Lỗ Ban</li>
                {product.details && <li>+ {product.details}</li>}
              </ul>
              <p className="text-slate-600 italic pt-1">
                Rất thích hợp tham khảo thi công thực tế, thợ chế tác, kiến trúc sư và học tập nghiên cứu.
              </p>
            </div>

            {/* HÌNH ẢNH DEMO */}
            <div id="hinh-anh-demo" className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wide flex items-center">
                  <span className="w-1.5 h-4 bg-orange-500 rounded mr-2 inline-block"></span>
                  HÌNH ẢNH DEMO BẢN VẼ
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Click vào ảnh để phóng to chi tiết CAD
                </span>
              </div>

              {/* List of technical CAD drawings */}
              <div className="space-y-6">
                {cadDemoImages.map((imgUrl, index) => {
                  const drawingMeta = demoDrawings[index];
                  const drawingTitle = drawingMeta?.title || `Bản vẽ kỹ thuật chi tiết #${index + 1}`;
                  return (
                    <div
                      key={index}
                      onClick={() => setLightboxImage(imgUrl)}
                      className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs hover:border-orange-400 transition cursor-pointer group relative"
                    >
                      <div className="p-3 sm:p-6 bg-slate-50 flex items-center justify-center">
                        <img
                          src={imgUrl}
                          alt={drawingTitle}
                          className="max-h-[750px] w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                      </div>

                      {/* Watermark & Title bar */}
                      <div className="bg-slate-100 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{drawingTitle}</span>
                        <span className="text-[#2563eb] font-bold flex items-center space-x-1 group-hover:underline">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Xem ảnh gốc phóng to</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS: FILE GẦN GIỐNG */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section id="file-gan-giong" className="pt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-wide flex items-center">
                <span className="w-1.5 h-5 bg-[#2563eb] rounded mr-2 inline-block"></span>
                FILE GẦN GIỐNG / BẢN VẼ CÙNG CHUYÊN MỤC
              </h2>
              {product.category && (
                <Link
                  href={`/danh-muc/${product.category.slug}`}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Xem tất cả {product.category.name} →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-orange-400 text-sm font-bold flex items-center space-x-1 p-2"
            >
              <span>Đóng</span>
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Bản vẽ phóng to"
              className="max-h-[85vh] w-auto object-contain rounded bg-white p-1"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}


      {/* REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-slate-900">
                Viết Đánh Giá Cho Bản Vẽ
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Cảm ơn bạn đã gửi đánh giá!</h4>
                <p className="text-xs text-slate-500">Đánh giá của bạn giúp cộng đồng chọn lựa bản vẽ chất lượng hơn.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Chất lượng bản vẽ:</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Nội dung nhận xét:</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Bản vẽ rất đầy đủ, chi tiết mặt bằng mặt cắt chuẩn xác..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase transition"
                >
                  Gửi Đánh Giá Ngay
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DOWNLOAD GUIDE MODAL */}
      {guideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold uppercase text-slate-900">
                {guideModal === 'free' ? 'Hướng Dẫn Tải File Miễn Phí' : 'Hướng Dẫn Tải File Có Phí (VietQR)'}
              </h3>
              <button onClick={() => setGuideModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {guideModal === 'free' ? (
              <div className="space-y-3 text-slate-700">
                <p>1. Các file miễn phí được chia sẻ có huy hiệu <strong>FREE</strong>.</p>
                <p>2. Đăng nhập tài khoản thành viên để nhận link tải ngay lập tức.</p>
                <p>3. Mỗi tài khoản được tải tối đa 3 file miễn phí mỗi ngày.</p>
              </div>
            ) : (
              <div className="space-y-3 text-slate-700">
                <p>1. Bấm nút <strong>DOWNLOAD</strong> màu xanh hoặc <strong>Quét mã QR</strong>.</p>
                <p>2. Mở ứng dụng ngân hàng bất kỳ (Vietcombank, MB, Techcombank...) hoặc MoMo quét mã QR.</p>
                <p>3. Hệ thống tự động nhận diện thanh toán trong 3 - 5 giây và mở ngay trang tải file nén gốc (.dwg, .max, .pdf) bảo mật 72 giờ.</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setGuideModal(null)}
              className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-bold uppercase transition"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT QR MODAL */}
      <PaymentQRModal
        product={product}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </>
  );
}