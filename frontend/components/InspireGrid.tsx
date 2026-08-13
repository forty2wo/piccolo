'use client'

import { useState, useMemo, useRef } from 'react'
import { products, normalizeBrand } from '@/lib/brand-products'
import type { Product } from '@/lib/brand-products'
import ProductDetailDrawer from '@/components/ProductDetailDrawer'

interface InspireItem {
  image: string
  collection: string
  nameEn: string
  nameZh: string
  brand: string
  href: string
  applications: string[]
  sceneLabel: string
}

function getAllImages(): InspireItem[] {
  const seen = new Set<string>()
  const items: InspireItem[] = []
  for (const p of products as Product[]) {
    const brand = normalizeBrand(p.brand)
    const href = `/products/${brand}/${p.collection}`
    for (const img of p.images || [p.image]) {
      if (seen.has(img)) continue
      if (img.includes('/swatches/')) continue
      seen.add(img)
      // 场景标签：取第一个 application 作为主场景
      const sceneLabel = p.applications?.[0] || ''
      items.push({
        image: img,
        collection: p.collection,
        nameEn: p.nameEn,
        nameZh: p.nameCn || p.name,
        brand: p.brand,
        href,
        applications: p.applications || [],
        sceneLabel,
      })
    }
  }
  return items
}

const SPACE_TABS: { id: string; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: '客厅', label: '客厅' },
  { id: '地面', label: '地面' },
  { id: '墙面', label: '墙面' },
  { id: '卫浴', label: '卫浴' },
  { id: '厨房', label: '厨房' },
  { id: '商业空间', label: '商业' },
  { id: '酒店', label: '酒店' },
  { id: '户外', label: '户外' },
]

const MAX_PER_SCENE = 10

// 网格尺寸类型定义
type GridType = 'large' | 'wide' | 'tall' | 'square' | 'small'

// 每个场景的网格布局节奏
const GRID_PATTERN: GridType[] = [
  'large',  // 0 - 大图开篇
  'tall',   // 1
  'tall',   // 2
  'square', // 3
  'square', // 4
  'square', // 5
  'wide',   // 6 - 宽图收尾
  'tall',   // 7
  'tall',   // 8
  'square', // 9
]

function getGridClasses(type: GridType): string {
  // 桌面 12 列 / 平板 6 列 / 手机 4 列
  switch (type) {
    case 'large':
      return 'col-span-6 sm:col-span-6 xs:col-span-4'  // 桌面6/平板6/手机4
    case 'wide':
      return 'col-span-8 sm:col-span-6 xs:col-span-4'  // 桌面8/平板6/手机4
    case 'tall':
      return 'col-span-4 sm:col-span-3 xs:col-span-2'  // 桌面4/平板3/手机2
    case 'square':
      return 'col-span-4 sm:col-span-3 xs:col-span-2'  // 桌面4/平板3/手机2
    case 'small':
      return 'col-span-3 sm:col-span-3 xs:col-span-2'  // 桌面3/平板3/手机2
  }
}

function getGridStyle(type: GridType): React.CSSProperties {
  switch (type) {
    case 'large': return { aspectRatio: '16/11' }
    case 'wide': return { aspectRatio: '16/10' }
    case 'tall': return { aspectRatio: '4/5' }
    case 'square': return { aspectRatio: '1/1' }
    case 'small': return { aspectRatio: '1/1' }
  }
}

export default function InspireGrid() {
  const allImages = useMemo(() => getAllImages(), [])
  const [activeTab, setActiveTab] = useState('all')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [drawer, setDrawer] = useState<{ brand: string; collection: string; heroImage?: string } | null>(null)

  // 按场景分组
  const sceneGroups = useMemo(() => {
    const groups: Record<string, InspireItem[]> = {}
    for (const t of SPACE_TABS) {
      if (t.id === 'all') continue
      const matched = allImages.filter(img => img.applications.includes(t.id))
      // 每个 collection 最多取 2 张，避免同一组挤在一起
      const byCollection = new Map<string, InspireItem[]>()
      for (const img of matched) {
        const arr = byCollection.get(img.collection) || []
        if (arr.length < 2) {
          arr.push(img)
          byCollection.set(img.collection, arr)
        }
      }
      // 交错排列
      const interleaved: InspireItem[] = []
      const lists = Array.from(byCollection.values())
      let i = 0
      while (interleaved.length < MAX_PER_SCENE && lists.some(l => l[i])) {
        for (const l of lists) {
          if (l[i]) interleaved.push(l[i])
          if (interleaved.length >= MAX_PER_SCENE) break
        }
        i++
      }
      if (interleaved.length > 0) {
        groups[t.id] = interleaved
      }
    }
    return groups
  }, [allImages])

  // 每个场景的计数
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allImages.length }
    for (const t of SPACE_TABS) {
      if (t.id === 'all') continue
      c[t.id] = sceneGroups[t.id]?.length || 0
    }
    return c
  }, [allImages, sceneGroups])

  // 需要展示的场景列表
  const visibleScenes = activeTab === 'all'
    ? SPACE_TABS.filter(t => t.id !== 'all').filter(t => (sceneGroups[t.id]?.length || 0) > 0)
    : SPACE_TABS.filter(t => t.id === activeTab)

  const handleImageClick = (img: InspireItem) => {
    const parts = img.href.split('/').filter(Boolean)
    if (parts.length >= 3 && parts[0] === 'products') {
      setDrawer({ brand: parts[1], collection: parts[2], heroImage: img.image })
    }
  }

  return (
    <div className="pt-20 md:pt-24 pb-16 md:pb-20">
      {/* ===== 页面头部 ===== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pb-4">
        <div className="flex items-end justify-between flex-wrap gap-4 md:gap-6 mb-5">
          <div>
            <h1 className="font-serif text-[32px] font-medium tracking-wide text-[#1c1c1c]">
              Inspire
              <small className="font-sans text-[14px] font-normal text-[#8a8a8a] ml-3 tracking-wide">
                灵感图集
              </small>
            </h1>
            <p className="text-[14px] text-[#4a4a4a] max-w-[480px] leading-relaxed mt-2">
              真实空间里的瓷砖应用 · 按场景浏览
            </p>
          </div>
        </div>

        {/* 场景标签 */}
        <div className="flex gap-2 overflow-x-auto pb-3 border-b border-black/[0.06] -mx-1 px-1 scrollbar-none">
          {SPACE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 px-5 py-1.5 text-[11px] tracking-[0.1em] uppercase rounded-full border transition-all duration-300 ${
                activeTab === t.id
                  ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                  : 'bg-transparent text-[#4a4a4a] border-transparent hover:bg-black/[0.03] hover:text-[#1c1c1c]'
              }`}
            >
              {t.label}
              <span className="opacity-50 ml-1 font-light">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== 场景区块 ===== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-3">
        {visibleScenes.map(scene => {
          const images = activeTab === 'all'
            ? sceneGroups[scene.id] || []
            : allImages.filter(img => img.applications.includes(scene.id)).slice(0, 20)

          if (images.length === 0) return null

          return (
            <div
              key={scene.id}
              ref={el => { sectionRefs.current[scene.id] = el }}
              className="mb-12 last:mb-0"
            >
              {/* 区块标题 */}
              <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-black/[0.06]">
                <h2 className="font-serif text-[22px] font-medium tracking-wide text-[#1c1c1c]">
                  {scene.label}
                </h2>
                <span className="text-[13px] text-[#8a8a8a] font-normal">
                  {images.length} 张
                </span>
              </div>

              {/* 12 列网格 */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 sm:gap-4">
                {images.slice(0, 10).map((img, idx) => {
                  const type = GRID_PATTERN[idx % GRID_PATTERN.length]
                  const style = getGridStyle(type)
                  const cls = getGridClasses(type)
                  return (
                    <button
                      key={`${img.image}-${idx}`}
                      onClick={() => handleImageClick(img)}
                      className={`group relative overflow-hidden bg-[#e8e3dc] text-left rounded-[2px] w-full ${cls}`}
                      style={style}
                    >
                      <img
                        src={img.image}
                        alt={img.nameEn}
                        loading="lazy"
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                        className="w-full h-full object-cover transition-all duration-[700ms] ease-out group-hover:scale-[1.04]"
                        style={{ opacity: 0 }}
                      />
                      {/* hover 遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* 底部信息 */}
                      <div className="absolute bottom-0 left-0 right-0 p-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[13px] text-white tracking-[0.06em] font-normal">
                          {img.nameEn}
                        </p>
                        <p className="text-[10px] text-white/70 tracking-[0.12em] uppercase mt-0.5">
                          {img.sceneLabel}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 抽屉式详情 */}
      {drawer && (
        <ProductDetailDrawer
          brand={drawer.brand}
          collection={drawer.collection}
          heroImage={drawer.heroImage}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  )
}
