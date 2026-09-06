'use client';

import React from 'react';
import AuthModal from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

export default function StandaloneLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <AuthModal
        isOpen={true}
        defaultTab="login"
        onClose={() => router.push('/')}
        onSuccess={(user) => {
          if (user?.isAdmin || user?.email === 'admin@gmail.com') {
            window.location.href = '/admin';
          } else {
            router.push('/tai-khoan/ban-ve-da-mua');
          }
        }}
      />
    </div>
  );
}