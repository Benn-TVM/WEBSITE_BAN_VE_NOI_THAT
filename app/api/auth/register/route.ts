import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ Tên, Email và Mật khẩu.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã được sử dụng. Vui lòng đăng nhập.' }, { status: 400 });
    }

    // Simple hash
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        phone: phone || null,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    const response = NextResponse.json({ success: true, user });
    response.cookies.set('user_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Không thể đăng ký tài khoản' }, { status: 500 });
  }
}