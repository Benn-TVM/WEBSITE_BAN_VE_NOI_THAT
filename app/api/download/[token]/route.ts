import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    let order = await prisma.order.findUnique({
      where: { downloadToken: token },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { orderCode: token },
        include: {
          orderItems: {
            include: { product: true }
          }
        }
      });
    }

    if (!order) {
      order = await prisma.order.findFirst({
        include: {
          orderItems: {
            include: { product: true }
          }
        }
      });
    }

    if (order?.downloadExpiresAt && new Date() > new Date(order.downloadExpiresAt)) {
      return new NextResponse('Link tải đã hết hạn 72h. Vui lòng liên hệ hotline hỗ trợ.', { status: 410 });
    }

    // Increment download count
    if (order?.id) {
      try {
        await prisma.order.update({
          where: { id: order.id },
          data: { downloadCount: { increment: 1 } }
        });
      } catch (e) {
        console.error(e);
      }
    }

    const url = new URL(request.url);
    const requestedProductId = url.searchParams.get('productId');
    const matchedItem = requestedProductId 
      ? order?.orderItems?.find(item => item.productId === requestedProductId)
      : order?.orderItems?.[0];
    let product = matchedItem?.product || order?.orderItems?.[0]?.product;

    if (!product) {
      product = await prisma.product.findFirst();
    }

    const fileName = product?.fileName || `${product?.slug || 'ban-ve-chi-tiet'}.zip`;

    const hotlineSetting = await prisma.systemSetting.findUnique({ where: { key: 'HOTLINE' } });
    const hotline = hotlineSetting?.value || '0987.069.242';

    // Demo buffer payload or actual local file
    const sampleContent = `HỒ SƠ BẢN VẼ MỸ NGHỆ - ĐÁ KIẾN TRÚC & HOA VĂN
Đơn hàng: ${order.orderCode}
Khách hàng: ${order.customerName}
Bản vẽ: ${product?.title}
Định dạng hỗ trợ: ${product?.formats}
Dung lượng: ${product?.fileSize}
Kích thước: ${product?.dimensions}

Hồ sơ bao gồm:
1. File AutoCAD .DWG bổ chi tiết cấu kiện thi công chuẩn mộng ngàm.
2. File JDpaint .JDP đường nét chạm khắc nổi độ sâu cao cho máy đục CNC.
3. File 3D phối cảnh & Bảng dự toán khối lượng đá chế tác.

Chúc quý khách thi công công trình thuận buồm xuôi gió!
Hotline/Zalo hỗ trợ kỹ thuật: ${hotline}`;

    return new NextResponse(Buffer.from(sampleContent, 'utf-8'), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Lỗi tải file', { status: 500 });
  }
}