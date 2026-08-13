'use client';

import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* 购物车侧边栏 */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">选材清单</h2>
            <p className="text-sm text-gray-500 mt-1">{totalItems} 个系列</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭购物车"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 商品列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 mb-6">选材清单还是空的</p>
              <Link
                href="/collections"
                className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                去逛逛
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                  {/* 商品图片 */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.collectionName}
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  </div>

                  {/* 商品信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1a1a1a] truncate">{item.collectionName}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.collectionNameEn}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.brand}</p>

                    {/* 数量控制 */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="减少数量"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="增加数量"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="删除商品"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* 询价提示 */}
              <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                💡 温馨提示：提交选材清单后，我们的设计师团队会尽快与您联系，提供报价和样品
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                清空
              </button>
              <Link
                href="/contact"
                className="flex-1 px-6 py-3 bg-[#1a1a1a] text-white text-center rounded-lg hover:bg-[#4a4a4a] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                提交询价
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
