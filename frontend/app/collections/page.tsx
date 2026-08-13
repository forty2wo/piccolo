import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CollectionsGrid from '@/components/CollectionsGrid'
import FloatingCTA from '@/components/FloatingCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections - Piccola',
  description: '浏览全部意大利手工瓷砖系列，来自 41zero42 与 Opificio Ceramico',
}

export default function CollectionsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f4f0]">
      <Header />
      <Suspense fallback={<div className="p-8 text-center">加载中...</div>}>
        <CollectionsGrid />
      </Suspense>
      <Footer />
      <FloatingCTA />
    </main>
  )
}
