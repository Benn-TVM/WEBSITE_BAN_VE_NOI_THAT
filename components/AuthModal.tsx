'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, Crown } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  reason?: string | null;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login', reason, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Tự động chuyển tab đúng khi mở popup
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setError('');
    }
  }, [isOpen, defaultTab]);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.user);
        onClose();
        if (data.user?.isAdmin || data.user?.email === 'admin@gmail.com' || data.redirectTo === '/admin') {
          window.location.href = '/admin';
        }
      } else {
        setError(data.error || 'Đăng nhập không thành công');
      }
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Đăng ký không thành công');
      }
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Tài Khoản Thành Viên
              </h3>
              <p className="text-[11px] text-slate-500">
                Lưu trữ và tải lại các bản vẽ đã mua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason banner if triggered by an action requiring login */}
        {reason && (
          <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span>{reason}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 m-5 mb-0 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              tab === 'login'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-2 rounded-lg transition ${
              tab === 'register'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 pt-4">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email đăng nhập:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="banve@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider shadow-sm transition flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập Ngay'}</span>
              </button>

              <div className="text-center pt-2 text-slate-500">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-orange-600 hover:underline font-bold"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên (*):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email (*):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Số điện thoại / Zalo:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0987xxxxxx"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mật khẩu (*):
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider shadow-sm transition flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản Ngay'}</span>
              </button>

              <div className="text-center pt-1 text-slate-500">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-orange-600 hover:underline font-bold"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}