'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/brand-products'

export default function BestsellersPage() {
  // 热销 = 图片数 >= 6 的 collection（高视觉投入 = 已验证的热门款）
  const bestsellers = [...products]
    .filter(p => p.images && p.images.length >= 6)
    .sort((a, b) => b.images.length - a.images.length)
    .slice(0, 8)

  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">热销产品</h1>
          <p className="text-gray-600">Bestsellers</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="product-grid">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
