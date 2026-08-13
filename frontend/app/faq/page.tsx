'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const faqs = [
  {
    question: '瓷砖的交货周期是多久？',
    answer: '现货产品 3-5 个工作日发货，定制产品需要 2-3 周。具体交货时间请咨询客服。',
  },
  {
    question: '是否提供样品？',
    answer: '是的，我们提供付费样品服务。样品费用可在后续订单中抵扣。',
  },
  {
    question: '运费如何计算？',
    answer: '订单满 5000 元免运费，不满 5000 元收取 200 元运费。偏远地区可能产生额外费用。',
  },
  {
    question: '如何保养瓷砖？',
    answer: '定期用清水或中性清洁剂擦拭即可。避免使用酸性或碱性强的清洁剂。',
  },
  {
    question: '支持退换货吗？',
    answer: '支持 7 天无理由退换货，但需保证产品未使用且包装完好。定制产品不支持退换。',
  },
  {
    question: '是否提供铺贴指导？',
    answer: '我们提供免费的铺贴指导服务，可在线咨询或预约上门指导。',
  },
  {
    question: '最小起订量是多少？',
    answer: '现货产品无最小起订量限制，定制产品最小起订量为 50㎡。',
  },
  {
    question: '如何支付？',
    answer: '我们支持支付宝、微信支付、银行转账等多种支付方式。',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">常见问题</h1>
          <p className="text-gray-600">FAQ</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className="text-2xl ml-4">{openIndex === i ? '−' : '+'}</span>
                </button>
                {openIndex === i && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">没有找到答案？</p>
            <a href="/contact" className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-light">
              联系我们
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
