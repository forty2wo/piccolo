import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我们 - Piccola',
  description: '联系 Piccola 团队，获取产品报价、样品索取及专业设计咨询',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
