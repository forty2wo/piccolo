import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InspireGrid from '@/components/InspireGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inspire - Piccola',
  description: '探索意大利手工瓷砖的灵感图集，来自 41zero42 与 Opificio Ceramico',
}

export default function InspirePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <InspireGrid />
      <Footer />
    </main>
  )
}
