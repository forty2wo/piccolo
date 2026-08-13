import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '瓷砖知识 - Piccola',
  description: '选材指南、工艺解析与设计灵感',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
