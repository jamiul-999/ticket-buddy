import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'globals';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ticket buddy',
  description: 'Your friend to book bus tickets easily across Bangladesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}