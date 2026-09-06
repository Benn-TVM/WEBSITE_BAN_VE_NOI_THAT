import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppLayout from '@/components/AppLayout';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Bản Vẽ Mỹ Nghệ & Kiến Trúc – Thư Viện File AutoCAD, JDpaint, 3D',
  description: 'Thư viện chuyên biệt bản vẽ kỹ thuật Cổng đá, Lăng mộ, Lan can, Phù điêu, Hoa văn CNC, Vách ngăn và Trang trí. Thanh toán QR tải file tức thì.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#f4f6fa] text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}