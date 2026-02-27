import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Trello Clone',
  description: 'Trello Clone Description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
