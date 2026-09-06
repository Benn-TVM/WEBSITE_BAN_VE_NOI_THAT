'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, CheckCircle2, AlertCircle, KeyRound, X } from 'lucide-react';

export default function AccountSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Email notifications state matching the screenshot
  const [emailSettings, setEmailSettings] = useState({
    downloadFree: true,
    downloadPaid: true,
    shareFromFriends: true,
    saveFileForMe: true,
    uploadPending: true,
    uploadApproved: true,
    marketing: true,
    withdraw: false,
    fileSale: false,
    forgotPassword: false,
  });

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setDisplayName(data.user.name || '');
          setPhone(data.user.phone || '');
        }
      })
      .catch(console.error);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || user?.name,
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        if (data.user) {
          setUser((prev: any) => ({ ...prev, ...data.user }));
        }
      } else {
        setToastMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra khi lưu thông tin.' });
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 1500);
      } else {
        setPasswordError(data.error || 'Mật khẩu hiện tại không đúng.');
      }
    } catch (err) {
      setPasswordError('Không thể kết nối máy chủ.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Vui Lòng Đăng Nhập
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Đăng nhập tài khoản để xem và thay đổi thông tin cá nhân của bạn.
        </p>
        <div className="pt-2">
          <Link
            href="/dang-nhap"
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition"
          >
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] animate-fade-in">
          <div
            className={`px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs sm:text-sm font-medium border ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-red-600 text-white border-red-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        {/* Grey Header Banner */}
        <div className="bg-[#e9edf0] border-b border-slate-200 px-4 sm:px-6 py-3">
          <h1 className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wide">
            CÀI ĐẶT THÔNG TIN
          </h1>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5 text-xs sm:text-sm">
          {/* Email đăng kí */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium">
              Email đăng kí
            </div>
            <div className="sm:col-span-9">
              <span className="font-bold text-blue-600 text-sm sm:text-base">
                {user.email}
              </span>
            </div>
          </div>

          {/* Họ và tên * */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </div>
            <div className="sm:col-span-9">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full sm:max-w-md px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
              />
            </div>
          </div>

          {/* Tên hiển thị * */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium">
              Tên hiển thị <span className="text-red-500">*</span>
            </div>
            <div className="sm:col-span-9">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full sm:max-w-md px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
              />
            </div>
          </div>

          {/* (Tài khoản ngân hàng - ĐÃ BỎ THEO YÊU CẦU ẢNH 2) */}

          {/* Số điện thoại * */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </div>
            <div className="sm:col-span-9">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 01... or 09.. or +84..."
                className="w-full sm:max-w-xs px-3 py-1.5 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 font-mono"
              />
            </div>
          </div>

          {/* Ảnh đại diện */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium pt-2">
              Ảnh đại diện
            </div>
            <div className="sm:col-span-9">
              <div className="w-20 h-20 bg-[#e2e8f0] border border-slate-300 rounded flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 4a4 4 0 100 8 4 4 0 000-8zm-7 15a7 7 0 0114 0H5z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Chọn ảnh khác */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 sm:text-right text-slate-700 font-medium">
              Chọn ảnh khác
            </div>
            <div className="sm:col-span-9">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-medium file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Nhận Email thông báo */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start pt-1">
            <div className="sm:col-span-3 sm:text-right text-slate-800 font-bold">
              Nhận Email thông báo
            </div>
            <div className="sm:col-span-9 space-y-1.5">
              {/* Active options with blue checkboxes */}
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.downloadFree}
                  onChange={(e) => setEmailSettings({ ...emailSettings, downloadFree: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email download file miễn phí</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.downloadPaid}
                  onChange={(e) => setEmailSettings({ ...emailSettings, downloadPaid: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email download file có phí</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.shareFromFriends}
                  onChange={(e) => setEmailSettings({ ...emailSettings, shareFromFriends: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email nhận file giới thiệu từ bạn bè</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.saveFileForMe}
                  onChange={(e) => setEmailSettings({ ...emailSettings, saveFileForMe: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email lưu file cho tôi</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.uploadPending}
                  onChange={(e) => setEmailSettings({ ...emailSettings, uploadPending: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email upload file chờ duyệt</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.uploadApproved}
                  onChange={(e) => setEmailSettings({ ...emailSettings, uploadApproved: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email upload file BQT đã duyệt</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.marketing}
                  onChange={(e) => setEmailSettings({ ...emailSettings, marketing: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Email nhận thông báo, marketing...</span>
              </label>

              {/* Disabled / greyed-out options (matching screenshot) */}
              <label className="flex items-center space-x-2 text-slate-400 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-slate-300 w-3.5 h-3.5 cursor-not-allowed opacity-50"
                />
                <span>Email Rút tiền</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-400 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-slate-300 w-3.5 h-3.5 cursor-not-allowed opacity-50"
                />
                <span>Email báo giao dịch bán file</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-400 cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-slate-300 w-3.5 h-3.5 cursor-not-allowed opacity-50"
                />
                <span>Email quên mật khẩu</span>
              </label>
            </div>
          </div>

          {/* Đổi mật khẩu mới link */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center pt-1">
            <div className="sm:col-span-3 sm:text-right"></div>
            <div className="sm:col-span-9">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-orange-500 hover:text-orange-600 font-medium text-xs sm:text-sm hover:underline"
              >
                Đổi mật khẩu mới
              </button>
            </div>
          </div>

          {/* Nút Cập nhật thông tin */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center pt-2">
            <div className="sm:col-span-3 sm:text-right"></div>
            <div className="sm:col-span-9">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs sm:text-sm shadow-xs transition active:scale-95 disabled:opacity-60"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{isSubmitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-800 text-sm uppercase">Đổi Mật Khẩu Mới</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mật khẩu mới:</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
