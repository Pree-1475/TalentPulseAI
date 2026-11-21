import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'TalentPulse AI — Skill Demand Monitor',
  description: 'AI-Powered Job Market Skill Demand Monitoring Platform for HR & Workforce Planning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
