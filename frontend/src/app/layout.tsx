import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/brand/Navbar';

export const metadata: Metadata = {
  title: 'Rio Banking | Reserve Premier Corporate & Wealth Platform',
  description: 'Enterprise Indian Banking Platform Prototype for Corporate Governance, KYC, and Treasury Operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </body>
    </html>
  );
}

