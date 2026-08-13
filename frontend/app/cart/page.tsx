'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart, totalItems } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen mt-16 md:mt-20">
        <Header />
        <div className="container py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">选材单</h1>
          <p className="text-gray-500 mb-8">您的选材单是空的</p>
          <Link
            href="/collections"
            className="inline-block px-8 py-4 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition-colors"
          >
            浏览系列
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  if (checkingOut) {
    return (
      <main className="min-h-screen mt-16 md:mt-20">
        <Header />
        <div className="container py-16 text-center max-w-lg">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4">询价请求已提交</h1>
          <p className="text-gray-600 mb-2">您已选择 {totalItems} 个系列</p>
          <p className="text-gray-500 mb-8">我们的技术团队将尽快与您联系，提供专业报价和样品寄送服务</p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => { clearCart(); setCheckingOut(false) }}
              className="px-8 py-4 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition-colors"
            >
              继续浏览
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-200 text-[#1a1a1a] rounded-lg hover:border-gray-400 transition-colors"
            >
              联系我们
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />

      <div className="container py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">选材单</h1>
          <span className="text-sm text-gray-500">{totalItems} 个系列</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.collectionName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#1a1a1a] mb-0.5">{item.collectionName}</h3>
                  <p className="text-xs text-gray-500 mb-1">{item.collectionNameEn}</p>
                  <p className="text-xs text-[#8c8c8c]">{item.brand}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-50 text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border-x border-gray-200 text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      移除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border border-gray-100 rounded-lg p-6 h-fit sticky top-28">
            <h2 className="text-lg font-bold mb-4">询价摘要</h2>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">系列数量</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">样品数量</span>
                <span>{totalItems}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <p className="text-xs text-gray-500 leading-relaxed">
                提交后我们的技术团队将与您联系，确认具体规格、数量和交付时间，并提供专业报价。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCheckingOut(true)}
              className="w-full py-3.5 bg-[#1a1a1a] text-white font-medium rounded-lg hover:bg-[#333] transition-colors mb-3"
            >
              提交询价
            </button>
            <Link
              href="/collections"
              className="block w-full py-3.5 border border-gray-200 text-[#1a1a1a] font-medium rounded-lg hover:border-gray-400 transition-colors text-center"
            >
              继续浏览
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
