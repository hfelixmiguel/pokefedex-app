import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'PokéDex Explorer - Discover All 151 Kanto Pokémon',
    template: '%s | PokéDex Explorer',
  },
  description: 'Discover all 151 Kanto Pokémon with powerful search and filters. Explore sprites, stats, types, and more in this interactive Pokédex application built with Next.js.',
  keywords: ['Pokémon', 'Pokedex', 'Next.js', 'TypeScript', 'React'],
  authors: [{ name: 'hfelixmiguel' }],
  openGraph: {
    title: 'PokéDex Explorer - Discover All 151 Kanto Pokémon',
    description: 'Discover all 151 Kanto Pokémon with powerful search and filters. Explore sprites, stats, types, and more.',
    url: 'https://pokefedex-app.vercel.app',
    siteName: 'PokéDex Explorer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PokéDex Explorer',
    description: 'Discover all 151 Kanto Pokémon with powerful search and filters!',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
