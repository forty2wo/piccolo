'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">退换政策</h1>
          <p className="text-gray-600">Return & Exchange Policy</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold mb-4">7 天无理由退换</h2>
            <p className="text-gray-700 mb-4">
              我们提供 7 天无理由退换服务，自您签收产品之日起计算。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">退换条件</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>产品未使用、未铺贴</li>
              <li>原包装完好</li>
              <li>配件、说明书等齐全</li>
              <li>提供有效购买凭证</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">不支持退换的情况</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>定制产品（特殊尺寸、颜色等）</li>
              <li>已铺贴或使用过的产品</li>
              <li>包装破损影响二次销售</li>
              <li>超过 7 天退换期</li>
              <li>因客户原因导致的损坏</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">质量问题</h2>
            <p className="text-gray-700 mb-4">
              如产品存在质量问题（如破损、色差严重等），请在签收后 24 小时内联系客服，
              并提供清晰的照片或视频证据。经确认后，我们将承担往返运费为您办理退换。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">退换流程</h2>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>联系客服申请退换（400-000-0000 或 hello@piccola.cn）</li>
              <li>客服审核通过后提供退货地址</li>
              <li>您将产品寄回（建议购买运输保险）</li>
              <li>我们收到并检查产品</li>
              <li>办理退款或换货</li>
            </ol>

            <h2 className="text-2xl font-bold mb-4 mt-8">退款时间</h2>
            <p className="text-gray-700 mb-4">
              退款将在我们收到并确认退回产品后的 5-7 个工作日内原路退回。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">运费承担</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>质量问题：我们承担往返运费</li>
              <li>无理由退换：客户承担往返运费</li>
              <li>换货：我们承担寄出运费，客户承担寄回运费</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                📞 退换咨询请联系客服：400-000-0000 或 <Link href="/contact" className="underline">联系我们</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
