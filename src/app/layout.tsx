import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Richezza Mega Value - Billing & Payroll System',
  description: 'Complete billing, payroll, and attendance management system for Richezza Mega Value, a subsidiary of THE RICHHDAD GROUP.',
  keywords: 'billing, payroll, attendance, HR, invoice, business management',
  authors: [{ name: 'THE RICHHDAD GROUP' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}