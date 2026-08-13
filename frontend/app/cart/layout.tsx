import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '购物车 - Piccola',
  description: '查看您的选材清单',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
