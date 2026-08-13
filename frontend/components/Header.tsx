'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

// 导航顺序：系列（核心探索）→ 灵感（策展价值）→ 关于（身份）。
// 全部中文，保持平台感；不再出现“品牌 / Brand”入口。
const navItems = [
  { name: '系列', href: '/collections' },
  { name: '灵感', href: '/inspire' },
  { name: '关于', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-paper/95 backdrop-blur-sm border-b border-warm-line">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-xl md:text-2xl font-light tracking-[0.15em] text-primary">
            PICCOLA
          </Link>

          <nav className="hidden md:flex items-center space-x-10" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs tracking-[0.15em] uppercase text-primary-light hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* “选材清单”代替购物车：高端咨询驱动逻辑，不是电商购物车。
                图标从 shopping bag 改为 bookmark/swatch，以视觉语言告知这不是交易。 */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-1 text-primary-light hover:text-primary transition-colors"
              aria-label="选材清单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                {/* 书签/选片状 icon：明确不是购物袋。 */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-primary-light"
              aria-label="菜单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-xs tracking-[0.15em] uppercase text-primary-light hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
