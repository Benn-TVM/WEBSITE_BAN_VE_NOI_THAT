'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Building2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Loader2, 
  Download, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { formatVND, getVietQRUrl, getMoMoQRUrl, DEFAULT_BANK_CONFIG } from '@/lib/vietqr';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';

interface PaymentQRModalProps {
  product?: {
    id: string;
    title: string;
    price: number;
    sku?: string | null;
    fileName?: string | null;
    formats?: string | null;
  };
  cartItems?: Array<{
    id: string;
    title: string;
    price: number;
    sku?: string | null;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentQRModal({ product, cartItems = [], isOpen, onClose, onSuccess }: PaymentQRModalProps) {
  const router = useRouter();
  const { user, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'VIETQR' | 'MOMO' | 'MANUAL'>('VIETQR');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<{
    id: string;
    orderCode: string;
    totalAmount: number;
    downloadToken?: string;
  } | null>(null);

  const [cachedItems] = useState(cartItems);
  const isCart = cachedItems.length > 0 || cartItems.length > 0;
  const activeItems = cartItems.length > 0 ? cartItems : cachedItems;
  const computedTotal = isCart
    ? activeItems.reduce((sum, item) => sum + item.price, 0)
    : (product?.price || 0);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Auto create order when modal opens if not already created
  useEffect(() => {
    if (isOpen && !order) {
      handleCreateOrder();
    }
  }, [isOpen]);

  // Polling order status
  useEffect(() => {
    if (!order || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.orderCode}/status`);
        const data = await res.json();
        if (data.status === 'COMPLETED') {
          const token = data.downloadToken || order.downloadToken || order.orderCode;
          setOrder((prev) => (prev ? { ...prev, downloadToken: token } : prev));
          setIsPaid(true);
          if (onSuccess) onSuccess();
          clearInterval(interval);
          setTimeout(() => {
            window.location.href = `/tai-ve/${token}`;
          }, 1500);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order, isPaid, onSuccess]);

  const handleCreateOrder = async (): Promise<any> => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        customerName: customerName || user?.name || 'Khách hàng',
        customerEmail: customerEmail || user?.email || 'khach@example.com',
        customerPhone: customerPhone || user?.phone || '0987000000',
        paymentMethod: activeTab,
      };

      if (isCart) {
        payload.items = activeItems.map((i) => ({ 
          productId: i.id, 
          slug: (i as any).slug, 
          price: i.price 
        }));
      } else if (product) {
        payload.productId = product.id;
      }

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        return data.order;
      }
      return null;
    } catch (err) {
      console.error('Error creating order:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleManualConfirm = async () => {
    setCheckingPayment(true);
    try {
      let currentOrder = order;
      if (!currentOrder) {
        currentOrder = await handleCreateOrder();
      }

      if (!currentOrder) {
        alert('Đang khởi tạo đơn hàng, vui lòng bấm lại sau 1 giây!');
        return;
      }

      const res = await fetch(`/api/orders/${currentOrder.orderCode}/confirm`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        const token = data.downloadToken || currentOrder.downloadToken || currentOrder.orderCode;
        setOrder((prev) => ({
          ...(prev || currentOrder),
          downloadToken: token,
        }));
        setIsPaid(true);
        if (onSuccess) onSuccess();

        // Tự động chuyển thẳng tới trang tải file
        setTimeout(() => {
          window.location.href = `/tai-ve/${token}`;
        }, 1200);
      } else {
        alert(data.error || 'Không thể xác nhận thanh toán demo');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi xác nhận thanh toán');
    } finally {
      setCheckingPayment(false);
    }
  };

  if (!isOpen) return null;

  const { bankName, bankAccountNo, bankAccountName, momoPhone } = useSettings();
  const bankConfig = {
    bankId: 'VCB',
    bankName: bankName || DEFAULT_BANK_CONFIG.bankName,
    accountNo: bankAccountNo || DEFAULT_BANK_CONFIG.accountNo,
    accountName: bankAccountName || DEFAULT_BANK_CONFIG.accountName,
    momoPhone: momoPhone || DEFAULT_BANK_CONFIG.momoPhone,
  };

  const orderCode = order ? order.orderCode : 'BV' + Math.floor(100000 + Math.random() * 900000);
  const vietQrUrl = getVietQRUrl(computedTotal, orderCode, bankConfig);
  const momoQrUrl = getMoMoQRUrl(computedTotal, orderCode, bankConfig.momoPhone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Thanh Toán Mua Bản Vẽ
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Mã đơn: <span className="text-orange-600 font-mono font-bold">{orderCode}</span>
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

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {!user ? (
            <div className="py-8 sm:py-10 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Vui Lòng Đăng Nhập Để Thanh Toán
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn cần đăng nhập tài khoản trước khi thanh toán để hệ thống tự động lưu trữ bản vẽ vào tài khoản của bạn và kích hoạt link tải vĩnh viễn.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openLoginModal('Vui lòng đăng nhập tài khoản trước khi mua bản vẽ!');
                  }}
                  className="inline-flex items-center px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                >
                  Đăng Nhập Ngay
                </button>
              </div>
            </div>
          ) : isPaid ? (
            <div className="py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-bounce">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-emerald-600">
                Xác Nhận Thanh Toán Thành Công!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Hệ thống đã xác nhận đơn hàng <strong>{order?.orderCode || orderCode}</strong>. Bản vẽ của bạn đã sẵn sàng để tải xuống.
              </p>
              <div className="text-xs font-semibold text-orange-600 animate-pulse">
                ⏳ Đang tự động chuyển hướng đến trang tải file...
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetToken = order?.downloadToken || order?.orderCode || orderCode;
                    window.location.href = `/tai-ve/${targetToken}`;
                  }}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Mở Trang Tải File Ngay
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product / Cart mini summary */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {isCart ? `Giỏ hàng gồm ${cartItems.length} bản vẽ kỹ thuật` : (product?.title || 'Hồ sơ bản vẽ')}
                  </h4>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                    {isCart
                      ? `${cartItems.map((i) => i.title).join(', ')}`
                      : `Định dạng: ${product?.formats || 'AutoCAD, 3D, JDpaint'}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-medium">Tổng thanh toán:</div>
                  <div className="text-sm sm:text-lg font-extrabold text-orange-600 font-mono">
                    {formatVND(computedTotal)}
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection Tabs */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phương Thức Thanh Toán:
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('VIETQR')}
                    className={`flex flex-col sm:flex-row items-center justify-center p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all ${
                      activeTab === 'VIETQR'
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 sm:mr-1.5 text-orange-600 mb-0.5 sm:mb-0" />
                    <span>VietQR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('MOMO')}
                    className={`flex flex-col sm:flex-row items-center justify-center p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all ${
                      activeTab === 'MOMO'
                        ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 sm:mr-1.5 text-pink-500 mb-0.5 sm:mb-0" />
                    <span>Ví MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('MANUAL')}
                    className={`flex flex-col sm:flex-row items-center justify-center p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all ${
                      activeTab === 'MANUAL'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 sm:mr-1.5 text-blue-500 mb-0.5 sm:mb-0" />
                    <span>Ngân Hàng</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: VietQR */}
              {activeTab === 'VIETQR' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-center p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-center flex flex-col items-center">
                    <div className="bg-white p-2 sm:p-2.5 rounded-xl shadow-md border border-slate-200 inline-block">
                      <img
                        src={vietQrUrl}
                        alt="VietQR Chuyển khoản"
                        className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
                      />
                    </div>
                    <div className="flex items-center text-[11px] sm:text-xs text-orange-600 mt-2 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Đang chờ hệ thống ghi nhận tiền...
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2 text-xs">
                    <div className="text-slate-700 font-bold pb-1 border-b border-slate-200">
                      Mở app Ngân hàng quét mã QR trên:
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-500">Ngân hàng:</span>
                        <strong className="text-slate-800">{bankConfig.bankName}</strong>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-500">Số tài khoản:</span>
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-orange-600 font-mono text-sm">{bankConfig.accountNo}</strong>
                          <button
                            onClick={() => copyToClipboard(bankConfig.accountNo, 'stk')}
                            className="text-slate-400 hover:text-orange-600 p-1"
                          >
                            {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-500">Chủ tài khoản:</span>
                        <strong className="text-slate-800">{bankConfig.accountName}</strong>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-100">
                        <span className="text-slate-500">Số tiền:</span>
                        <strong className="text-orange-600 font-mono text-sm">{formatVND(computedTotal)}</strong>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded bg-orange-50 border border-orange-200">
                        <span className="text-slate-700 font-bold">Nội dung CK:</span>
                        <div className="flex items-center space-x-1.5">
                          <strong className="text-orange-700 font-mono text-sm">{orderCode}</strong>
                          <button
                            onClick={() => copyToClipboard(orderCode, 'code')}
                            className="text-orange-600 hover:text-orange-800 p-1"
                          >
                            {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: MoMo */}
              {activeTab === 'MOMO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center p-4 rounded-xl bg-pink-50/50 border border-pink-200">
                  <div className="text-center flex flex-col items-center">
                    <div className="bg-white p-2.5 rounded-xl shadow-md border border-pink-200 inline-block">
                      <img
                        src={momoQrUrl}
                        alt="MoMo QR"
                        className="w-44 h-44 object-contain"
                      />
                    </div>
                    <span className="text-xs text-pink-600 mt-2 font-bold">
                      Quét bằng ứng dụng Ví MoMo
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-white border border-pink-100">
                      <span className="text-slate-500">Số điện thoại MoMo:</span>
                      <strong className="text-pink-600 font-mono text-sm">{bankConfig.momoPhone}</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-white border border-pink-100">
                      <span className="text-slate-500">Số tiền:</span>
                      <strong className="text-orange-600 font-mono text-sm">{formatVND(computedTotal)}</strong>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-white border border-pink-300">
                      <span className="text-slate-700 font-bold">Lời nhắn:</span>
                      <strong className="text-pink-700 font-mono text-sm">{orderCode}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Manual */}
              {activeTab === 'MANUAL' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <div className="text-slate-400">Ngân hàng:</div>
                      <div className="font-bold text-slate-800 mt-0.5">{bankConfig.bankName}</div>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <div className="text-slate-400">Chủ tài khoản:</div>
                      <div className="font-bold text-slate-800 mt-0.5">{bankConfig.accountName}</div>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-slate-400">Số tài khoản:</div>
                        <div className="font-bold text-orange-600 font-mono text-base">{bankConfig.accountNo}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bankConfig.accountNo, 'stkManual')}
                        className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold"
                      >
                        {copiedField === 'stkManual' ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded bg-orange-50 border border-orange-200 flex justify-between items-center">
                      <div>
                        <div className="text-orange-800 font-semibold">Nội dung CK:</div>
                        <div className="font-bold text-orange-600 font-mono text-base">{orderCode}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(orderCode, 'codeManual')}
                        className="px-2 py-1 rounded bg-orange-600 text-white font-semibold"
                      >
                        {copiedField === 'codeManual' ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleManualConfirm}
                  disabled={checkingPayment}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs transition flex items-center justify-center shadow-xs"
                  title="Dành cho kiểm thử/xem demo: Kích hoạt thành công tức thì không cần chuyển khoản thật"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  <span>⚡ Test Demo: Giả lập thanh toán</span>
                </button>

                <button
                  type="button"
                  onClick={handleManualConfirm}
                  disabled={checkingPayment}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center"
                >
                  {checkingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Tôi Đã Chuyển Khoản Xong
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}