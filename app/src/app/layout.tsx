import type { Metadata } from 'next';
import { Sarabun, Inter } from 'next/font/google';
import './globals.css';
import DuskBackground from '@/components/layout/DuskBackground';
import AppHeader from '@/components/layout/AppHeader';

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'โอบ · Hug',
  description: 'พื้นที่ส่วนตัวสำหรับคืนที่เหนื่อย',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      data-theme="dark"
      data-font-scale="1"
      className={`${sarabun.variable} ${inter.variable}`}
    >
      <body>
        <DuskBackground />
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
