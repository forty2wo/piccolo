'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CareersPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">加入我们</h1>
          <p className="text-gray-600">Careers</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <p className="text-xl text-gray-700 mb-8">
              加入 Piccola 团队，一起创造美好的居住空间。
            </p>

            <h2 className="text-2xl font-bold mb-4">为什么选择 Piccola？</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-8">
              <li>有竞争力的薪酬和福利</li>
              <li>广阔的职业发展空间</li>
              <li>开放、包容的工作氛围</li>
              <li>与优秀的设计师和工匠共事</li>
              <li>参与有意义的可持续事业</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">开放职位</h2>
            
            <div className="border rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">销售顾问</h3>
              <p className="text-gray-600 mb-2">工作地点：上海/北京/深圳</p>
              <p className="text-gray-700 mb-4">
                负责客户咨询、产品销售和售后服务。需要有建材或家居行业经验，
                良好的沟通能力和服务意识。
              </p>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                申请职位
              </button>
            </div>

            <div className="border rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">室内设计师</h3>
              <p className="text-gray-600 mb-2">工作地点：上海</p>
              <p className="text-gray-700 mb-4">
                负责客户空间设计和瓷砖搭配方案。需要室内设计相关专业背景，
                熟练使用设计软件，有瓷砖或建材行业经验者优先。
              </p>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                申请职位
              </button>
            </div>

            <div className="border rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">电商运营</h3>
              <p className="text-gray-600 mb-2">工作地点：上海</p>
              <p className="text-gray-700 mb-4">
                负责电商平台运营、产品上架、订单处理等。需要有电商运营经验，
                熟悉主流电商平台，数据敏感度高。
              </p>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                申请职位
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">投递简历</h2>
            <p className="text-gray-700 mb-4">
              请将您的简历和作品集发送至：
            </p>
            <p className="text-lg font-medium text-primary mb-4">
              📧 careers@piccola.cn
            </p>
            <p className="text-gray-600">
              我们会在收到简历后 5 个工作日内与合适的候选人联系。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
