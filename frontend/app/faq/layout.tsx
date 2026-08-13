import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '常见问题 - Piccola',
  description: '瓷砖选购、配送、售后常见问题解答',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
