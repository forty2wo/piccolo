'use client';

import { useState, useMemo, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { products, normalizeBrand } from '@/lib/brand-products';
import type { Product } from '@/lib/brand-products';
import ProductDetailDrawer from '@/components/ProductDetailDrawer';

interface CollectionItem {
  id: string;
  name: string;
  nameCn?: string;
  nameEn: string;
  brand: string;
  image: string;
  href: string;
  applications: string[];
  style: string[];
  colorFamily: string[];
}

function getCollections(): CollectionItem[] {
  const seen = new Set<string>();
  const items: CollectionItem[] = [];
  for (const p of products as Product[]) {
    if (seen.has(p.collection)) continue;
    seen.add(p.collection);
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
    });
  }
  return items;
}

// 顶层 tab（按空间 / applications）— 高定零售用户最常用的决策路径
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
];

const STYLE_OPTIONS = ['现代', '极简', '工业风', '经典', '自然', '当代', '艺术', '复古'];
const COLOR_OPTIONS = ['大地色', '灰色', '经典黑白', '多彩', '蓝色', '白色'];
const BRAND_OPTIONS = ['41zero42', 'Opificio Ceramico'];

export default function CollectionsGrid() {
  const collections = useMemo(() => getCollections(), []);

  // 筛选状态持久化到 URL search params — 解决 back 返回时状态丢失
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 从 URL 读取初始 state
  const activeTab = searchParams.get('space') ?? 'all';
  const styles = useMemo(() => searchParams.get('style')?.split(',').filter(Boolean) ?? [], [searchParams]);
  const colors = useMemo(() => searchParams.get('color')?.split(',').filter(Boolean) ?? [], [searchParams]);
  const brands = useMemo(() => searchParams.get('brand')?.split(',').filter(Boolean) ?? [], [searchParams]);

  // 搜索：本地 state + 防抖写 URL（避免每打一个字就 router.replace）
  const [searchQuery, setSearchQueryLocal] = useState(searchParams.get('q') ?? '');
  useEffect(() => {
    const t = setTimeout(() => {
      const currentQ = searchParams.get('q') ?? '';
      if (searchQuery.trim() !== currentQ) {
        updateParams({ q: searchQuery.trim() || null });
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  // 同步外部 (URL 变) 到本地 state
  useEffect(() => {
    const urlQ = searchParams.get('q') ?? '';
    if (urlQ !== searchQuery) setSearchQueryLocal(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 写回 URL 的 helper
  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '' || v === 'all') params.delete(k);
        else params.set(k, v);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [searchParams, router, pathname]
  );

  const setActiveTab = (v: string) => updateParams({ space: v === 'all' ? null : v });
  const setSearchQuery = (v: string) => updateParams({ q: v.trim() || null });
  const toggleStyles = (v: string) => {
    const next = styles.includes(v) ? styles.filter(x => x !== v) : [...styles, v];
    updateParams({ style: next.length ? next.join(',') : null });
  };
  const toggleColors = (v: string) => {
    const next = colors.includes(v) ? colors.filter(x => x !== v) : [...colors, v];
    updateParams({ color: next.length ? next.join(',') : null });
  };
  const toggleBrands = (v: string) => {
    const next = brands.includes(v) ? brands.filter(x => x !== v) : [...brands, v];
    updateParams({ brand: next.length ? next.join(',') : null });
  };
  const clearAll = () =>
    updateParams({ style: null, color: null, brand: null });

  // 移动端 filter 抽屉
  const [filterOpen, setFilterOpen] = useState(false);
  // 高级筛选展开
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // 抽屉状态
  const [drawer, setDrawer] = useState<{ brand: string; collection: string } | null>(null);

  // 计数（实时反映当前 filter 命中数）
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: collections.length };
    for (const t of SPACE_TABS) {
      if (t.id === 'all') continue;
      c[t.id] = collections.filter(x => x.applications.includes(t.id)).length;
    }
    return c;
  }, [collections]);

  // 实际 filter
  const filtered = useMemo(() => {
    return collections
      .filter(c => activeTab === 'all' || c.applications.includes(activeTab))
      .filter(c => styles.length === 0 || styles.some(s => c.style.includes(s)))
      .filter(c => colors.length === 0 || colors.some(co => c.colorFamily.includes(co)))
      .filter(c => brands.length === 0 || brands.includes(c.brand))
      .filter(c => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          (c.nameCn && c.nameCn.toLowerCase().includes(q))
        );
      });
  }, [collections, activeTab, styles, colors, brands, searchQuery]);

  const activeFilterCount = styles.length + colors.length + brands.length;

  return (
    <section className="pt-20 md:pt-24 pb-16 md:pb-20">
      {/* 顶部：标题 + 搜索 + 移动端 filter 按钮 */}
      <div className="container px-4 md:px-12 mb-6 md:mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-light tracking-[0.15em] uppercase text-primary">
              Collections
            </h1>
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="w-40 md:w-56 px-3 py-1.5 text-xs border border-border bg-white text-primary placeholder-primary-muted focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQueryLocal('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-muted hover:text-primary"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-muted">
              {filtered.length} / {collections.length}
            </span>
            {/* 移动端 filter 按钮 */}
            <button
              onClick={() => setFilterOpen(true)}
              className="md:hidden relative px-3 py-1.5 text-xs border border-border bg-white"
            >
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] bg-primary text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* 移动端搜索框 */}
        <div className="sm:hidden mt-3 relative">
          <input
            type="text"
            placeholder="搜索系列..."
            value={searchQuery}
            onChange={(e) => setSearchQueryLocal(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-border bg-white text-primary placeholder-primary-muted focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* 顶层 tab — 按空间 */}
      <div className="container px-4 md:px-12 mb-8">
        <div className="flex flex-wrap gap-2">
          {SPACE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 text-xs tracking-wide transition-colors ${
                activeTab === t.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-primary-light hover:bg-border'
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-60">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 主体：左 filter + 右 grid */}
      <div className="container px-4 md:px-12 flex gap-8">
        {/* 桌面端左侧 filter */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-8 text-xs">
            <FilterGroup title="风格 Style">
              {STYLE_OPTIONS.map(s => (
                <Checkbox
                  key={s}
                  label={s}
                  checked={styles.includes(s)}
                  onChange={() => toggleStyles(s)}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="色系 Color">
              {COLOR_OPTIONS.map(c => (
                <Checkbox
                  key={c}
                  label={c}
                  checked={colors.includes(c)}
                  onChange={() => toggleColors(c)}
                />
              ))}
            </FilterGroup>
            <div>
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="w-full flex items-center justify-between text-primary-light hover:text-primary transition-colors uppercase tracking-wide"
              >
                <span>高级筛选</span>
                <span className="text-[10px]">{advancedOpen ? '−' : '+'}</span>
              </button>
              {advancedOpen && (
                <div className="mt-4 space-y-3 pl-1">
                  <p className="text-[10px] uppercase tracking-wide text-primary-muted mb-2">
                    品牌 Factory
                  </p>
                  {BRAND_OPTIONS.map(b => (
                    <Checkbox
                      key={b}
                      label={b === '41zero42' ? '41zero42' : 'Opificio Ceramico'}
                      checked={brands.includes(b)}
                      onChange={() => toggleBrands(b)}
                    />
                  ))}
                </div>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[11px] text-accent-gold hover:underline"
              >
                清除筛选 ({activeFilterCount})
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-sm text-primary-muted">
              没有匹配的系列。试试清除一些筛选条件。
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    const parts = c.href.split('/').filter(Boolean)
                    if (parts.length >= 3 && parts[0] === 'products') {
                      setDrawer({ brand: parts[1], collection: parts[2] })
                    }
                  }}
                  className="group relative block mb-4 md:mb-6 overflow-hidden bg-surface break-inside-avoid w-full text-left"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="text-base md:text-lg font-light text-white tracking-wide mb-1 drop-shadow-md">
                      {c.name}
                    </h3>
                    <p className="text-xs text-white/70 tracking-wide drop-shadow-sm">
                      {c.nameEn}
                    </p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <span className="text-accent-gold text-[11px] tracking-wider uppercase font-medium">
                        Explore →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 移动端 filter 抽屉 */}
      {filterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setFilterOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white max-h-[80vh] overflow-y-auto p-6 space-y-6 text-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-base font-medium">筛选</span>
              <button onClick={() => setFilterOpen(false)} className="text-primary-muted">✕</button>
            </div>
            <FilterGroup title="风格">
              {STYLE_OPTIONS.map(s => (
                <Checkbox
                  key={s}
                  label={s}
                  checked={styles.includes(s)}
                  onChange={() => toggleStyles(s)}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="色系">
              {COLOR_OPTIONS.map(c => (
                <Checkbox
                  key={c}
                  label={c}
                  checked={colors.includes(c)}
                  onChange={() => toggleColors(c)}
                />
              ))}
            </FilterGroup>
            <FilterGroup title="品牌">
              {BRAND_OPTIONS.map(b => (
                <Checkbox
                  key={b}
                  label={b === '41zero42' ? '41zero42' : 'Opificio Ceramico'}
                  checked={brands.includes(b)}
                  onChange={() => toggleBrands(b)}
                />
              ))}
            </FilterGroup>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={clearAll}
                className="flex-1 py-3 text-xs border border-border text-primary-light"
              >
                清除全部
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3 text-xs bg-primary text-white"
              >
                查看 {filtered.length} 个结果
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 抽屉式详情 */}
      {drawer && (
        <ProductDetailDrawer
          brand={drawer.brand}
          collection={drawer.collection}
          onClose={() => setDrawer(null)}
        />
      )}
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-primary-muted mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <span
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? 'bg-primary border-primary' : 'border-border bg-white group-hover:border-primary-muted'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </span>
      <span className={`transition-colors ${checked ? 'text-primary' : 'text-primary-light group-hover:text-primary'}`}>
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}
