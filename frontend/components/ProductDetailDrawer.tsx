'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { OpificioCollection, FlatImage, getOpificioCollection, flattenImages } from '@/lib/opificio-collections'
import { products, normalizeBrand, getProductByCollection } from '@/lib/brand-products'
import { adaptZero42Product } from '@/lib/opificio-collections'

interface ProductDetailDrawerProps {
  /** 从 URL router 解析的参数: brand + collection */
  brand: string
  collection: string
  /** 关闭抽屉回调 */
  onClose: () => void
}

/**
 * 全屏抽屉式详情页
 *
 * 从列表页点击 tile 时原地展开, 不跳转页面.
 * 关闭时列表页滚动位置完全不动.
 *
 * 内容复用 OpificioDetail 的模板, 但去掉了 <main> 和 <Header>/<Footer>,
 * 加上了关闭按钮和顶部导航.
 */
export default function ProductDetailDrawer({ brand, collection: collectionId, onClose }: ProductDetailDrawerProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const decodedCollectionId = decodeURIComponent(collectionId)

  // 获取 collection 数据
  const opificioCollection = normalizeBrand(brand) === 'opificio-ceramico'
    ? getOpificioCollection(decodedCollectionId)
    : undefined

  const zero42Product = !opificioCollection
    ? getProductByCollection(brand, decodedCollectionId)
    : undefined

  const collection = opificioCollection
    || (zero42Product ? adaptZero42Product(zero42Product) : undefined)

  const sourceBrand = opificioCollection ? 'opificio' as const : '41zero42' as const

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // 锁定背景滚动: 打开时禁止 body 滚动, 关闭时恢复.
  // 用 position:fixed 而非 overflow:hidden 避免 html 重排导致滚动位置丢失.
  useEffect(() => {
    const scrollY = window.scrollY
    const body = document.body
    const prevPosition = body.style.position
    const prevTop = body.style.top
    const prevWidth = body.style.width
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    return () => {
      body.style.position = prevPosition
      body.style.top = prevTop
      body.style.width = prevWidth
      // 恢复滚动位置时不触发动画
      window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior })
    }
  }, [])

  if (!collection) {
    return (
      <div className="fixed inset-0 z-50 bg-warm-paper flex items-center justify-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-sm text-primary-muted hover:text-primary">
          关闭 ✕
        </button>
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-lg text-primary-light">系列未找到</p>
          <button onClick={onClose} className="mt-4 text-sm text-accent underline">返回列表</button>
        </div>
      </div>
    )
  }

  return <DetailContent collection={collection} sourceBrand={sourceBrand} onClose={onClose} />
}

function DetailContent({
  collection,
  sourceBrand,
  onClose,
}: {
  collection: OpificioCollection
  sourceBrand: 'opificio' | '41zero42'
  onClose: () => void
}) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [lightbox, setLightbox] = useState<FlatImage | null>(null)

  const { hero, lifestyle, variant, detail } = flattenImages(collection)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({
      id: `${sourceBrand}-${collection.id}`,
      collectionId: collection.id,
      collectionName: collection.name,
      collectionNameEn: collection.name,
      image: hero?.url || '',
      brand: sourceBrand,
    })
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8f5] text-[#1a1a1a] overflow-y-auto">
      {/* 顶部关闭栏 */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 h-14 bg-[#faf8f5]/90 backdrop-blur-sm border-b border-black/5">
        <span className="text-xs tracking-[0.2em] uppercase text-primary-muted">
          {collection.name}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-primary-light hover:text-primary transition-colors"
        >
          <span>关闭</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ===== 1. Hero ===== */}
      {hero && (
        <section className="relative h-[60vh] md:h-[80vh] min-h-[480px] overflow-hidden">
          <Image
            src={hero.url}
            alt={collection.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
            <div className="max-w-4xl">
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase mb-4 font-light">Collection</p>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-3 leading-none">{collection.name}</h1>
              {collection.nameCn && (
                <p className="text-white/80 text-lg md:text-xl font-light tracking-widest mb-8">{collection.nameCn}</p>
              )}
              {collection.designer && (
                <p className="text-white/60 text-sm tracking-wide">{collection.designer}</p>
              )}
              <p className="mt-4 text-white/40 text-[11px] tracking-[0.15em] uppercase">Made in Italy</p>
            </div>
          </div>
        </section>
      )}

      {/* ===== 2. Concept ===== */}
      {collection.designConcept && (
        <section className="py-20 md:py-28 px-6 md:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-8">The Concept</p>
            <blockquote className="font-serif text-xl md:text-3xl leading-relaxed text-[#1a1a1a] italic">
              &ldquo;{collection.designConcept}&rdquo;
            </blockquote>
            {collection.designer && (
              <p className="mt-8 text-sm text-[#5a5a5a] tracking-wide">— {collection.designer}</p>
            )}
          </div>
        </section>
      )}

      {/* ===== 3. Variant 色卡 ===== */}
      {variant.length > 0 && (
        <section className="py-12 md:py-20 px-6 md:px-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-3">Color Palette</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a]">色彩变体</h2>
              <p className="mt-3 text-sm text-[#5a5a5a]">{variant.length} 种色彩 · 点击查看大图</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {variant.map((v, i) => (
                <button key={i} onClick={() => setLightbox(v)} className="group text-left">
                  <div className="aspect-square overflow-hidden bg-[#f0ebe3] mb-3">
                    <Image
                      src={v.url}
                      alt={v.label || `${collection.name} ${i + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {v.label && (
                    <p className="text-xs text-[#1a1a1a] leading-tight group-hover:text-[#8a7a5a] transition-colors">
                      {v.label}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 4. Lifestyle 故事板 ===== */}
      {lifestyle.length > 0 && (
        <section className="py-12 md:py-20 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-3">In Space</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a]">空间故事</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {lifestyle.slice(0, 2).map((img, i) => (
                <div key={i} className={`relative overflow-hidden bg-[#f0ebe3] ${i === 0 ? 'md:col-span-7 aspect-[4/3]' : 'md:col-span-5 aspect-[4/3]'}`}>
                  <Image src={img.url} alt={collection.name} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 60vw" />
                </div>
              ))}
              {lifestyle.slice(2, 5).map((img, i) => (
                <div key={i + 2} className="relative overflow-hidden bg-[#f0ebe3] md:col-span-4 aspect-[4/5]">
                  <Image src={img.url} alt={collection.name} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
              {lifestyle.slice(5).map((img, i) => (
                <div key={i + 5} className="relative overflow-hidden bg-[#f0ebe3] md:col-span-4 aspect-square">
                  <Image src={img.url} alt={collection.name} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 5. Detail 单品图 ===== */}
      {detail.length > 0 && (
        <section className="py-12 md:py-20 px-6 md:px-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-6">Product Detail</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {detail.map((img, i) => (
                <button key={i} onClick={() => setLightbox(img)} className="relative aspect-square overflow-hidden bg-[#f0ebe3] group">
                  <Image src={img.url} alt={collection.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 6. Specs + CTA ===== */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">Specifications</p>
              <h2 className="font-serif text-4xl mb-12">技术规格</h2>
              <dl className="space-y-6 text-sm">
                {collection.technology && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">工艺</dt>
                    <dd className="flex-1 text-white">{collection.technology}</dd>
                  </div>
                )}
                {collection.thickness && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">厚度</dt>
                    <dd className="flex-1 text-white">{collection.thickness}</dd>
                  </div>
                )}
                {collection.finishes.length > 0 && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">表面处理</dt>
                    <dd className="flex-1 text-white">{collection.finishes.join(' · ')}</dd>
                  </div>
                )}
                {collection.applications.length > 0 && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">应用</dt>
                    <dd className="flex-1 text-white">{collection.applications.join(' · ')}</dd>
                  </div>
                )}
                {collection.style.length > 0 && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">风格</dt>
                    <dd className="flex-1 text-white">{collection.style.join(' · ')}</dd>
                  </div>
                )}
                {collection.size && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">尺寸</dt>
                    <dd className="flex-1 text-white">{collection.size}</dd>
                  </div>
                )}
                {collection.sizes && collection.sizes.length > 0 && (
                  <div className="flex border-b border-white/10 pb-4">
                    <dt className="w-1/3 text-white/50">尺寸</dt>
                    <dd className="flex-1 text-white">{collection.sizes.join(' · ')}</dd>
                  </div>
                )}
                <div className="flex border-b border-white/10 pb-4">
                  <dt className="w-1/3 text-white/50">产地</dt>
                  <dd className="flex-1 text-white">意大利</dd>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <dt className="w-1/3 text-white/50">Factory</dt>
                  <dd className="flex-1 text-white/70 text-xs tracking-wide">
                    {sourceBrand === 'opificio' ? 'Opificio Ceramico' : '41zero42'} · Italy
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">心仪此系列？</h2>
              <p className="text-white/70 leading-relaxed mb-10 max-w-md">
                将系列加入询价清单，我们的设计师团队将为您提供专属建议与样品支持。
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-[#1a1a1a] font-medium tracking-wide transition-all hover:bg-[#f0ebe3] ${isAdding ? 'opacity-75' : ''}`}
                >
                  {isAdding ? '✓ 已加入询价清单' : '加入询价清单'}
                </button>
                <div>
                  <Link href="/contact" className="text-sm text-white/60 hover:text-white border-b border-white/30 pb-1">
                    或直接联系设计师 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Lightbox ===== */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-8" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white" onClick={() => setLightbox(null)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
            <Image src={lightbox.url} alt={lightbox.label || collection.name} width={1400} height={1400} className="max-w-full max-h-[80vh] object-contain" unoptimized />
            {lightbox.label && <p className="text-white/80 text-sm text-center mt-4 tracking-wide">{lightbox.label}</p>}
          </div>
        </div>
      )}
    </div>
  )
}