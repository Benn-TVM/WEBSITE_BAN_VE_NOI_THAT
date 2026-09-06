'use client';

import React from 'react';
import AuthModal from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

export default function StandaloneRegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <AuthModal
        isOpen={true}
        defaultTab="register"
        onClose={() => router.push('/')}
        onSuccess={() => router.push('/tai-khoan/ban-ve-da-mua')}
      />
    </div>
  );
}