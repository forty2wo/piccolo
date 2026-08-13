import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '物流配送 - Piccola',
  description: 'Piccola 物流配送说明',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
