import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokéDex Explorer',
  description: 'Discover all 151 Kanto Pokémon with powerful search and filters!',
  icons: {
    icon: '/favicon.ico',
  },
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
