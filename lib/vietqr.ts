export interface BankConfig {
  bankId: string; // e.g. "VCB", "MB", "TCB", "ICB"
  bankName: string;
  accountNo: string;
  accountName: string;
  momoPhone?: string;
}

export const DEFAULT_BANK_CONFIG: BankConfig = {
  bankId: 'VCB',
  bankName: 'Vietcombank (Ngoại Thương VN)',
  accountNo: '9988776655',
  accountName: 'NGUYEN VAN QUAN TRI',
  momoPhone: '0987069242',
};

/**
 * Generate VietQR quicklink image url
 */
export function getVietQRUrl(amount: number, orderCode: string, config: BankConfig = DEFAULT_BANK_CONFIG): string {
  const cleanAccountNo = config.accountNo.replace(/\s+/g, '');
  const encodedContent = encodeURIComponent(orderCode);
  const encodedName = encodeURIComponent(config.accountName);
  return `https://img.vietqr.io/image/${config.bankId}-${cleanAccountNo}-compact2.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedName}`;
}

/**
 * Generate MoMo QR code url
 */
export function getMoMoQRUrl(amount: number, orderCode: string, phone: string = DEFAULT_BANK_CONFIG.momoPhone || '0987069242'): string {
  // Standard MoMo format string or transfer note
  const data = `2|99|${phone}|||0|0|${amount}|${orderCode}|transfer_myqr`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
}

/**
 * Format VNĐ currency
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}