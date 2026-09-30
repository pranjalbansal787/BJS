import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jewellery Palace BJS',
    template: '%s · Jewellery Palace BJS',
  },
  description:
    'Goldsmiths in Gurugram since 1974. Hallmarked bridal sets, necklaces, bangles, earrings and rings, with weights on the invoice.',
  openGraph: {
    title: 'Jewellery Palace BJS',
    description: 'Goldsmiths in Gurugram since 1974. Hallmarked gold, weights on the invoice.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Cinzel:wght@500;600;700&family=Jost:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
