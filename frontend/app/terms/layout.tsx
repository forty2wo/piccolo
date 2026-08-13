import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服务条款 - Piccola',
  description: 'Piccola 服务条款',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
