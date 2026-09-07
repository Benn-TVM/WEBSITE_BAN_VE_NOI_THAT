import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = cookies();
  const userId = cookieStore.get('user_token')?.value;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.email !== 'admin@gmail.com' && user.email !== 'admin')) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || '';

    // Check if logs are empty, auto seed initial logs
    const count = await prisma.systemLog.count();
    if (count === 0) {
      await prisma.systemLog.createMany({
        data: [
          {
            action: 'SYSTEM_START',
            title: 'Khởi động hệ thống thành công',
            details: 'Hệ thống website Bản Vẽ Mỹ Nghệ sẵn sàng hoạt động trên Vercel Serverless.',
            userEmail: 'system@internal',
            userName: 'Hệ Thống Tự Động',
            level: 'INFO',
            createdAt: new Date(Date.now() - 3600000 * 24),
          },
          {
            action: 'CATEGORY_SYNC',
            title: 'Đồng bộ 7 danh mục bản vẽ',
            details: 'Hoa văn, Cổng đá, Lan can, Vách ngăn, Phù điêu, Lăng mộ, Trang trí kiến trúc.',
            userEmail: 'admin@gmail.com',
            userName: 'Quản Trị Viên',
            level: 'INFO',
            createdAt: new Date(Date.now() - 3600000 * 18),
          },
          {
            action: 'PRODUCT_UPDATE',
            title: 'Cập nhật bản vẽ Cổng đá tam quan',
            details: 'Cập nhật giá bán 250.000đ, bổ sung 3 bản vẽ chi tiết CAD và thông số Lỗ Ban.',
            userEmail: 'admin@gmail.com',
            userName: 'Quản Trị Viên',
            level: 'SUCCESS',
            createdAt: new Date(Date.now() - 3600000 * 10),
          },
          {
            action: 'ORDER_PAID',
            title: 'Xác nhận đơn hàng BV230487 thành công',
            details: 'Khách hàng hoàn tất thanh toán VietQR số tiền 250.000đ. Đã cấp link tải bảo mật 72 giờ.',
            userEmail: 'vietmy@gmail.com',
            userName: 'Khách hàng Demo',
            level: 'SUCCESS',
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
          {
            action: 'ADMIN_LOGIN',
            title: 'Quản trị viên đăng nhập Portal',
            details: 'Đăng nhập từ IP máy quản trị, phiên làm việc an toàn.',
            userEmail: 'admin@gmail.com',
            userName: 'Quản Trị Viên',
            level: 'INFO',
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
          },
        ],
      });
    }

    const whereClause: any = {};
    if (level && level !== 'ALL') {
      whereClause.level = level;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { details: { contains: search } },
        { userEmail: { contains: search } },
        { userName: { contains: search } },
      ];
    }

    const logs = await prisma.systemLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Get system logs error:', error);
    return NextResponse.json({ error: 'Lỗi nạp log hệ thống' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    await prisma.systemLog.deleteMany({});
    return NextResponse.json({ success: true, message: 'Đã xóa toàn bộ log' });
  } catch (error) {
    console.error('Clear logs error:', error);
    return NextResponse.json({ error: 'Không thể xóa log' }, { status: 500 });
  }
}
