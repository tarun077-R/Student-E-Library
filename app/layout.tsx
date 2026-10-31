import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';

export const metadata: Metadata = {
  title: {
    template: '%s | Library',
    default: 'Library — Digital Reading & Knowledge Hub',
  },
  description:
    'A professional desktop digital library to discover, read, and track books with customizable shelves, reading analytics, and interactive reader.',
  keywords: ['digital library', 'online reader', 'e-books', 'reading shelf', 'PDF reader'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0e131f] text-slate-100 min-h-screen antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <AppSidebar />
            <AppHeader />
            <main className="md:pl-60 flex-1 flex flex-col">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
