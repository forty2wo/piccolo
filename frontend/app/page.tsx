'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturedCollections from '@/components/FeaturedCollections'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import FadeIn from '@/components/FadeIn'

function ConsultationBanner() {
  return (
    <section className="py-20 md:py-28 bg-[#f7f4f0]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        <div
          className="grid items-center gap-10 md:gap-12"
          style={{
            gridTemplateColumns: '1.5fr 1fr',
            background: '#1c1c1c',
            borderRadius: '2px',
            padding: '56px 60px',
          }}
        >
          {/* 左侧文案 */}
          <div className="max-w-xl">
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-4 font-medium"
              style={{ color: '#d4c5b0' }}
            >
              Personal Service
            </p>
            <h2
              className="font-serif font-medium text-white tracking-tight mb-5 leading-tight"
              style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}
            >
              为您的项目定制专属瓷砖方案
            </h2>
            <p className="text-white/60 text-[15px] leading-relaxed">
              从空间风格建议、样品寄送、到项目报价——我们的设计顾问为每个项目提供一对一的专属服务，
              帮你找到最契合的那一片砖。
            </p>
          </div>

          {/* 右侧 CTA 组 */}
          <div className="flex flex-col gap-4">
            <Link
              href="/contact?intent=quote"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1c1c1c] rounded-full text-xs tracking-[0.15em] uppercase font-medium hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all duration-[450ms] ease-out"
            >
              项目询价 →
            </Link>
            <Link
              href="/contact?intent=sample"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full text-xs tracking-[0.15em] uppercase hover:border-white/60 hover:bg-white/[0.05] transition-all duration-300"
            >
              申请样品
            </Link>
            <Link
              href="/collections"
              className="text-[12px] text-white/50 hover:text-white/80 tracking-wide transition-colors text-center"
            >
              先逛逛系列 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />
      <HeroSection />
      <FadeIn delay={100}>
        <FeaturedCollections />
      </FadeIn>
      <FadeIn delay={100}>
        <ConsultationBanner />
      </FadeIn>
      <Footer />
      <FloatingCTA />
    </main>
  )
}
