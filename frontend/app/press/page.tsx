'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PressPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">媒体报道</h1>
          <p className="text-gray-600">Press & Media</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <p className="text-gray-700 mb-8">
              Piccola 受到众多知名媒体和设计平台的关注与报道。
            </p>

            <h2 className="text-2xl font-bold mb-4">媒体报道</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-6">
                <p className="text-sm text-gray-500 mb-2">2026 年 3 月</p>
                <h3 className="text-xl font-bold mb-2">
                  <a href="#" className="hover:text-accent">手工瓷砖的复兴：Piccola 如何将传统工艺带入现代家居</a>
                </h3>
                <p className="text-gray-600">《家居廊》杂志专题报道</p>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm text-gray-500 mb-2">2026 年 2 月</p>
                <h3 className="text-xl font-bold mb-2">
                  <a href="#" className="hover:text-accent">可持续建材趋势：专访 Piccola 创始人</a>
                </h3>
                <p className="text-gray-600">《安邸 AD》杂志</p>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm text-gray-500 mb-2">2026 年 1 月</p>
                <h3 className="text-xl font-bold mb-2">
                  <a href="#" className="hover:text-accent">2026 年家居设计趋势：手工瓷砖成热门选择</a>
                </h3>
                <p className="text-gray-600">《ELLE DECORATION》</p>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm text-gray-500 mb-2">2025 年 12 月</p>
                <h3 className="text-xl font-bold mb-2">
                  <a href="#" className="hover:text-accent">Piccola 上线：高端瓷砖电商新势力</a>
                </h3>
                <p className="text-gray-600">《36 氪》商业报道</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">媒体联系</h2>
            <p className="text-gray-700 mb-4">
              如需媒体资料、采访安排或合作事宜，请联系：
            </p>
            <p className="text-gray-700">
              📧 Email: press@piccola.cn<br/>
              📞 电话：400-000-0000
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
