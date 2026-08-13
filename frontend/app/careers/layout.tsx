import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '招聘 - Piccola',
  description: '加入 Piccola 团队，与我们一起打造高端瓷砖品牌',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
