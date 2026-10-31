import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import CartDrawer from '@/components/cart/CartDrawer';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Rasoi Ansh — Handpicked Artisanal Indian Spices & Gourmet Masalas',
  description:
    'Experience pure, single-origin whole spices, stone-ground gourmet masalas, and commercial B2B spice supply from Rasoi Ansh. Handpicked from heritage Indian farms.',
  keywords: [
    'Rasoi Ansh',
    'Indian Spices',
    'Gourmet Masala',
    'Whole Spices',
    'Garam Masala',
    'B2B Spices',
    'Pure Turmeric',
    'Tellicherry Black Pepper',
  ],
  openGraph: {
    title: 'Rasoi Ansh — Handpicked Artisanal Indian Spices',
    description: 'Pure, single-origin Indian whole spices & heritage masala blends.',
    images: ['/Rasoi-Ansh-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#1C1B1A]">
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            <CartDrawer />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
