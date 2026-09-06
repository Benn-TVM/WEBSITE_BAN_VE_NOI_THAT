'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Building2, Smartphone, PhoneCall, Mail, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    BANK_NAME: 'Vietcombank',
    BANK_ACCOUNT_NO: '9988776655',
    BANK_ACCOUNT_NAME: 'NGUYEN VAN QUAN TRI',
    MOMO_PHONE: '0987069242',
    HOTLINE: '0987.069.242',
    SUPPORT_EMAIL: 'hotro@banvenoithat.vn',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setFormData((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg('Đã lưu thông tin tài khoản & cấu hình QR thành công!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('Lỗi khi lưu cấu hình');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
          Cấu Hình Tài Khoản Nhận Tiền & VietQR
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Các thông tin này được dùng để tự động sinh mã VietQR và thông tin thanh toán cho khách hàng trên toàn website.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        
        {/* Banking section */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 mr-1.5 text-orange-600" />
            Tài Khoản Ngân Hàng Nhận Tiền (VietQR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên Ngân hàng:
              </label>
              <input
                type="text"
                required
                value={formData.BANK_NAME}
                onChange={(e) => setFormData({ ...formData, BANK_NAME: e.target.value })}
                placeholder="VD: Vietcombank, MB Bank, Techcombank..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Số Tài Khoản Nhận Tiền:
              </label>
              <input
                type="text"
                required
                value={formData.BANK_ACCOUNT_NO}
                onChange={(e) => setFormData({ ...formData, BANK_ACCOUNT_NO: e.target.value })}
                placeholder="VD: 9988776655"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-orange-600 text-sm font-bold font-mono focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Họ & Tên Chủ Tài Khoản:
              </label>
              <input
                type="text"
                required
                value={formData.BANK_ACCOUNT_NAME}
                onChange={(e) => setFormData({ ...formData, BANK_ACCOUNT_NAME: e.target.value })}
                placeholder="VD: NGUYEN VAN QUAN TRI"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm uppercase font-semibold focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* MoMo section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
            <Smartphone className="w-4 h-4 mr-1.5" />
            Cấu Hình Ví MoMo
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Điện Thoại Nhận Tiền MoMo:
            </label>
            <input
              type="text"
              value={formData.MOMO_PHONE}
              onChange={(e) => setFormData({ ...formData, MOMO_PHONE: e.target.value })}
              placeholder="VD: 0987069242"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-mono focus:outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Support Hotline & Email */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
            <PhoneCall className="w-4 h-4 mr-1.5 text-orange-600" />
            Thông Tin Hỗ Trợ Kỹ Thuật (Hiển thị ở Header & Footer)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Số Hotline / Zalo Kỹ Thuật:
              </label>
              <input
                type="text"
                value={formData.HOTLINE}
                onChange={(e) => setFormData({ ...formData, HOTLINE: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Hỗ Trợ:
              </label>
              <input
                type="email"
                value={formData.SUPPORT_EMAIL}
                onChange={(e) => setFormData({ ...formData, SUPPORT_EMAIL: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-xs hover:shadow transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang cập nhật...' : 'Lưu Thay Đổi Cấu Hình'}
          </button>
        </div>

      </form>
    </div>
  );
}