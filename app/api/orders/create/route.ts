import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, items, customerName, customerEmail, customerPhone, paymentMethod } = body;

    let targetItems: Array<{ productId: string; price: number }> = [];

    if (Array.isArray(items) && items.length > 0) {
      // Multi-item cart order
      const productIds = items.map((i: any) => i.productId || i.id);
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      targetItems = dbProducts.map((p) => ({
        productId: p.id,
        price: p.price,
      }));
    } else if (productId) {
      // Single item buy now
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (product) {
        targetItems = [{ productId: product.id, price: product.price }];
      }
    }

    if (targetItems.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm hợp lệ để tạo đơn' }, { status: 400 });
    }

    const totalAmount = targetItems.reduce((sum, item) => sum + item.price, 0);

    // Check logged in user - BẮT BUỘC ĐĂNG NHẬP MỚI ĐƯỢC MUA HÀNG
    const cookieStore = cookies();
    const loggedUserId = cookieStore.get('user_token')?.value;

    if (!loggedUserId) {
      return NextResponse.json({ 
        error: 'Vui lòng đăng nhập tài khoản trước khi mua bản vẽ để nhận link tải và lưu trữ vào hồ sơ!' 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: loggedUserId } });
    if (!user) {
      return NextResponse.json({ 
        error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!' 
      }, { status: 401 });
    }

    // Generate unique order code: BV + 6 digits
    const orderCode = 'BV' + Math.floor(100000 + Math.random() * 900000);
    const downloadToken = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    const order = await prisma.order.create({
      data: {
        orderCode,
        userId: user.id,
        customerName: customerName || user.name || 'Khách hàng',
        customerEmail: customerEmail || user.email || 'khach@example.com',
        customerPhone: customerPhone || user.phone || null,
        totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'VIETQR',
        downloadToken,
        downloadExpiresAt: expiresAt,
        orderItems: {
          create: targetItems.map((ti) => ({
            productId: ti.productId,
            price: ti.price,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderCode: order.orderCode,
        totalAmount: order.totalAmount,
        downloadToken: order.downloadToken,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}