'use client'

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { products, normalizeBrand } from '@/lib/brand-products'
import type { Product } from '@/lib/brand-products'
import ProductDetailDrawer from '@/components/ProductDetailDrawer'

interface CollectionItem {
  id: string
  name: string
  nameCn?: string
  nameEn: string
  brand: string
  image: string
  href: string
  applications: string[]
  style: string[]
  colorFamily: string[]
}

function getCollections(): CollectionItem[] {
  const seen = new Set<string>()
  const items: CollectionItem[] = []
  for (const p of products as Product[]) {
    if (seen.has(p.collection)) continue
    seen.add(p.collection)
    items.push({
      id: p.collection,
      name: p.nameCn || p.name,
      nameCn: p.nameCn,
      nameEn: p.nameEn,
      brand: p.brand,
      image: p.image,
      href: `/products/${normalizeBrand(p.brand)}/${p.collection}`,
      applications: p.applications || [],
      style: p.style || [],
      colorFamily: p.colorFamily || [],
    })
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

const STYLE_OPTIONS = ['现代', '极简', '工业风', '经典', '自然', '当代', '艺术', '复古']
const COLOR_OPTIONS = ['大地色', '灰色', '经典黑白', '多彩', '蓝色', '白色']
const BRAND_OPTIONS = ['41zero42', 'Opificio Ceramico']

export default function CollectionsGrid() {
  const collections = useMemo(() => getCollections(), [])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeTab = searchParams.get('space') ?? 'all'
  const styles = useMemo(() => searchParams.get('style')?.split(',').filter(Boolean) ?? [], [searchParams])
  const colors = useMemo(() => searchParams.get('color')?.split(',').filter(Boolean) ?? [], [searchParams])
  const brands = useMemo(() => searchParams.get('brand')?.split(',').filter(Boolean) ?? [], [searchParams])

  const [searchQuery, setSearchQueryLocal] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    const t = setTimeout(() => {
      const currentQ = searchParams.get('q') ?? ''
      if (searchQuery.trim() !== currentQ) {
        updateParams({ q: searchQuery.trim() || null })
      }
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    const urlQ = searchParams.get('q') ?? ''
    if (urlQ !== searchQuery) setSearchQueryLocal(urlQ)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '' || v === 'all') params.delete(k)
        else params.set(k, v)
      }
      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [searchParams, router, pathname]
  )

  const setActiveTab = (v: string) => updateParams({ space: v === 'all' ? null : v })
  const toggleStyles = (v: string) => {
    const next = styles.includes(v) ? styles.filter(x => x !== v) : [...styles, v]
    updateParams({ style: next.length ? next.join(',') : null })
  }
  const toggleColors = (v: string) => {
    const next = colors.includes(v) ? colors.filter(x => x !== v) : [...colors, v]
    updateParams({ color: next.length ? next.join(',') : null })
  }
  const toggleBrands = (v: string) => {
    const next = brands.includes(v) ? brands.filter(x => x !== v) : [...brands, v]
    updateParams({ brand: next.length ? next.join(',') : null })
  }
  const clearAll = () => updateParams({ style: null, color: null, brand: null, space: null, q: null })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [drawer, setDrawer] = useState<{ brand: string; collection: string; heroImage?: string } | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: collections.length }
    for (const t of SPACE_TABS) {
      if (t.id === 'all') continue
      c[t.id] = collections.filter(x => x.applications.includes(t.id)).length
    }
    return c
  }, [collections])

  const filtered = useMemo(() => {
    return collections
      .filter(c => activeTab === 'all' || c.applications.includes(activeTab))
      .filter(c => styles.length === 0 || styles.some(s => c.style.includes(s)))
      .filter(c => colors.length === 0 || colors.some(co => c.colorFamily.includes(co)))
      .filter(c => brands.length === 0 || brands.includes(c.brand))
      .filter(c => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          (c.nameCn && c.nameCn.toLowerCase().includes(q))
        )
      })
  }, [collections, activeTab, styles, colors, brands, searchQuery])

  const activeFilterCount = styles.length + colors.length + brands.length

  return (
    <div className="pt-20 md:pt-24 pb-16 md:pb-20">
      {/* ===== 页面头部 ===== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4 md:gap-6 mb-4">
          <h1 className="font-serif text-[28px] font-medium tracking-wide text-[#1c1c1c]">
            Collections
            <small className="font-sans text-[14px] font-normal text-[#8a8a8a] ml-3 tracking-wide">
              {collections.length} 个系列
            </small>
          </h1>

          {/* 搜索框（桌面） */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-black/[0.06] rounded-full px-5 py-1.5 focus-within:border-[#b8a088] focus-within:shadow-[0_0_0_3px_rgba(184,160,136,0.15)] transition-all duration-300">
            <svg className="w-[18px] h-[18px] text-[#8a8a8a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQueryLocal(e.target.value)}
              placeholder="搜索系列..."
              className="bg-transparent border-none outline-none text-[13px] text-[#1c1c1c] w-[180px] placeholder:text-[#8a8a8a]"
            />
          </div>
        </div>

        {/* 搜索框（移动） */}
        <div className="sm:hidden mb-3">
          <div className="flex items-center gap-2 bg-white border border-black/[0.06] rounded-full px-4 py-2">
            <svg className="w-4 h-4 text-[#8a8a8a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQueryLocal(e.target.value)}
              placeholder="搜索系列..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#8a8a8a]"
            />
          </div>
        </div>

        {/* 筛选标签 + 移动端筛选按钮 */}
        <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-black/[0.06] mb-6">
          <div className="flex gap-2 overflow-x-auto flex-1 pb-1 -mx-1 px-1 scrollbar-none">
            {SPACE_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 px-[18px] py-1.5 text-[11px] tracking-[0.08em] uppercase rounded-full border transition-all duration-300 ${
                  activeTab === t.id
                    ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                    : 'bg-transparent text-[#4a4a4a] border-transparent hover:bg-black/[0.03] hover:text-[#1c1c1c]'
                }`}
              >
                {t.label}
                <span className="opacity-50 ml-1 font-light">
                  {counts[t.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* 移动端筛选按钮 */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex-shrink-0 inline-flex items-center gap-1.5 px-[18px] py-1.5 text-[11px] tracking-[0.08em] uppercase bg-white border border-black/[0.06] rounded-full text-[#4a4a4a]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            筛选
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-[#b8a088] text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ===== 主体 ===== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 flex gap-8">
        {/* 桌面端侧边栏 */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="sticky top-28 space-y-8 text-[13px]">
            <FilterSidebar
              styles={styles}
              colors={colors}
              brands={brands}
              advancedOpen={advancedOpen}
              activeFilterCount={activeFilterCount}
              onToggleStyle={toggleStyles}
              onToggleColor={toggleColors}
              onToggleBrand={toggleBrands}
              onToggleAdvanced={() => setAdvancedOpen(!advancedOpen)}
              onClear={clearAll}
            />
          </div>
        </aside>

        {/* 瀑布流网格 */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-sm text-[#8a8a8a]">
              没有匹配的系列。试试清除一些筛选条件。
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-5 pb-5">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    const parts = c.href.split('/').filter(Boolean)
                    if (parts.length >= 3 && parts[0] === 'products') {
                      setDrawer({ brand: parts[1], collection: parts[2], heroImage: c.image })
                    }
                  }}
                  className="group relative block mb-5 overflow-hidden bg-[#e8e3dc] break-inside-avoid w-full text-left rounded-[2px]"
                >
                  <div className="relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-[#e8e3dc]"
                      style={{
                        opacity: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1,
                      }}
                      data-fade-placeholder
                    />
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      onLoad={(e) => {
                        const placeholder = e.currentTarget.previousElementSibling as HTMLElement | null
                        if (placeholder && placeholder.style) {
                          placeholder.style.transition = 'opacity 600ms ease-out'
                          placeholder.style.opacity = '0'
                        }
                      }}
                      className="w-full h-auto block transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  {/* hover 遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* 底部信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="font-serif text-[18px] font-medium text-white tracking-wide mb-0.5">
                      {c.name}
                    </h3>
                    <p className="text-[12px] text-white/70 tracking-[0.06em]">
                      {c.nameEn}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block text-[11px] tracking-[0.15em] uppercase text-[#b8a088] border-b border-[#b8a088] pb-0.5 font-medium">
                        Explore →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 结果统计 */}
          <div className="text-center pt-8 pb-4">
            <p className="text-[12px] text-[#8a8a8a] tracking-wide">
              显示 {filtered.length} / {collections.length} 个系列
            </p>
          </div>
        </div>
      </div>

      {/* ===== 移动端筛选侧边栏 ===== */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[59] bg-black/25 backdrop-blur-[4px]"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="lg:hidden fixed inset-y-0 left-0 z-[60] w-[300px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-y-auto"
            style={{
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="p-6 space-y-8 text-[13px]">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
                <h2 className="text-[14px] font-medium tracking-[0.08em]">筛选</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-[#8a8a8a] text-xl leading-none">&times;</button>
              </div>
              <FilterSidebar
                styles={styles}
                colors={colors}
                brands={brands}
                advancedOpen={advancedOpen}
                activeFilterCount={activeFilterCount}
                onToggleStyle={toggleStyles}
                onToggleColor={toggleColors}
                onToggleBrand={toggleBrands}
                onToggleAdvanced={() => setAdvancedOpen(!advancedOpen)}
                onClear={clearAll}
              />
              <div className="flex gap-3 pt-4 border-t border-black/[0.06]">
                <button
                  onClick={clearAll}
                  className="flex-1 py-3 text-[12px] tracking-[0.08em] uppercase border border-black/[0.06] text-[#4a4a4a] rounded-full"
                >
                  清除
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex-1 py-3 text-[12px] tracking-[0.08em] uppercase bg-[#1c1c1c] text-white rounded-full"
                >
                  查看 {filtered.length} 个
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

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

/* ============================================================
   筛选侧边栏内容
   ============================================================ */
function FilterSidebar({
  styles,
  colors,
  brands,
  advancedOpen,
  activeFilterCount,
  onToggleStyle,
  onToggleColor,
  onToggleBrand,
  onToggleAdvanced,
  onClear,
}: {
  styles: string[]
  colors: string[]
  brands: string[]
  advancedOpen: boolean
  activeFilterCount: number
  onToggleStyle: (v: string) => void
  onToggleColor: (v: string) => void
  onToggleBrand: (v: string) => void
  onToggleAdvanced: () => void
  onClear: () => void
}) {
  return (
    <>
      <div>
        <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-3 font-medium">风格 Style</h4>
        <div className="space-y-2">
          {STYLE_OPTIONS.map(s => (
            <FilterCheckbox key={s} label={s} checked={styles.includes(s)} onChange={() => onToggleStyle(s)} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] mb-3 font-medium">色系 Color</h4>
        <div className="space-y-2">
          {COLOR_OPTIONS.map(c => (
            <FilterCheckbox key={c} label={c} checked={colors.includes(c)} onChange={() => onToggleColor(c)} />
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={onToggleAdvanced}
          className="text-[11px] uppercase tracking-[0.1em] text-[#b8a088] border-b border-[#d4c5b0] pb-0.5 hover:text-[#1c1c1c] hover:border-[#1c1c1c] transition-all duration-300"
        >
          高级筛选 {advancedOpen ? '−' : '+'}
        </button>
        {advancedOpen && (
          <div className="mt-5 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a8a] mb-2 font-medium">品牌 Factory</p>
            {BRAND_OPTIONS.map(b => (
              <FilterCheckbox key={b} label={b} checked={brands.includes(b)} onChange={() => onToggleBrand(b)} />
            ))}
          </div>
        )}
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={onClear}
          className="text-[11px] text-[#b8a088] hover:underline tracking-wide"
        >
          清除筛选 ({activeFilterCount})
        </button>
      )}
    </>
  )
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center rounded-[2px] transition-all duration-300 ${
          checked
            ? 'bg-[#1c1c1c] border-[#1c1c1c]'
            : 'border-black/[0.06] bg-white group-hover:border-[#8a8a8a]'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </span>
      <span className={`text-[13px] transition-colors ${checked ? 'text-[#1c1c1c]' : 'text-[#4a4a4a] group-hover:text-[#1c1c1c]'}`}>
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  )
}
