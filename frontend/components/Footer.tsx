'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-warm-cream pt-16 pb-8 border-t border-warm-line">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-primary mb-4 font-medium">探索</h4>
            <ul className="space-y-2.5">
              {[
                { name: '系列', href: '/collections' },
                { name: '灵感', href: '/inspire' },
                { name: '申请样品', href: '/contact?intent=sample' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-primary-light hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-primary mb-4 font-medium">支持</h4>
            <ul className="space-y-2.5">
              {[
                { name: '联系顾问', href: '/contact' },
                { name: '常见问题', href: '/faq' },
                { name: '配送说明', href: '/shipping' },
                { name: '退换政策', href: '/returns' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-primary-light hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-primary mb-4 font-medium">Piccola</h4>
            <ul className="space-y-2.5">
              {[
                { name: '关于', href: '/about' },
                { name: '可持续', href: '/sustainability' },
                { name: '招贤', href: '/careers' },
                { name: '媒体', href: '/press' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-primary-light hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-warm-line">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-muted">© 2026 Piccola · 策展自意大利工坊</p>
            <div className="flex gap-6 text-xs text-primary-muted">
              <Link href="/privacy" className="hover:text-primary transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
