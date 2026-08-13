'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

const navItems = [
  { name: '系列', href: '/collections' },
  { name: '灵感', href: '/inspire' },
  { name: '关于', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, setIsOpen } = useCart()
  const pathname = usePathname()

  // 滚动时增加背景不透明度和阴影
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 判断当前激活导航
  const isActive = (href: string) => {
    if (href === '/collections') return pathname.startsWith('/collections') || pathname.startsWith('/products')
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f7f4f0]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-b border-black/[0.06]'
          : 'bg-[#f7f4f0]/70 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className="font-serif text-xl md:text-[22px] font-medium tracking-[0.12em] text-[#1c1c1c]"
            >
              Piccola
            </span>
            <span className="text-[#b8a088] ml-1 font-serif">✦</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-10" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-xs tracking-[0.15em] uppercase transition-colors py-1 ${
                  isActive(item.href)
                    ? 'text-[#1c1c1c]'
                    : 'text-[#4a4a4a] hover:text-[#1c1c1c]'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute left-0 right-0 -bottom-[4px] h-0.5 bg-[#b8a088] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-5">
            {/* 选材清单 */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-1 text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors"
              aria-label="选材清单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-[#b8a088] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors"
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

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden py-3 border-t border-black/[0.06]"
            aria-label="移动端导航"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-3 text-xs tracking-[0.15em] uppercase transition-colors ${
                  isActive(item.href) ? 'text-[#1c1c1c]' : 'text-[#4a4a4a]'
                }`}
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
