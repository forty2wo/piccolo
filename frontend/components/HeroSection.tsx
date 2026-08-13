'use client'

import Link from 'next/link'
import Image from 'next/image'

const heroImage = '/images/41zero42-website/Kappa/cover/kappa-15.jpg'

export default function HeroSection() {
  return (
    <section className="bg-[#f7f4f0]">
      <div
        className="grid grid-cols-1 md:grid-cols-[55%_45%]"
        style={{ minHeight: '90vh' }}
      >
        {/* 左：大图 */}
        <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto order-1">
          <Image
            src={heroImage}
            alt="意大利手工瓷砖作品"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            className="object-cover"
            style={{
              animation: 'heroFade 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
          {/* 右边缘柔和过渡，衔接文字区 */}
          <div
            className="absolute inset-y-0 right-0 w-24 md:w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, #f7f4f0)',
            }}
          />
        </div>

        {/* 右：文字区 */}
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-16 md:py-0 order-2">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-5 font-medium">
            Piccola · 策展自意大利
          </p>

          <h1
            className="font-serif font-medium text-[#1c1c1c] tracking-wide leading-tight"
            style={{
              fontSize: 'clamp(28px, 4.2vw, 52px)',
              lineHeight: 1.15,
            }}
          >
            意大利手工瓷砖
            <br />
            当代空间艺术
          </h1>

          <p className="mt-6 text-[15px] text-[#4a4a4a] max-w-md leading-relaxed">
            精选自意大利工坊与设计系列的手工瓷砖，
            每一片都承载着匠人的心血与时间的温度。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {/* 主 CTA：探索系列 */}
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1c1c1c] text-white rounded-full text-xs tracking-[0.15em] uppercase hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all duration-[450ms] ease-out"
            >
              探索系列 →
            </Link>

            {/* 次 CTA：申请样品 */}
            <Link
              href="/contact?intent=sample"
              className="text-xs tracking-[0.15em] uppercase text-[#1c1c1c] border-b border-[#b8a088] pb-1 hover:text-[#b8a088] transition-colors duration-300"
            >
              申请样品
            </Link>
          </div>

          {/* 数据条 */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div
                className="font-serif text-[#1c1c1c] mb-1"
                style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
              >
                50+
              </div>
              <p className="text-[12px] text-[#8a8a8a] tracking-wide">精选系列</p>
            </div>
            <div>
              <div
                className="font-serif text-[#1c1c1c] mb-1"
                style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
              >
                12+
              </div>
              <p className="text-[12px] text-[#8a8a8a] tracking-wide">合作工坊</p>
            </div>
            <div>
              <div
                className="font-serif text-[#1c1c1c] mb-1"
                style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
              >
                100%
              </div>
              <p className="text-[12px] text-[#8a8a8a] tracking-wide">手工制作</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes heroFade {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
