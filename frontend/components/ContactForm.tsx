'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  intent: string
  message: string
}

const intents = [
  { id: 'sample', label: '申请样品' },
  { id: 'quote', label: '项目询价' },
  { id: 'design', label: '设计咨询' },
  { id: 'cooperation', label: '商务合作' },
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    intent: 'sample',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2px] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#b8a088]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#b8a088]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1c1c1c] mb-3">
            提交成功
          </h3>
          <p className="text-[14px] text-[#5a5a5a] mb-6">
            感谢您的留言，我们的顾问将在 24 小时内与您联系。
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[13px] text-[#b8a088] hover:underline"
          >
            返回表单
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="font-serif text-2xl font-medium text-[#1c1c1c] mb-6">
            给我们留言
          </h3>

          {/* 意向选择 */}
          <div>
            <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-3 block font-medium">
              咨询类型
            </label>
            <div className="flex flex-wrap gap-2">
              {intents.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, intent: intent.id }))}
                  className={`px-4 py-2 text-[12px] rounded-full border transition-all duration-300 ${
                    formData.intent === intent.id
                      ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                      : 'bg-transparent text-[#4a4a4a] border-black/[0.06] hover:border-[#b8a088]'
                  }`}
                >
                  {intent.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-2 block font-medium">
                姓名 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#f7f4f0] border border-transparent rounded-[2px] text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#b8a088] focus:bg-white transition-all placeholder:text-[#8a8a8a]"
                placeholder="您的姓名"
              />
            </div>
            <div>
              <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-2 block font-medium">
                电话
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-[#f7f4f0] border border-transparent rounded-[2px] text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#b8a088] focus:bg-white transition-all placeholder:text-[#8a8a8a]"
                placeholder="联系电话"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-2 block font-medium">
              邮箱 *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-[#f7f4f0] border border-transparent rounded-[2px] text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#b8a088] focus:bg-white transition-all placeholder:text-[#8a8a8a]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-2 block font-medium">
              公司 / 项目名称
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-3 bg-[#f7f4f0] border border-transparent rounded-[2px] text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#b8a088] focus:bg-white transition-all placeholder:text-[#8a8a8a]"
              placeholder="请填写公司或项目名称"
            />
          </div>

          <div>
            <label className="text-[12px] tracking-[0.08em] uppercase text-[#8a8a8a] mb-2 block font-medium">
              留言
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-[#f7f4f0] border border-transparent rounded-[2px] text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#b8a088] focus:bg-white transition-all placeholder:text-[#8a8a8a] resize-none"
              placeholder="请描述您的需求或问题..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-3.5 bg-[#1c1c1c] text-white font-medium rounded-full hover:bg-[#2a2a2a] transition-all duration-[450ms] ease-out disabled:opacity-50"
            style={{ fontSize: '13px', letterSpacing: '0.06em' }}
          >
            {submitting ? '提交中...' : '提交咨询'}
          </button>
        </form>
      )}
    </div>
  )
}
