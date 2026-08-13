'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/brand-products'

export default function NewArrivalsPage() {
  // 取最新的产品（按 ID 倒序）
  const newArrivals = [...products].reverse().slice(0, 8)

  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">新品上市</h1>
          <p className="text-gray-600">New Arrivals</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="product-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
