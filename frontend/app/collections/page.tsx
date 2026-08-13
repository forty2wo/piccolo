import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CollectionsGrid from '@/components/CollectionsGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections - Piccola',
  description: '浏览全部 47 个意大利手工瓷砖系列，来自 41zero42 与 Opificio Ceramico',
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <CollectionsGrid />
      <Footer />
    </main>
  )
}
