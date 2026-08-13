'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">关于我们</h1>
          <p className="text-gray-600">About Piccola</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="text-2xl font-bold mb-4">品牌故事</h2>
              <p className="text-gray-700 mb-6">
                Piccola 致力于为全球消费者提供高品质的手工瓷砖。我们相信，每一片瓷砖都承载着匠人的心血与智慧，
                都应该成为空间中的艺术品。
              </p>
              <p className="text-gray-700 mb-6">
                Piccola is dedicated to providing high-quality handmade tiles to consumers worldwide. 
                We believe that every tile carries the craftsmanship and wisdom of artisans, 
                and should become a work of art in space.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">我们的理念</h2>
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="font-bold mb-2">匠心工艺</h3>
                  <p className="text-sm text-gray-600">传承百年手工技艺</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="font-bold mb-2">环保可持续</h3>
                  <p className="text-sm text-gray-600">使用天然环保材料</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-bold mb-2">独特设计</h3>
                  <p className="text-sm text-gray-600">每一片都独一无二</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4 mt-8">联系方式</h2>
              <p className="text-gray-700">
                如有任何疑问或合作意向，请随时联系我们：
                <br />
                📧 hello@piccola.cn
                <br />
                📞 +86 21 0000 0000
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
