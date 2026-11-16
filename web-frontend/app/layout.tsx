import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Farmer Marketplace | Direct Farm-to-Buyer Platform',
  description: 'Eliminate middlemen with agent physical verification and machine learning agricultural price forecasting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
