import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于 Piccola - 高端手工瓷砖品牌故事',
  description: 'Piccola - 意大利高端手工瓷砖品牌故事',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
