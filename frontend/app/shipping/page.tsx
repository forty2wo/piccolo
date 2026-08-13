'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShippingPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">配送说明</h1>
          <p className="text-gray-600">Shipping Information</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold mb-4">配送范围</h2>
            <p className="text-gray-700 mb-4">
              我们目前支持中国大陆地区的配送服务。港澳台及海外地区暂未开通配送。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">配送时间</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>现货产品：下单后 3-5 个工作日发货</li>
              <li>定制产品：下单后 2-3 周发货</li>
              <li>偏远地区可能延长 1-3 个工作日</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">配送费用</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>订单满 ¥5000：免运费</li>
              <li>订单不满 ¥5000：运费 ¥200</li>
              <li>偏远地区（新疆、西藏、内蒙古等）：运费另议</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">送货上门</h2>
            <p className="text-gray-700 mb-4">
              瓷砖属于重物，我们提供送货上门服务。请确保收货地址有电梯或便于搬运的通道。
              如无电梯且楼层较高，可能需要额外支付搬运费。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">验货签收</h2>
            <p className="text-gray-700 mb-4">
              请在签收前仔细检查产品包装是否完好。如发现破损，请当场拍照并联系客服处理。
              签收后发现的问题，请在 24 小时内联系客服。
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                📞 如有任何配送问题，请联系客服：400-000-0000 或 hello@piccola.cn
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
