import React from 'react';
import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return <OrdersClient initialOrders={orders} />;
}