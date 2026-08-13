'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products } from '@/lib/brand-products';
import type { Product } from '@/lib/brand-products';

interface InspireItem {
  image: string;
  collection: string;
  nameEn: string;
  nameZh: string;
  href: string;
  applications: string[];
}

function getAllImages(): InspireItem[] {
  const seen = new Set<string>();
  const items: InspireItem[] = [];
  for (const p of products as Product[]) {
    for (const img of p.images) {
      if (seen.has(img)) continue;
      // 只用 cover + content（图库里的实景图），跳过 swatches（色卡）
      if (img.includes('/swatches/')) continue;
      seen.add(img);
      items.push({
        image: img,
        collection: p.collection,
        nameEn: p.nameEn,
        nameZh: p.nameCn || p.name,
        href: `/products/${p.brand.toLowerCase().replace(/\s+/g, '-')}/${p.collection}`,
        applications: p.applications || [],
      });
    }
  }
  return items;
}

// 顶层分组（按空间 / applications）— 与 /collections 同步
const SPACE_GROUPS: { id: string; label: string }[] = [
  { id: '客厅', label: '客厅' },
  { id: '地面', label: '地面' },
  { id: '墙面', label: '墙面' },
  { id: '卫浴', label: '卫浴' },
  { id: '厨房', label: '厨房' },
  { id: '商业空间', label: '商业' },
  { id: '酒店', label: '酒店' },
  { id: '户外', label: '户外' },
];

// 每个分组下最多展示的图片数
const MAX_PER_GROUP = 12;

export default function InspireGrid() {
  const allImages = useMemo(() => getAllImages(), []);

  // 每个分组的图片（按 collection 分散抽取，避免同一 collection 挤在一起）
  const groups = useMemo(() => {
    const result: { id: string; label: string; images: InspireItem[] }[] = [];
    for (const g of SPACE_GROUPS) {
      // 收集命中该空间的所有图
      const matched = allImages.filter(img => img.applications.includes(g.id));
      // 按 collection 分散（每个 collection 最多取 2 张，避免某一组占满）
      const byCollection = new Map<string, InspireItem[]>();
      for (const img of matched) {
        const arr = byCollection.get(img.collection) || [];
        if (arr.length < 2) {
          arr.push(img);
          byCollection.set(img.collection, arr);
        }
      }
      // 交错排列（轮询每个 collection）以产生视觉变化
      const interleaved: InspireItem[] = [];
      const lists = Array.from(byCollection.values());
      let i = 0;
      while (interleaved.length < MAX_PER_GROUP && lists.some(l => l[i])) {
        for (const l of lists) {
          if (l[i]) interleaved.push(l[i]);
          if (interleaved.length >= MAX_PER_GROUP) break;
        }
        i++;
      }
      if (interleaved.length > 0) {
        result.push({ id: g.id, label: g.label, images: interleaved });
      }
    }
    return result;
  }, [allImages]);

  return (
    <section className="pt-20 md:pt-24 pb-16 md:pb-20">
      {/* 标题 */}
      <div className="container px-4 md:px-12 mb-12 md:mb-16">
        <h1 className="text-lg md:text-xl font-light tracking-[0.15em] uppercase text-primary">
          Inspire
        </h1>
        <p className="mt-3 text-sm text-primary-muted max-w-2xl">
          真实空间里的瓷砖 · 按场景浏览
        </p>
      </div>

      {/* 按空间分组 */}
      <div className="container px-4 md:px-12 space-y-16 md:space-y-20">
        {groups.map((group) => (
          <div key={group.id}>
            {/* 分组标题 */}
            <div className="flex items-baseline justify-between mb-6 md:mb-8 pb-3 border-b border-border">
              <div className="flex items-baseline gap-3">
                <h2 className="text-base md:text-lg font-light tracking-[0.15em] uppercase text-primary">
                  {group.label}
                </h2>
                <span className="text-xs text-primary-muted">
                  {group.images.length} 张
                </span>
              </div>
            </div>

            {/* 图片网格 — 3 列，移动端 2 列 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {group.images.map((img, idx) => (
                <Link
                  key={`${img.image}-${idx}`}
                  href={img.href}
                  className="group relative block overflow-hidden bg-surface aspect-[4/5]"
                >
                  <img
                    src={img.image}
                    alt={img.nameEn}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* 悬停遮罩 — 只显系列名，不显品牌 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3 md:p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-light text-white tracking-wide block">
                        {img.nameEn}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
