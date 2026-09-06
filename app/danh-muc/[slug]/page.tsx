import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Sparkles, SlidersHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { sort?: string; format?: string };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const { sort, format } = searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return notFound();
  }

  const orderBy: any = {};
  if (sort === 'price-asc') orderBy.price = 'asc';
  else if (sort === 'price-desc') orderBy.price = 'desc';
  else if (sort === 'views') orderBy.views = 'desc';
  else orderBy.createdAt = 'desc';

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      ...(format ? { formats: { contains: format } } : {}),
    },
    include: {
      category: true,
      images: true,
    },
    orderBy,
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
        <span>/</span>
        <span className="text-orange-600 font-bold">{category.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center mb-1">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            Hồ Sơ Bản Vẽ Chuyên Sâu
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-wide leading-tight">
            Bản Vẽ {category.name}
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
            {category.description || 'Tổng hợp các bản vẽ thiết kế thi công chất lượng cao, đầy đủ thông số kỹ thuật và file cắt CNC / 3D.'}
          </p>
          <div className="mt-3 inline-block text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
            Hiện có {products.length} bộ hồ sơ bản vẽ
          </div>
        </div>
      </div>

      {/* Filter / Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-600">
          <div className="flex items-center space-x-1.5 font-semibold shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span>Định dạng:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={`/danh-muc/${slug}`}
              className={`px-2.5 py-1 rounded-md border transition font-medium text-[11px] sm:text-xs ${
                !format ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400'
              }`}
            >
              Tất cả
            </Link>
            <Link
              href={`/danh-muc/${slug}?format=AutoCAD`}
              className={`px-2.5 py-1 rounded-md border transition font-medium text-[11px] sm:text-xs ${
                format === 'AutoCAD' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400'
              }`}
            >
              AutoCAD (.dwg)
            </Link>
            <Link
              href={`/danh-muc/${slug}?format=JDpaint`}
              className={`px-2.5 py-1 rounded-md border transition font-medium text-[11px] sm:text-xs ${
                format === 'JDpaint' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400'
              }`}
            >
              JDpaint (.jdp)
            </Link>
            <Link
              href={`/danh-muc/${slug}?format=3ds Max`}
              className={`px-2.5 py-1 rounded-md border transition font-medium text-[11px] sm:text-xs ${
                format === '3ds Max' ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400'
              }`}
            >
              3ds Max / SketchUp
            </Link>
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-slate-500 font-medium shrink-0">Sắp xếp:</span>
          <div className="flex space-x-1 font-semibold">
            <Link
              href={`/danh-muc/${slug}?sort=newest`}
              className={`px-2 py-1 rounded ${(!sort || sort === 'newest') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Mới nhất
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href={`/danh-muc/${slug}?sort=price-asc`}
              className={`px-2 py-1 rounded ${sort === 'price-asc' ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Giá thấp
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href={`/danh-muc/${slug}?sort=price-desc`}
              className={`px-2 py-1 rounded ${sort === 'price-desc' ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Giá cao
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <p className="text-slate-500 text-sm">Chưa có bản vẽ nào trong danh mục hoặc bộ lọc này.</p>
          <Link href="/" className="mt-3 inline-block text-xs font-bold text-orange-600 hover:underline">
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}