'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">隐私政策</h1>
          <p className="text-gray-600">Privacy Policy</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-8">最后更新日期：2026 年 4 月 1 日</p>

            <h2 className="text-2xl font-bold mb-4">1. 信息收集</h2>
            <p className="text-gray-700 mb-4">
              我们收集您在使用我们的服务时提供的信息，包括：
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>联系信息（姓名、电话、邮箱、地址）</li>
              <li>订单信息</li>
              <li>支付信息</li>
              <li>浏览和使用数据</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">2. 信息使用</h2>
            <p className="text-gray-700 mb-4">我们使用收集的信息用于：</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>处理和配送订单</li>
              <li>提供客户服务</li>
              <li>发送订单更新和促销信息</li>
              <li>改进我们的产品和服务</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">3. 信息保护</h2>
            <p className="text-gray-700 mb-4">
              我们采取合理的安全措施保护您的个人信息，防止未经授权的访问、使用或披露。
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">4. 信息共享</h2>
            <p className="text-gray-700 mb-4">
              我们不会向第三方出售、出租或交易您的个人信息。我们可能在以下情况下共享信息：
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>与配送服务商共享必要的配送信息</li>
              <li>与支付处理商共享支付信息</li>
              <li>法律要求的情况下</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">5. 您的权利</h2>
            <p className="text-gray-700 mb-4">您有权：</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>访问您的个人信息</li>
              <li>更正不准确的个人信息</li>
              <li>删除您的个人信息</li>
              <li>选择退出营销通讯</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">6. 联系我们</h2>
            <p className="text-gray-700 mb-4">
              如对本隐私政策有任何疑问，请联系我们：
            </p>
            <p className="text-gray-700">
              📧 Email: privacy@piccola.cn<br/>
              📞 电话：400-000-0000
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
