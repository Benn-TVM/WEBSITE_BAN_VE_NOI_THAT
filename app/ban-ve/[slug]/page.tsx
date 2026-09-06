import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch product with images and category
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    return notFound();
  }

  // Increment view counter
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      category: true,
      images: true,
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}