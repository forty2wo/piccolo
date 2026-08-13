import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import CartSidebar from '@/components/CartSidebar'
import BackToTop from '@/components/BackToTop'

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
        {/* Skip to content — 屏幕阅读器/键盘导航 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-[#1c1c1c] focus:rounded focus:shadow-lg focus:text-sm"
        >
          跳转到主要内容
        </a>
        <CartProvider>
          {children}
          <CartSidebar />
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  )
}
