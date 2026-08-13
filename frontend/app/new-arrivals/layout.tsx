import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '新品上市 - Piccola',
  description: 'Piccola 最新手工瓷砖系列',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
