'use client'

import { useCart } from '@/lib/cart-context'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* 侧边栏 */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#f7f4f0] z-50 shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex flex-col"
        style={{ animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <style jsx global>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* 头部 */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-black/[0.06]">
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1c1c1c] tracking-wide">
              选材清单
            </h2>
            <p className="text-sm text-[#8a8a8a] mt-1">{totalItems} 个系列</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[#8a8a8a] hover:text-[#1c1c1c] transition-colors"
            aria-label="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-[#b8a088]" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </div>
              <p className="text-[#8a8a8a] mb-6">选材清单还是空的</p>
              <Link
                href="/collections"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] text-white rounded-full text-sm tracking-wide hover:bg-[#2a2a2a] transition-colors"
              >
                去逛逛 →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-[2px]">
                  {/* 图片 */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-[2px] overflow-hidden bg-[#f0ebe3]">
                    <Image
                      src={item.image}
                      alt={item.collectionName}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1c1c1c] truncate text-[15px]">
                      {item.collectionName}
                    </h3>
                    <p className="text-xs text-[#8a8a8a] truncate mt-0.5">
                      {item.collectionNameEn}
                    </p>
                    <p className="text-[11px] text-[#b8a088] tracking-wider uppercase mt-1">
                      {item.brand}
                    </p>

                    {/* 数量 */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-[#f7f4f0] border border-black/[0.06] rounded-full hover:bg-white transition-colors"
                        aria-label="减少"
                      >
                        <svg className="w-3.5 h-3.5 text-[#4a4a4a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-6 text-center text-sm text-[#1c1c1c]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-[#f7f4f0] border border-black/[0.06] rounded-full hover:bg-white transition-colors"
                        aria-label="增加"
                      >
                        <svg className="w-3.5 h-3.5 text-[#4a4a4a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 删除 */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-[#b8a088]/60 hover:text-[#b8a088] transition-colors self-start"
                    aria-label="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        {items.length > 0 && (
          <div className="border-t border-black/[0.06] p-6 md:p-8 space-y-4">
            {/* 提示 */}
            <div
              className="p-4 rounded-[2px]"
              style={{ background: 'rgba(184,160,136,0.08)' }}
            >
              <p className="text-[13px] text-[#5a4a3a] leading-relaxed">
                💡 提交选材清单后，我们的设计师团队会尽快与您联系，提供专属报价与样品支持。
              </p>
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 py-3 border border-black/[0.06] text-[#4a4a4a] rounded-full hover:bg-white transition-colors text-sm tracking-wide"
              >
                清空
              </button>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-[#1c1c1c] text-white text-center rounded-full hover:bg-[#2a2a2a] transition-colors text-sm tracking-wide"
              >
                提交询价
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
