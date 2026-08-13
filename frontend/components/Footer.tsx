import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-12 md:py-12">
        <div
          className="grid gap-10 md:gap-10"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}
        >
          {/* 品牌介绍 */}
          <div>
            <div className="font-serif text-lg tracking-[0.1em] text-[#1c1c1c] mb-2">
              Piccola <span className="text-[#b8a088]">✦</span>
            </div>
            <p className="text-[13px] text-[#8a8a8a] max-w-[240px] leading-relaxed">
              策展自意大利工坊 · 手工瓷砖的艺术
            </p>
          </div>

          {/* 探索 */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-4 font-medium">
              探索
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/collections" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  系列
                </Link>
              </li>
              <li>
                <Link href="/inspire" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  灵感
                </Link>
              </li>
              <li>
                <Link href="/contact?intent=sample" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  申请样品
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-4 font-medium">
              支持
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  联系顾问
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  配送说明
                </Link>
              </li>
            </ul>
          </div>

          {/* 关于 */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-4 font-medium">
              Piccola
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  关于
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  可持续
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-[13px] text-[#4a4a4a] hover:text-[#1c1c1c] transition-colors">
                  媒体
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div
          className="mt-10 pt-6 border-t border-black/[0.06] flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
          <span className="text-[12px] text-[#8a8a8a]">
            &copy; {new Date().getFullYear()} Piccola · 策展自意大利工坊
          </span>
          <span className="text-[12px] text-[#8a8a8a]">
            <Link href="/privacy" className="hover:text-[#1c1c1c] transition-colors mr-5">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-[#1c1c1c] transition-colors">
              服务条款
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
