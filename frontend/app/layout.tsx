import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import CartSidebar from '@/components/CartSidebar'
import ConsultationCTA from '@/components/ConsultationCTA'

export const metadata: Metadata = {
  title: 'Piccola | 高端手工瓷砖',
  description: 'Premium handmade tiles for discerning spaces. Zellige, Cement, Brick, Terracotta and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <CartSidebar />
          <ConsultationCTA />
        </CartProvider>
      </body>
    </html>
  )
}
