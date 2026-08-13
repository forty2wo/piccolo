'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/lib/brand-products'
import imageRatios from '@/lib/image-ratios.json'
import ProductDetailDrawer from '@/components/ProductDetailDrawer'

/* ============================================================
 * Curated Gallery v13
 *
 * 交互: 点击 tile → 原地展开抽屉式详情 (不跳转页面)
 * 布局: CSS columns (纯 CSS)
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

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return h
}

function getDailySeed(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}|featured`
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

export default function FeaturedCollections() {
  const pool = useMemo(() => buildImagePool(), [])
  const ratios = imageRatios as Record<string, { w: number; h: number; r: number }>

  const [tiles, setTiles] = useState<Tile[]>(() => {
    const seed = hashSeed(getDailySeed())
    return buildTiles(pool, ratios, INITIAL_BATCH, 0, mulberry32(seed))
  })

  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // 抽屉状态
  const [drawer, setDrawer] = useState<{ brand: string; collection: string } | null>(null)

  // 用 ref 存储 loading 状态, 避免 loadMore 依赖变化导致 IntersectionObserver 重建
  // 注意: 不要在这里同步 loading state 到 ref — 由 loadMore 内部直接操作 ref
  const loadingRef = useRef(false)
  const tilesLenRef = useRef(tiles.length)

  const loadMore = useCallback(() => {
    if (loadingRef.current || tilesLenRef.current >= MAX_TILES) return
    loadingRef.current = true
    setLoading(true)
    setTimeout(() => {
      const seed = hashSeed(getDailySeed()); const rng = mulberry32(seed)
      setTiles(prev => {
        const next = buildTiles(pool, ratios, MORE_BATCH, prev.length, rng)
        const existing = new Set(prev.map(t => `${t.collection}-${t.image}`))
        const merged = prev.concat(next.filter(t => !existing.has(`${t.collection}-${t.image}`)))
        tilesLenRef.current = merged.length
        return merged
      })
      loadingRef.current = false
      setLoading(false)
    }, 120)
  }, [pool, ratios])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px 0px' },
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [loadMore])

  const handleTileClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    // 从 href 解析 brand + collection
    // href 格式: /products/{brand}/{collection}
    const parts = href.split('/').filter(Boolean)
    if (parts.length >= 3 && parts[0] === 'products') {
      setDrawer({ brand: parts[1], collection: parts[2] })
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

        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 md:gap-10">
          {tiles.map((tile) => {
            const ratio = tile.width / tile.height
            const clampedRatio = Math.max(ratio, 0.55)
            return (
              <a
                key={tile.id}
                href={tile.href}
                onClick={(e) => handleTileClick(e, tile.href)}
                className="group block mb-6 md:mb-10 break-inside-avoid overflow-hidden bg-warm-ivory"
              >
                <div style={{ aspectRatio: String(clampedRatio) }} className="relative w-full">
                  <Image
                    src={tile.image}
                    alt={`${tile.name} - ${tile.nameEn}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>

                <span className="absolute top-3 right-3 text-[9px] tracking-[0.25em] uppercase text-white/85 mix-blend-difference">
                  {tile.brand}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-white text-xs md:text-sm font-light leading-tight">{tile.name}</h3>
                  <p className="text-white/70 text-[9px] md:text-[10px] tracking-wider mt-0.5">{tile.nameEn}</p>
                </div>
              </a>
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

      {/* 抽屉式详情 */}
      {drawer && (
        <ProductDetailDrawer
          brand={drawer.brand}
          collection={drawer.collection}
          onClose={() => setDrawer(null)}
        />
      )}
    </section>
  )
}