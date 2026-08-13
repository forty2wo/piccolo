import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '媒体报道 - Piccola',
  description: 'Piccola 品牌动态与媒体报道',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
