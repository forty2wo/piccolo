'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { OpificioCollection, FlatImage, flattenImages } from '@/lib/opificio-collections'
import { normalizeBrand, getProductByCollection } from '@/lib/brand-products'
import { adaptZero42Product, getOpificioCollection } from '@/lib/opificio-collections'

interface ProductDetailDrawerProps {
  brand: string
  collection: string
  /** 列表页点击的那张图, 优先作为 hero 展示 */
  heroImage?: string
  onClose: () => void
}

/**
 * 全屏抽屉式详情页 v2 — 基于 Pixel41 重新设计
 *
 * 设计要点:
 * - 圆角弹窗 + 模糊背景, 而非铺满全屏
 * - Hero + 设计理念左右分栏 + 精心编排的画廊网格
 * - 规格改为双列网格, 标签式展示应用场景
 * - CTA 圆角按钮 + 悬浮动效
 */
export default function ProductDetailDrawer({ brand, collection: collectionId, heroImage, onClose }: ProductDetailDrawerProps) {
  const decodedCollectionId = decodeURIComponent(collectionId)

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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 锁定背景滚动
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
      window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior })
    }
  }, [])

  const [isClosing, setIsClosing] = useState(false)
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 400)
  }

  if (!collection) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
        <div className="bg-[#f7f4f0] rounded-2xl p-12 text-center max-w-md w-full">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-lg text-[#1c1c1c] mb-6">系列未找到</p>
          <button onClick={handleClose} className="text-sm text-[#b8a088] underline">返回列表</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-[6px] flex items-center justify-center p-5 md:p-6 ${isClosing ? 'pointer-events-none' : ''}`}
      onClick={handleClose}
    >
      <div
        className="detail-overlay relative w-full max-w-[1320px] max-h-[96vh] bg-[#f7f4f0] rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
        style={{
          animation: isClosing
            ? 'overlayOut 0.4s cubic-bezier(0.55,0,0.1,1) forwards'
            : 'overlayIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        <DetailContent collection={collection} sourceBrand={sourceBrand} heroImage={heroImage} onClose={handleClose} />
      </div>
    </div>
  )
}

/* ============================================================
   DetailContent — 主体内容
   ============================================================ */
function DetailContent({
  collection,
  sourceBrand,
  heroImage,
  onClose,
}: {
  collection: OpificioCollection
  sourceBrand: 'opificio' | '41zero42'
  heroImage?: string
  onClose: () => void
}) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [lightbox, setLightbox] = useState<{ images: FlatImage[]; index: number } | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

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
    setTimeout(() => setIsAdding(false), 2000)
  }

  // 合并所有图片用于画廊, 精心编排顺序
  const galleryItems = buildGalleryItems(lifestyle, detail, variant)

  return (
    <div className="flex flex-col h-full max-h-[96vh]">
      {/* ===== 固定头部 ===== */}
      <header className="detail-header sticky top-0 z-10 flex items-center justify-between px-7 md:px-8 h-14 md:h-16 bg-[#f7f4f0]/82 backdrop-blur-xl border-b border-black/[0.06] flex-shrink-0">
        <div className="text-[11px] tracking-[0.28em] uppercase text-[#8a8a8a] font-medium">
          <span className="text-[#b8a088] font-semibold">✦</span>{' '}
          {sourceBrand === 'opificio' ? 'Opificio Ceramico' : '41zero42'} · {collection.name}
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase text-[#4a4a4a] hover:text-[#1c1c1c] hover:bg-black/[0.04] px-3 py-1.5 rounded-full transition-all duration-300"
        >
          <span>关闭</span>
          <svg className="w-[18px] h-[18px] transition-transform duration-300 hover:rotate-90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* ===== 滚动内容 ===== */}
      <div ref={bodyRef} className="detail-body flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>

        {/* ===== Hero ===== */}
        {hero && (
          <section className="detail-hero relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden bg-[#2c2a28]">
            <Image
              src={heroImage || hero.url}
              alt={collection.name}
              fill
              priority
              className="object-cover object-center transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.25) 100%)',
              }}
            />
            <div className="detail-hero-content absolute bottom-0 left-0 right-0 p-12 md:px-10 md:pb-11 text-white max-w-[820px]">
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/55 font-normal mb-2.5">Collection</p>
              <h1
                className="font-serif font-medium leading-[1.02] tracking-tight mb-1.5"
                style={{ fontSize: 'clamp(44px, 8vw, 82px)' }}
              >
                {collection.name}
              </h1>
              {collection.nameCn && (
                <p className="font-light text-white/70 mb-3.5" style={{ fontSize: 'clamp(16px, 2vw, 22px)', letterSpacing: '0.12em' }}>
                  {collection.nameCn}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5" style={{ rowGap: '6px', columnGap: '24px', fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)' }}>
                {collection.designer && <MetaItem>{collection.designer}</MetaItem>}
                <MetaItem>Made in Italy</MetaItem>
                {collection.technology && <MetaItem>{collection.technology}</MetaItem>}
              </div>
            </div>
          </section>
        )}

        {/* ===== 设计理念 (左右分栏) ===== */}
        {collection.designConcept && (
          <section className="detail-section py-18 px-10 md:px-10 max-w-[1120px] mx-auto w-full" style={{ paddingTop: '72px', paddingBottom: '56px' }}>
            <div className="detail-concept grid grid-cols-1 md:grid-cols-2 gap-[60px] items-start">
              <blockquote
                className="font-serif italic text-[#1c1c1c] pl-7"
                style={{
                  fontSize: 'clamp(20px, 2.4vw, 30px)',
                  lineHeight: 1.6,
                  borderLeft: '3px solid #d4c5b0',
                  letterSpacing: '0.01em',
                }}
              >
                &ldquo;{collection.designConcept}&rdquo;
                {collection.designer && (
                  <footer className="mt-5 not-italic font-sans text-sm text-[#8a8a8a]" style={{ letterSpacing: '0.06em' }}>
                    — {collection.designer}
                  </footer>
                )}
              </blockquote>

              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] font-medium mb-4">The Concept</p>
                <div className="text-[15px] leading-[1.9] text-[#4a4a4a] space-y-4">
                  <p>
                    {collection.nameCn || collection.name} 系列秉承意大利手工陶瓷传统，将工艺美学与现代设计语言相融合。
                    每一片砖都承载着时间的温度与匠人的巧思。
                  </p>
                  {collection.features && collection.features.length > 0 && (
                    <p className="text-[14px] text-[#8a8a8a]">
                      <span className="text-[#b8a088]">✦</span>{' '}
                      {collection.features.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== 画廊 · 精心编排的网格 ===== */}
        {galleryItems.length > 0 && (
          <section className="detail-section px-10 md:px-10 max-w-[1120px] mx-auto w-full pb-14" style={{ paddingTop: '20px' }}>
            <div className="flex justify-between items-end flex-wrap gap-3 mb-2">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] font-medium mb-4">In Space</p>
                <h2
                  className="font-serif font-medium text-[#1c1c1c] leading-[1.15] tracking-tight mb-0"
                  style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
                >
                  空间故事
                </h2>
              </div>
              <span className="text-xs text-[#8a8a8a]" style={{ letterSpacing: '0.06em' }}>精选项目</span>
            </div>

            <div
              className="detail-gallery grid gap-3 mt-7"
              style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
            >
              {galleryItems.map((item, i) => {
                const g = getGalleryStyle(i)
                return (
                  <button
                    key={i}
                    onClick={() => setLightbox({ images: galleryItems, index: i })}
                    className={`relative overflow-hidden bg-[#e8e3dc] group ${g.className}`}
                    style={{ ...g.style, borderRadius: '2px' }}
                  >
                    <Image
                      src={item.url}
                      alt={`${collection.name} ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ===== 色彩变体 ===== */}
        {variant.length > 0 && (
          <section className="detail-section py-18 px-10 md:px-10 max-w-[1120px] mx-auto w-full bg-white" style={{ paddingTop: '72px', paddingBottom: '56px' }}>
            <div className="text-center mb-12">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] font-medium mb-4">Color Palette</p>
              <h2
                className="font-serif font-medium text-[#1c1c1c] leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
              >
                色彩变体
              </h2>
              <p className="mt-3 text-sm text-[#5a5a5a]">{variant.length} 种色彩 · 点击查看大图</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {variant.map((v, i) => (
                <button key={i} onClick={() => setLightbox({ images: variant, index: i })} className="group text-left">
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
                    <p className="text-xs text-[#1c1c1c] leading-tight group-hover:text-[#8a7a5a] transition-colors">
                      {v.label}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ===== 技术规格 ===== */}
        <section className="detail-section py-18 px-10 md:px-10 max-w-[1120px] mx-auto w-full" style={{ paddingTop: '72px', paddingBottom: '56px' }}>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8a088] font-medium mb-4">Specifications</p>
          <h2
            className="font-serif font-medium text-[#1c1c1c] leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            技术规格
          </h2>

          <div
            className="detail-specs grid gap-y-12 mt-3"
            style={{ gridTemplateColumns: '1fr 1fr', columnGap: '80px' }}
          >
            {collection.technology && (
              <SpecItem label="工艺" value={collection.technology} />
            )}
            {collection.thickness && (
              <SpecItem label="厚度" value={collection.thickness} />
            )}
            {collection.finishes.length > 0 && (
              <SpecItem label="表面处理" value={collection.finishes.join(' · ')} />
            )}
            {collection.style.length > 0 && (
              <SpecItem label="风格" value={collection.style.join(' · ')} />
            )}
            {collection.applications.length > 0 && (
              <SpecItem
                label="应用场景"
                value={
                  <span className="flex flex-wrap gap-1.5">
                    {collection.applications.map((app, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-3 py-0.5 rounded-full"
                        style={{ background: 'rgba(184,160,136,0.12)', color: '#b8a088', letterSpacing: '0.04em' }}
                      >
                        {app}
                      </span>
                    ))}
                  </span>
                }
              />
            )}
            {(collection.sizes || collection.size) && (
              <SpecItem label="尺寸" value={collection.sizes?.join(' · ') || collection.size || ''} />
            )}
            <SpecItem label="产地" value="意大利" />
            <SpecItem
              label="Factory"
              value={
                <span className="text-[#8a8a8a] text-xs tracking-wide">
                  {sourceBrand === 'opificio' ? 'Opificio Ceramico' : '41zero42'} · Italy
                </span>
              }
            />
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="detail-section px-10 md:px-10 max-w-[1120px] mx-auto w-full" style={{ paddingTop: '16px', paddingBottom: '64px' }}>
          <div
            className="detail-cta grid items-center text-white mt-4"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              background: '#1c1c1c',
              borderRadius: '2px',
              padding: '48px 52px',
            }}
          >
            <div>
              <h2
                className="font-serif font-medium tracking-tight mb-2.5 leading-tight"
                style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
              >
                心仪此系列？
              </h2>
              <p className="text-white/60 text-sm leading-7 max-w-[400px]">
                将系列加入询价清单，我们的设计师团队将为您提供专属建议与样品支持。
              </p>
            </div>
            <div className="detail-cta-actions flex flex-col items-start gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`inline-flex items-center gap-3 px-9 py-3.5 text-[#1c1c1c] font-medium rounded-full transition-all duration-[450ms] ease-out ${isAdding ? '' : 'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]'}`}
                style={{
                  background: isAdding ? '#b8a088' : '#ffffff',
                  color: isAdding ? '#fff' : '#1c1c1c',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                }}
              >
                {isAdding ? (
                  <>✓ 已加入清单</>
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                    加入询价清单
                  </>
                )}
              </button>
              <Link
                href="/contact"
                className="text-sm text-white/50 hover:text-white border-b border-white/15 hover:border-white/40 pb-0.5 transition-all duration-300"
                style={{ letterSpacing: '0.04em' }}
              >
                或直接联系设计师 →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Lightbox ===== */}
      {lightbox && (
        <LightboxView
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChange={idx => setLightbox(prev => prev ? { ...prev, index: idx } : null)}
        />
      )}
    </div>
  )
}

/* ============================================================
   小组件
   ============================================================ */
function MetaItem({ children }: { children: React.ReactNode }) {
  return <span className="relative">{children}</span>
}

function SpecItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 pb-3.5 border-b border-black/[0.06]">
      <span
        className="text-[11px] tracking-[0.12em] uppercase text-[#8a8a8a] font-medium"
      >
        {label}
      </span>
      <span className="text-[15px] text-[#1c1c1c]" style={{ letterSpacing: '0.02em' }}>
        {value}
      </span>
    </div>
  )
}

/* ============================================================
   画廊图片编排逻辑
   ============================================================ */
function buildGalleryItems(
  lifestyle: FlatImage[],
  detail: FlatImage[],
  variant: FlatImage[],
): FlatImage[] {
  // 优先用 lifestyle + detail, 不够时用 variant 填充
  const main = [...lifestyle, ...detail]

  // 如果主图足够, 混合少量 variant 作为点缀
  if (main.length >= 6) {
    const items: FlatImage[] = [...main]
    // 在第 3、第 8 位置插入 variant 增加视觉节奏
    if (variant.length > 0) {
      const idx1 = Math.min(3, items.length)
      items.splice(idx1, 0, variant[0])
    }
    if (variant.length > 1) {
      const idx2 = Math.min(9, items.length)
      items.splice(idx2, 0, variant[1])
    }
    return items.slice(0, 15)
  }

  // 主图不足, 全部混合
  const all = [...lifestyle, ...variant, ...detail]
  return all.slice(0, 15)
}

function getGalleryStyle(index: number): { style: React.CSSProperties; className: string } {
  // 12 栅格系统: 精心编排的尺寸节奏
  const pattern: Array<{ span: number; ratio: string; type: string }> = [
    { span: 4, ratio: '4/5', type: 'tall' },
    { span: 4, ratio: '4/5', type: 'tall' },
    { span: 8, ratio: '16/10', type: 'wide' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 6, ratio: '4/3', type: 'large' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 4, ratio: '4/5', type: 'tall' },
    { span: 4, ratio: '4/5', type: 'tall' },
    { span: 8, ratio: '16/10', type: 'wide' },
    { span: 4, ratio: '4/5', type: 'tall' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 3, ratio: '1/1', type: 'square' },
    { span: 6, ratio: '4/3', type: 'large' },
  ]
  const item = pattern[index % pattern.length]
  return {
    style: {
      gridColumn: `span ${item.span} / span ${item.span}`,
      aspectRatio: item.ratio,
    },
    className: `gallery-${item.type}`,
  }
}

/* ============================================================
   Lightbox — 大图查看器（支持左右切换）
   ============================================================ */
function LightboxView({
  images,
  index,
  onClose,
  onChange,
}: {
  images: FlatImage[]
  index: number
  onClose: () => void
  onChange: (idx: number) => void
}) {
  const total = images.length
  const current = images[index]

  const goPrev = () => onChange((index - 1 + total) % total)
  const goNext = () => onChange((index + 1) % total)

  // 键盘导航
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 md:p-8 select-none"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        className="absolute top-4 md:top-6 right-4 md:right-6 text-white/60 hover:text-white transition-colors z-10"
        onClick={onClose}
        aria-label="关闭"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 序号 */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.2em] z-10">
        {index + 1} / {total}
      </div>

      {/* 左箭头 */}
      {total > 1 && (
        <button
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all z-10"
          onClick={e => { e.stopPropagation(); goPrev() }}
          aria-label="上一张"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 右箭头 */}
      {total > 1 && (
        <button
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all z-10"
          onClick={e => { e.stopPropagation(); goNext() }}
          aria-label="下一张"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 图片 */}
      <div className="relative max-w-5xl max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <Image
          src={current.url}
          alt={current.label || ''}
          width={1400}
          height={1400}
          className="max-w-full max-h-[70vh] object-contain"
          unoptimized
          priority
        />
        {current.label && (
          <p className="text-white/80 text-sm text-center mt-4 tracking-wide">{current.label}</p>
        )}
      </div>

      {/* 缩略图导航 */}
      {total > 1 && total <= 12 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/30 backdrop-blur-sm max-w-[90vw] overflow-x-auto"
          onClick={e => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300 ${
                i === index
                  ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-black/30 scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`第 ${i + 1} 张图`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}