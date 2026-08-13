import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我们 - Piccola',
  description: '联系 Piccola 设计顾问，获取专业建议与样品支持',
}

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-4 font-medium">
            Contact
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1c1c1c] tracking-wide mb-6">
            联系我们
          </h1>
          <p className="text-[15px] text-[#4a4a4a] max-w-xl mx-auto leading-relaxed">
            我们的设计顾问将在 24 小时内与您取得联系，为您提供专业建议与样品支持。
          </p>
        </div>
      </section>

      {/* 主体：左信息 + 右表单 */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8">
          <div
            className="grid gap-8 md:gap-12"
            style={{ gridTemplateColumns: '1fr 1.5fr' }}
          >
            {/* 左侧：联系信息 */}
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1c1c1c] mb-6">
                  联系方式
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="text-[#b8a088] mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[13px] text-[#8a8a8a] mb-1">邮箱</p>
                      <p className="text-[15px] text-[#1c1c1c]">hello@piccola.cn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-[#b8a088] mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.27.526-.733.416-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[13px] text-[#8a8a8a] mb-1">电话</p>
                      <p className="text-[15px] text-[#1c1c1c]">400-000-0000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-[#b8a088] mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[13px] text-[#8a8a8a] mb-1">展厅</p>
                      <p className="text-[15px] text-[#1c1c1c]">上海 · 北京 · 深圳</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 工作时间 */}
              <div className="p-6 bg-white rounded-[2px]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-3 font-medium">
                  工作时间
                </p>
                <p className="text-[14px] text-[#1c1c1c] mb-1">周一至周五</p>
                <p className="text-[14px] text-[#5a5a5a]">09:00 - 18:00</p>
                <p className="text-[13px] text-[#8a8a8a] mt-3">
                  周末及节假日请提前预约
                </p>
              </div>
            </div>

            {/* 右侧：表单 */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  )
}
