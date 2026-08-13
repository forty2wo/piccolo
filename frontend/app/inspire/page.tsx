import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InspireGrid from '@/components/InspireGrid'
import FloatingCTA from '@/components/FloatingCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inspire · 灵感图集 - Piccola',
  description: '真实空间里的瓷砖应用 · 按场景浏览意大利手工瓷砖灵感图集',
}

export default function InspirePage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />
      <InspireGrid />
      <Footer />
      <FloatingCTA />
    </main>
  )
}
