'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">使用条款</h1>
          <p className="text-gray-600">Terms of Service</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-8">最后更新日期：2026 年 4 月 1 日</p>

            <h2 className="text-2xl font-bold mb-4">1. 接受条款</h2>
            <p className="text-gray-700 mb-4">
              通过使用 Piccola 网站和服务，您同意受本使用条款的约束。如果您不同意本条款，请不要使用我们的服务。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">2. 服务描述</h2>
            <p className="text-gray-700 mb-4">
              Piccola 提供高端手工瓷砖的在线销售服务。我们保留随时修改、暂停或终止服务的权利。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">3. 订单和付款</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>所有订单需经我们确认后方为有效</li>
              <li>价格如有变动，以订单确认时的价格为准</li>
              <li>我们接受多种支付方式</li>
              <li>订单确认后不可随意取消或修改</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">4. 配送和交付</h2>
            <p className="text-gray-700 mb-4">
              配送时间和费用详见《配送说明》。产品交付后，风险转移至买方。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">5. 退换货政策</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>未使用的产品可在签收后 7 天内申请退换</li>
              <li>定制产品不支持无理由退换</li>
              <li>退换货产生的运费由责任方承担</li>
              <li>详细政策详见《退换政策》</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">6. 知识产权</h2>
            <p className="text-gray-700 mb-4">
              本网站的所有内容（包括但不限于文字、图片、商标）均受知识产权保护，未经许可不得复制或使用。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">7. 免责声明</h2>
            <p className="text-gray-700 mb-4">
              我们尽力确保网站信息的准确性，但不保证所有信息完全准确、完整或最新。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">8. 联系我们</h2>
            <p className="text-gray-700">
              📧 Email: legal@piccola.cn<br/>
              📞 电话：400-000-0000
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
