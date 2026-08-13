import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于 - Piccola',
  description: 'Piccola 致力于为全球消费者提供高品质的意大利手工瓷砖',
}

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-4 font-medium">
            About Us
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1c1c1c] tracking-wide mb-6">
            关于 Piccola
          </h1>
          <p className="text-[15px] text-[#4a4a4a] max-w-2xl mx-auto leading-relaxed">
            策展自意大利工坊的手工瓷砖品牌，致力于将百年工艺与当代设计美学相融合，
            为每一个空间注入时间的温度与匠人的巧思。
          </p>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <blockquote
              className="font-serif italic text-[#1c1c1c] pl-7"
              style={{
                fontSize: 'clamp(20px, 2.4vw, 28px)',
                lineHeight: 1.6,
                borderLeft: '3px solid #d4c5b0',
                letterSpacing: '0.01em',
              }}
            >
              &ldquo;每一片瓷砖都承载着匠人的心血与智慧，
              都应该成为空间中的艺术品。&rdquo;
              <footer className="mt-5 not-italic font-sans text-sm text-[#8a8a8a]" style={{ letterSpacing: '0.06em' }}>
                — Piccola 创始理念
              </footer>
            </blockquote>

            <div className="space-y-5 text-[15px] leading-[1.9] text-[#4a4a4a]">
              <p>
                Piccola 诞生于对意大利手工陶瓷传统的敬意。我们深入意大利北部的陶瓷小镇，
                与传承数代的工坊合作，精选那些兼具工艺品质与设计美感的瓷砖系列。
              </p>
              <p>
                我们相信，真正的品质藏在细节之中——釉面的微妙变化、边缘的手工痕迹、
                光线角度下呈现的不同色泽。这些工业化量产永远无法复制的温度感，
                正是 Piccola 存在的意义。
              </p>
              <p>
                从米兰到摩德纳，从法恩扎到维琴察，我们行走在意大利的陶瓷之路上，
                只为将最动人的手工瓷砖带给懂得欣赏的你。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 核心价值 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-4 font-medium">
              Our Values
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1c1c1c] tracking-wide">
              我们的理念
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: '匠心工艺',
                desc: '与意大利百年工坊合作，传承手工制瓷技艺，每一片都独一无二',
                icon: '🎨',
              },
              {
                title: '精选策展',
                desc: '从数十个意大利品牌中严格筛选，只呈现最具设计价值的系列',
                icon: '✨',
              },
              {
                title: '可持续',
                desc: '使用天然原材料，支持可持续生产方式，尊重环境与传统',
                icon: '🌿',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-8 md:p-10 bg-[#f7f4f0] rounded-[2px]"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-medium text-[#1c1c1c] mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#5a5a5a] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 合作品牌 */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-4 font-medium">
              Our Partners
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1c1c1c] tracking-wide">
              合作工坊
            </h2>
            <p className="mt-3 text-[14px] text-[#8a8a8a]">
              与意大利顶级陶瓷品牌深度合作
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['41zero42', 'Opificio Ceramico'].map((brand) => (
              <div
                key={brand}
                className="font-serif text-2xl md:text-3xl font-medium text-[#1c1c1c]/60 tracking-wider"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系 CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8">
          <div
            className="grid items-center text-white"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              background: '#1c1c1c',
              borderRadius: '2px',
              padding: '48px 52px',
            }}
          >
            <div>
              <h2
                className="font-serif text-[clamp(24px,3vw,36px)] font-medium tracking-tight mb-2.5 leading-tight"
              >
                想了解更多？
              </h2>
              <p className="text-white/60 text-sm leading-7 max-w-[400px]">
                欢迎联系我们的设计顾问，获取专业建议与样品支持。
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-9 py-3.5 bg-white text-[#1c1c1c] font-medium rounded-full hover:-translate-y-0.5 hover:bg-[#f0ebe5] transition-all duration-[450ms] ease-out hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
                style={{ fontSize: '13px', letterSpacing: '0.06em' }}
              >
                联系我们 →
              </a>
              <div className="text-white/50 text-sm space-y-2">
                <p>📧 hello@piccola.cn</p>
                <p>📍 上海 · 北京 · 深圳</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  )
}
