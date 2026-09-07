import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let downloadToken = order.downloadToken;
    if (order.status !== 'COMPLETED') {
      if (!downloadToken) {
        const crypto = await import('crypto');
        downloadToken = crypto.randomBytes(16).toString('hex');
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          downloadToken,
          transactions: {
            create: {
              amount: order.totalAmount,
              paymentMethod: order.paymentMethod,
              status: 'SUCCESS',
              transactionCode: 'TX-' + Date.now(),
            },
          },
        },
      });

      // Update download count for products in order
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { downloads: { increment: 1 } },
        });
      }

      const { logActivity } = await import('@/lib/logger');
      await logActivity({
        action: 'ORDER_PAID',
        title: `Thanh toán đơn hàng ${order.orderCode} thành công`,
        details: `Số tiền: ${order.totalAmount.toLocaleString('vi-VN')} đ • Phương thức: ${order.paymentMethod}`,
        userEmail: order.customerEmail,
        userName: order.customerName,
        level: 'SUCCESS',
      });
    }

    return NextResponse.json({
      success: true,
      status: 'COMPLETED',
      downloadToken: downloadToken,
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}