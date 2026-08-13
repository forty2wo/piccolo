import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '热销系列 - Piccola',
  description: 'Piccola 热销手工瓷砖系列精选',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
