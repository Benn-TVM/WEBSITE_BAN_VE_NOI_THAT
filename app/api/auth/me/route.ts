import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_token')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      user: user ? {
        ...user,
        memberCode: `fad${user.id.slice(-6).toLowerCase()}`,
        xu: 0,
        isAdmin: user.email === 'admin@gmail.com' || user.email === 'admin',
      } : null 
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_token')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, currentPassword, newPassword } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (phone !== undefined) dataToUpdate.phone = phone;

    if (newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.passwordHash !== currentPassword) {
        return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng!' }, { status: 400 });
      }
      dataToUpdate.passwordHash = newPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        memberCode: `fad${updatedUser.id.slice(-6).toLowerCase()}`,
        xu: 0,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi cập nhật thông tin' }, { status: 500 });
  }
}