'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import FadeImage from './FadeImage'
import FadeIn from './FadeIn'
import { products } from '@/lib/brand-products'
import imageRatios from '@/lib/image-ratios.json'
import ProductDetailDrawer from '@/components/ProductDetailDrawer'

/* ============================================================
 * Curated Gallery v16 — CSS Grid 变宽瀑布流
 *
 * 交互: 点击 tile → 原地展开抽屉式详情
 * 布局: CSS Grid 12 列 + grid-column span + dense 自动填充
 *   宽图占 8 列 (大卡片), 普通图占 4 列 (标准卡片)
 *   类 41zero42 视觉效果, 每行列数不固定
 * 图片: 真实宽高比 + 盖帽
 * ============================================================ */

const INITIAL_BATCH = 12
const MORE_BATCH = 6
const MAX_TILES = 48

interface Tile {
  id: string
  image: string
  width: number
  height: number
  brand: string
  collection: string
  href: string
  name: string
  nameEn: string
}

function buildImagePool() {
  const pool: Array<{ image: string; brand: string; collection: string; href: string; name: string; nameEn: string }> = []
  for (const p of products) {
    const brandSlug = p.brand.toLowerCase().replace(/\s+/g, '-')
    const href = `/products/${brandSlug}/${p.collection}`
    const imgs = p.images && p.images.length > 1 ? p.images : [p.image]
    for (const img of imgs) {
      pool.push({ image: img, brand: p.brand, collection: p.collection, href, name: p.nameCn || p.name, nameEn: p.nameEn })
    }
  }
  return pool
}

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

function buildTiles(
  pool: ReturnType<typeof buildImagePool>,
  ratios: Record<string, { w: number; h: number; r: number }>,
  n: number,
  startIndex = 0,
  rng: () => number = Math.random,
): Tile[] {
  const tiles: Tile[] = []
  const recentCollections: string[] = []
  const RECENT_WINDOW = 3
  const shuffled = shuffle(pool, rng)
  let cursor = 0
  const maxIter = n * 12

  while (tiles.length < n && cursor < maxIter) {
    const candidate = shuffled[cursor % shuffled.length]; cursor++
    if (!candidate) break
    if (recentCollections.includes(candidate.collection)) continue
    if (!ratios[candidate.image]) continue

    tiles.push({
      id: `t${startIndex + tiles.length}-${candidate.collection}-${cursor}`,
      image: candidate.image,
      width: ratios[candidate.image].w,
      height: ratios[candidate.image].h,
      brand: candidate.brand,
      collection: candidate.collection,
      href: candidate.href,
      name: candidate.name,
      nameEn: candidate.nameEn,
    })
    recentCollections.push(candidate.collection)
    if (recentCollections.length > RECENT_WINDOW) recentCollections.shift()
  }
  return tiles
}

const BLUR_PLACEHOLDER =
  'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoIAAUAAUAmJZQAA3AA/vJzGgA='

// 宽高比阈值: 大于此值判定为宽幅图, 占更多列宽
const WIDE_RATIO_THRESHOLD = 1.3

export default function FeaturedCollections() {
  const pool = useMemo(() => buildImagePool(), [])
  const ratios = imageRatios as Record<string, { w: number; h: number; r: number }>

  const rng = useMemo(() => mulberry32(42), [])

  const [tiles, setTiles] = useState<Tile[]>(() => {
    return buildTiles(pool, ratios, INITIAL_BATCH, 0, rng)
  })

  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const [drawer, setDrawer] = useState<{ brand: string; collection: string; heroImage?: string } | null>(null)

  const loadingRef = useRef(false)
  const tilesRef = useRef(tiles)
  tilesRef.current = tiles

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (loadingRef.current) return
        if (tilesRef.current.length >= MAX_TILES) {
          obs.unobserve(sentinel)
          return
        }

        loadingRef.current = true
        setLoading(true)

        setTimeout(() => {
          setTiles(prev => {
            const next = buildTiles(pool, ratios, MORE_BATCH, prev.length, rng)
            const existing = new Set(prev.map(t => `${t.collection}-${t.image}`))
            const merged = prev.concat(next.filter(t => !existing.has(`${t.collection}-${t.image}`)))
            loadingRef.current = false
            return merged
          })
          setLoading(false)
        }, 120)
      },
      { rootMargin: '0px 0px 300px 0px' },
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [pool, ratios, rng])

  const handleTileClick = (e: React.MouseEvent, tile: Tile) => {
    e.preventDefault()
    const parts = tile.href.split('/').filter(Boolean)
    if (parts.length >= 3 && parts[0] === 'products') {
      setDrawer({ brand: parts[1], collection: parts[2], heroImage: tile.image })
    }
  }

  return (
    <section className="py-20 md:py-28 bg-warm-paper">
      <div className="container px-6 md:px-8">
        <div className="mb-14 md:mb-20 max-w-2xl">
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent mb-3">Season Highlight</p>
          <h2 className="text-3xl md:text-4xl font-display text-primary leading-tight">本季焦点</h2>
          <p className="mt-3 text-sm md:text-[15px] text-primary-light leading-relaxed">
            由 Piccola 从意大利工坊与设计系列中精选。
          </p>
        </div>

        {/* CSS Grid 变宽瀑布流 — 响应式: 移动端2列 / 平板6列 / 桌面12列 */}
        <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-12 gap-3 md:gap-4 grid-flow-dense">
          {tiles.map((tile, index) => {
            const ratio = tile.width / tile.height
            const clampedRatio = Math.max(ratio, 0.55)
            const isWide = ratio > WIDE_RATIO_THRESHOLD
            // 响应式 span: 手机全宽 / 平板占4列 / 桌面占8列 (宽图); 手机1列 / 平板3列 / 桌面4列 (普通图)
            const colSpanClass = isWide
              ? 'col-span-2 sm:col-span-4 md:col-span-8'
              : 'col-span-1 sm:col-span-3 md:col-span-4'
            return (
              <FadeIn
                key={tile.id}
                delay={Math.min((index % 6) * 60, 300)}
                offset={50}
                duration={700}
                className={`group relative block overflow-hidden bg-warm-ivory ${colSpanClass}`}
              >
                <a
                  href={tile.href}
                  onClick={(e) => handleTileClick(e, tile)}
                  className="block w-full h-full"
                  style={{ aspectRatio: String(clampedRatio) }}
                >
                <FadeImage
                  src={tile.image}
                  alt={`${tile.name} - ${tile.nameEn}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  unoptimized
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />

                <span className="absolute top-3 right-3 text-[9px] tracking-[0.25em] uppercase text-white/85 mix-blend-difference">
                  {tile.brand}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-white text-xs md:text-sm font-light leading-tight">{tile.name}</h3>
                  <p className="text-white/70 text-[9px] md:text-[10px] tracking-wider mt-0.5">{tile.nameEn}</p>
                </div>
                </a>
              </FadeIn>
            )
          })}
        </div>

        <div ref={sentinelRef} className="h-1" aria-hidden="true" />

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary-muted">Loading · 加载中</p>
          </div>
        )}

        {tiles.length >= MAX_TILES && (
          <div className="mt-16 text-center">
            <Link
              href="/collections"
              className="inline-block text-xs tracking-[0.15em] uppercase text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
            >
              查看全部系列 →
            </Link>
          </div>
        )}

        <div className="mt-16 text-center md:hidden">
          <Link
            href="/collections"
            className="inline-block text-xs tracking-[0.15em] uppercase text-primary border-b border-primary pb-1"
          >
            查看全部系列
          </Link>
        </div>
      </div>

      {drawer && (
        <ProductDetailDrawer
          brand={drawer.brand}
          collection={drawer.collection}
          heroImage={drawer.heroImage}
          onClose={() => setDrawer(null)}
        />
      )}
    </section>
  )
}