'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">可持续发展</h1>
          <p className="text-gray-600">Sustainability</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <p className="text-xl text-gray-700 mb-8">
              Piccola 致力于可持续发展，将环保理念融入产品设计和生产的每一个环节。
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="font-bold mb-2">天然材料</h3>
                <p className="text-sm text-gray-600">使用天然、可再生的原材料</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-4">♻️</div>
                <h3 className="font-bold mb-2">环保生产</h3>
                <p className="text-sm text-gray-600">低碳排放的生产工艺</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="font-bold mb-2">长久耐用</h3>
                <p className="text-sm text-gray-600">产品寿命长达数十年</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">我们的承诺</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>使用天然、无毒的原材料</li>
              <li>优化生产工艺，减少能源消耗</li>
              <li>减少包装浪费，使用可回收材料</li>
              <li>支持公平贸易和工匠权益</li>
              <li>持续改进环保表现</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">产品认证</h2>
            <p className="text-gray-700 mb-4">
              我们的产品通过多项国际环保认证，确保符合最高的环保和安全标准。
            </p>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                🌱 选择 Piccola，选择可持续的生活方式
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
