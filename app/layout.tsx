import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Student E-Library',
    default: 'Student E-Library | Digital Book Reading & Shelf Platform',
  },
  description:
    'A modern full-stack digital library platform for students to discover, read, and track books with customizable shelves and interactive PDF reading.',
  keywords: ['student library', 'online reader', 'e-books', 'reading shelf', 'PDF reader'],
  authors: [{ name: 'Tarun Rawat' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Student E-Library | Digital Book Reading & Shelf Platform',
    description:
      'Read books distraction-free, organize your reading wishlist, and track your progress in real-time.',
    siteName: 'Student E-Library',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

