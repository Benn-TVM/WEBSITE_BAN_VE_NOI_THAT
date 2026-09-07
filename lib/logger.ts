import prisma from '@/lib/prisma';

export interface LogPayload {
  action: string;
  title: string;
  details?: string;
  userEmail?: string;
  userName?: string;
  level?: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
}

export async function logActivity(payload: LogPayload) {
  try {
    return await prisma.systemLog.create({
      data: {
        action: payload.action,
        title: payload.title,
        details: payload.details || null,
        userEmail: payload.userEmail || null,
        userName: payload.userName || null,
        level: payload.level || 'INFO',
      },
    });
  } catch (e) {
    console.error('Failed to write system log:', e);
    return null;
  }
}
