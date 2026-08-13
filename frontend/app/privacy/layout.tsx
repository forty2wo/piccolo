import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '隐私政策 - Piccola',
  description: 'Piccola 隐私政策',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
