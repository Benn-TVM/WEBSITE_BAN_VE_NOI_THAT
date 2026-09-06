import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bảo vệ tất cả các đường dẫn /admin ngoại trừ /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const userToken = request.cookies.get('user_token')?.value;

    // Nếu chưa đăng nhập (không có cookie token), chuyển hướng ngay lập tức về trang đăng nhập admin
    if (!userToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
