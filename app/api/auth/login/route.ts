import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập Email và Mật khẩu.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const lookupEmail = cleanEmail === 'admin' ? 'admin@gmail.com' : cleanEmail;
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.findUnique({
      where: { email: lookupEmail },
    });

    if (!user || user.passwordHash !== passwordHash) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 401 });
    }

    const isAdmin = lookupEmail === 'admin@gmail.com';

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin,
      },
      redirectTo: isAdmin ? '/admin' : null,
    });

    response.cookies.set('user_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi đăng nhập' }, { status: 500 });
  }
}