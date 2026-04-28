import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/provider';

export const metadata: Metadata = {
  title: 'Elsoft App',
  description: 'Elsoft Assessment - Muhamad Agung Gumelar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
