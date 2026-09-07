import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      select: {
        id: true,
        orderCode: true,
        status: true,
        totalAmount: true,
        downloadToken: true,
        downloadExpiresAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({
        status: 'COMPLETED',
        downloadToken: orderCode,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      });
    }

    return NextResponse.json({
      status: order.status,
      downloadToken: order.downloadToken,
      expiresAt: order.downloadExpiresAt,
    });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}