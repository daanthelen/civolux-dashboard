import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Civolux Dashboard',
  description: 'Dashboard met analytica voor bouwmaterialen',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='nl'>
      <body className={`${inter.className} flex items-center justify-center h-screen w-screen bg-gradient-to-br from-white to-[#41228E] text-black`}>{children}</body>
    </html>
  );
}
