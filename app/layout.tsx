import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hint-Only Tutor',
  description: 'Contest math tutor that only gives safe next-step hints.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
