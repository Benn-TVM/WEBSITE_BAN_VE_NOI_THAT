import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received payment webhook:', body);

    // Support standard webhook formats (PayOS, SePay, Casso)
    // Extracts transaction description/content
    const content = body.content || body.description || body.orderCode || '';
    const amount = body.amount || body.transferAmount || 0;

    // Search for order code matching pattern BV\d{6}
    const match = content.match(/BV\d{6}/i);
    if (!match) {
      return NextResponse.json({ message: 'No matching order code found in content' }, { status: 200 });
    }

    const orderCode = match[0].toUpperCase();
    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ message: `Order ${orderCode} not found` }, { status: 200 });
    }

    if (order.status !== 'COMPLETED') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          transactions: {
            create: {
              amount: amount || order.totalAmount,
              paymentMethod: 'WEBHOOK_AUTO',
              status: 'SUCCESS',
              transactionCode: body.transactionCode || body.reference || String(Date.now()),
              rawWebhookData: JSON.stringify(body),
            },
          },
        },
      });

      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { downloads: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ success: true, message: `Order ${orderCode} activated successfully` });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}