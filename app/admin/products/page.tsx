import React from 'react';
import prisma from '@/lib/prisma';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <ProductListClient initialProducts={products} />;
}