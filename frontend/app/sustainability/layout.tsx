import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '可持续发展 - Piccola',
  description: 'Piccola 可持续发展理念与实践',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
