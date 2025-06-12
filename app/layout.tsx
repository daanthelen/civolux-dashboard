import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maeconomy Dashboard',
  description: 'Dashboard met analytica voor bouwmaterialen Maeconomy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='nl'>
      <body className={`${inter.className} flex h-screen bg-gradient-to-br from-white to-[#41228E] text-black`}>{children}</body>
    </html>
  );
}
