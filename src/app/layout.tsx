import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import Layout from '@/components/templates/Layout';
import '@/styles/globals.css';
import { classNames } from '@/utils/classNames';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WFH Management',
  description: '-',
};

const HIDE_ROUTES = '/';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          `${geistSans.variable}`,
          `${geistMono.variable}`,
          'antialiased'
        )}
      >
        <ReactQueryProvider>
          <Layout hiddenRoutes={[HIDE_ROUTES]}>{children}</Layout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
