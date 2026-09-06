'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user?.isAdmin || data.user?.email === 'admin@gmail.com') {
          router.push('/admin');
        } else {
          setError('Tài khoản này không có quyền truy cập trang quản trị!');
        }
      } else {
        setError(data.error || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f4f6fa]">
      <div className="w-full max-w-md">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md mx-auto mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-orange-600">
              <Crown className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wider">
            ADMIN <span className="text-orange-600">PORTAL</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Hệ thống Quản trị Bản vẽ Mỹ nghệ & Kiến trúc đá
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Tên đăng nhập:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm active:scale-95 transition flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link href="/" className="text-xs font-semibold text-orange-600 hover:underline">
              ← Trở về Trang chủ người dùng
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}