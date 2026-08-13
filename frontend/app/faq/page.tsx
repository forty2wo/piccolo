'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'

const faqs = [
  {
    question: '瓷砖的交货周期是多久？',
    answer: '现货产品 3-5 个工作日发货，意大利直邮产品需要 2-3 周。具体交货时间请咨询顾问。',
    category: '物流配送',
  },
  {
    question: '是否提供样品？',
    answer: '是的，我们提供付费样品服务。样品费用可在后续订单中全额抵扣。每个系列最多可申请 3 片样品。',
    category: '样品服务',
  },
  {
    question: '运费如何计算？',
    answer: '订单满 5000 元免运费，不满 5000 元收取 200 元运费。偏远地区可能产生额外费用。',
    category: '物流配送',
  },
  {
    question: '手工瓷砖如何保养？',
    answer: '定期用清水或中性清洁剂擦拭即可。避免使用酸性或碱性强的清洁剂，以免损伤釉面。建议铺贴后做一次专业防护。',
    category: '产品使用',
  },
  {
    question: '支持退换货吗？',
    answer: '支持 7 天无理由退换货，但需保证产品未使用且包装完好。定制产品不支持退换。',
    category: '售后政策',
  },
  {
    question: '是否提供铺贴指导？',
    answer: '我们提供免费的铺贴指导服务，可在线咨询或预约上门指导。对于商业项目，我们还提供专属项目顾问。',
    category: '服务支持',
  },
  {
    question: '最小起订量是多少？',
    answer: '现货产品无最小起订量限制，定制产品最小起订量为 50㎡。具体请咨询顾问。',
    category: '订货须知',
  },
  {
    question: '如何支付？',
    answer: '我们支持支付宝、微信支付、银行转账等多种支付方式。大项目可协商分期付款方案。',
    category: '订货须知',
  },
]

const categories = ['全部', '物流配送', '样品服务', '产品使用', '售后政策', '服务支持', '订货须知']

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredFaqs = activeCategory === '全部'
    ? faqs
    : faqs.filter(f => f.category === activeCategory)

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-[900px] mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] mb-4 font-medium">
            FAQ
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1c1c1c] tracking-wide mb-6">
            常见问题
          </h1>
          <p className="text-[15px] text-[#4a4a4a] max-w-xl mx-auto leading-relaxed">
            关于产品、配送、售后等常见问题，在这里或许能找到答案。
          </p>
        </div>
      </section>

      {/* FAQ 列表 */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[840px] mx-auto px-6 md:px-8">
          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setOpenIndex(0)
                }}
                className={`px-4 py-2 text-[12px] rounded-full border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                    : 'bg-transparent text-[#4a4a4a] border-black/[0.06] hover:border-[#b8a088]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 手风琴 */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-[2px] border border-black/[0.04] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#faf7f3] transition-colors"
                >
                  <span className="font-medium text-[15px] text-[#1c1c1c] pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === i ? 'bg-[#b8a088] text-white rotate-45' : 'bg-[#f0ebe3] text-[#8a8a8a]'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-[14px] text-[#5a5a5a] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部 CTA */}
          <div className="mt-14 text-center">
            <p className="text-[#5a5a5a] mb-5 text-[15px]">
              没有找到答案？
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1c1c1c] text-white rounded-full text-xs tracking-[0.15em] uppercase hover:-translate-y-0.5 hover:bg-[#2a2a2a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all duration-[450ms] ease-out"
            >
              联系顾问 →
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  )
}
