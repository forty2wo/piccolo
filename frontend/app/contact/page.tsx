'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // TODO: 发送到后端 API
      console.log('Form submitted:', formData)
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      })
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">联系我们</h1>
          <p className="text-gray-600">Contact Us</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">联系方式</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">📍 地址</h3>
                  <p className="text-gray-600 text-sm md:text-base">上海市 [详细地址待补充]</p>
                  <p className="text-gray-600 text-sm md:text-base">[English address — TBD]</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">📞 电话</h3>
                  <p className="text-gray-600 text-sm md:text-base">+86 21 0000 0000</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">📧 邮箱</h3>
                  <p className="text-gray-600 text-sm md:text-base">hello@piccola.cn</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">🕐 营业时间</h3>
                  <p className="text-gray-600 text-sm md:text-base">周一至周五 9:00 - 18:00</p>
                  <p className="text-gray-600 text-sm md:text-base">Saturday & Sunday 10:00 - 17:00</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 md:mt-8 aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                  alt="Piccola showroom location"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">在线留言</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold mb-2">提交成功！</h3>
                  <p className="text-gray-600 mb-4">我们会尽快与您联系</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                  >
                    再次留言
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">姓名 *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="您的姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">邮箱 *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">电话</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="+86 ..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">公司</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="公司名称 (可选)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-2">留言 *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm md:text-base"
                      placeholder="请告诉我们您的需求..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '提交中...' : '提交留言'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
