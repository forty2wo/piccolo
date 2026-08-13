'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturedCollections from '@/components/FeaturedCollections'
import ConsultationCTA from '@/components/ConsultationCTA'
import Footer from '@/components/Footer'

function ConsultationBanner() {
  return (
    <section className="bg-warm-cream border-y border-warm-line">
      <div className="container px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-end">
          {/* 左侧文案区 */}
          <div className="max-w-2xl">
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent mb-3">
              Exclusive Service
            </p>
            <h3 className="text-2xl md:text-3xl font-display text-primary leading-tight mb-4">
              为您的项目定制专属方案
            </h3>
            <p className="text-sm md:text-[15px] text-primary-light leading-relaxed">
              样品寄送、设计咨询、项目报价——我们的顾问为每个项目单独跟进。
            </p>
          </div>

          {/* 右侧三级转化入口：主 / 次 / 轻量。
              主按钮是重动作（打开表单），次按钮是轻动作（跳转），三级链接是入门动作。 */}
          <div className="flex flex-col items-stretch md:items-end gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-warm-text transition-colors duration-300 whitespace-nowrap"
            >
              联系顾问
            </Link>
            <Link
              href="/contact?intent=catalog"
              className="inline-flex items-center justify-center md:justify-end px-1 py-2 text-xs tracking-[0.15em] uppercase text-primary border-b border-primary md:border-0 md:border-b md:border-primary hover:text-accent hover:border-accent transition-colors duration-300"
            >
              下载图册
            </Link>
            <Link
              href="/contact?intent=sample"
              className="inline-flex items-center justify-center md:justify-end px-1 py-1 text-[11px] tracking-[0.15em] uppercase text-primary-light hover:text-accent transition-colors duration-300"
            >
              申请样品 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <ConsultationBanner />
      <ConsultationCTA />
      <Footer />
    </main>
  )
}
