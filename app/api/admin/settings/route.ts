import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const configMap: Record<string, string> = {};
    settings.forEach((s) => {
      configMap[s.key] = s.value;
    });
    return NextResponse.json({ settings: configMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_token')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập quản trị viên' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.email !== 'admin@gmail.com' && user.email !== 'admin')) {
      return NextResponse.json({ error: 'Chỉ tài khoản quản trị mới có quyền thực hiện' }, { status: 403 });
    }

    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}