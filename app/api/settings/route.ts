import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const configMap: Record<string, string> = {
      HOTLINE: '0987.069.242',
      SUPPORT_EMAIL: 'hotro@banvenoithat.vn',
      BANK_NAME: 'Vietcombank',
      BANK_ACCOUNT_NO: '9988776655',
      BANK_ACCOUNT_NAME: 'NGUYEN VAN QUAN TRI',
      MOMO_PHONE: '0987069242',
    };

    settings.forEach((s) => {
      if (s.value) {
        configMap[s.key] = s.value;
      }
    });

    return NextResponse.json(configMap, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json({
      HOTLINE: '0987.069.242',
      SUPPORT_EMAIL: 'hotro@banvenoithat.vn',
      BANK_NAME: 'Vietcombank',
      BANK_ACCOUNT_NO: '9988776655',
      BANK_ACCOUNT_NAME: 'NGUYEN VAN QUAN TRI',
      MOMO_PHONE: '0987069242',
    });
  }
}
