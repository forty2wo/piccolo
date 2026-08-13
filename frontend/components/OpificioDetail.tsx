'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import FadeIn from './FadeIn';
import { OpificioCollection, FlatImage, getOpificioCollection, flattenImages } from '@/lib/opificio-collections';

interface OpificioDetailProps {
  collection: OpificioCollection;
  /** 源品牌 - 控制 addToCart / hero 品牌标. 默认 'opificio'. 41zero42 适配器传 '41zero42' */
  sourceBrand?: 'opificio' | '41zero42';
}

/**
 * Opificio 详情页 - 编辑设计感模板
 *
 * 段序:
 * 1. Hero - lifestyle 全屏大图, 暗化, 设计师署名
 * 2. Concept - 大段引文 (如果有)
 * 3. Variant 色卡 - 网格缩略图 + 色号 caption
 * 4. Lifestyle 故事板 - 2~3 张大图, 拼贴
 * 5. Detail 单品 - 缩略图条
 * 6. Specs + CTA
 */
export default function OpificioDetail({ collection, sourceBrand = 'opificio' }: OpificioDetailProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<FlatImage | null>(null);

  const { hero, lifestyle, variant, detail } = flattenImages(collection);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: `${sourceBrand}-${collection.id}`,
      collectionId: collection.id,
      collectionName: collection.name,
      collectionNameEn: collection.name,
      image: hero?.url || '',
      brand: sourceBrand,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#1a1a1a]">
      {/* ===== 1. Hero - lifestyle 全屏 ===== */}
      {hero && (
        <section className="relative h-screen min-h-[640px] overflow-hidden">
          <Image
            src={hero.url}
            alt={collection.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
          <div className="relative h-full flex flex-col justify-between p-8 md:p-16">
            {/* 顶部留白 — 品牌信息下移到底部 / Specifications，不再以 Hero 品牌标出现 */}
            <div />

            {/* 底部系列名 */}
            <div className="max-w-4xl">
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase mb-4 font-light">
                Collection
              </p>
              <h1 className="font-serif text-6xl md:text-8xl text-white mb-3 leading-none">
                {collection.name}
              </h1>
              {collection.nameCn && (
                <p className="text-white/80 text-xl md:text-2xl font-light tracking-widest mb-8">
                  {collection.nameCn}
                </p>
              )}
              {collection.designer && (
                <p className="text-white/60 text-sm tracking-wide">
                  {collection.designer}
                </p>
              )}
              {/* 原产地信息（弱化品牌） */}
              <p className="mt-4 text-white/40 text-[11px] tracking-[0.15em] uppercase">
                Made in Italy
              </p>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.3em] animate-pulse">
            SCROLL
          </div>
        </section>
      )}

      {/* ===== 2. Concept - 设计概念引文 ===== */}
      {collection.designConcept && (
        <FadeIn delay={100} offset={70}>
          <section className="py-20 md:py-32 px-6 md:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-8">
              The Concept
            </p>
            <blockquote className="font-serif text-2xl md:text-4xl leading-relaxed text-[#1a1a1a] italic">
              &ldquo;{collection.designConcept}&rdquo;
            </blockquote>
            {collection.designer && (
              <p className="mt-8 text-sm text-[#5a5a5a] tracking-wide">
                — {collection.designer}
              </p>
            )}
          </div>
        </section>
        </FadeIn>
      )}

      {/* ===== 3. Variant 色卡 - 网格 + 色号 caption ===== */}
      {variant.length > 0 && (
        <FadeIn delay={100} offset={70}>
          <section className="py-12 md:py-20 px-6 md:px-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-3">
                Color Palette
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
                色彩变体
              </h2>
              <p className="mt-3 text-sm text-[#5a5a5a]">
                {variant.length} 种色彩 · 点击查看大图
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {variant.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(v)}
                  className="group text-left"
                >
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
        </FadeIn>
      )}

      {/* ===== 4. Lifestyle 故事板 - 拼贴 ===== */}
      {/* ===== 4. Lifestyle 故事板 - 拼贴 ===== */}
      {lifestyle.length > 0 && (
        <FadeIn delay={100} offset={70}>
          <section className="py-12 md:py-20 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-3">
                In Space
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
                空间故事
              </h2>
            </div>

            {/* 拼贴布局: 第 1 张大, 第 2-3 张中, 第 4+ 张网格 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {lifestyle.slice(0, 2).map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden bg-[#f0ebe3] ${
                    i === 0 ? 'md:col-span-7 aspect-[4/3]' : 'md:col-span-5 aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={collection.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              ))}

              {lifestyle.slice(2, 5).map((img, i) => (
                <div
                  key={i + 2}
                  className="relative overflow-hidden bg-[#f0ebe3] md:col-span-4 aspect-[4/5]"
                >
                  <Image
                    src={img.url}
                    alt={collection.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}

              {lifestyle.slice(5).map((img, i) => (
                <div
                  key={i + 5}
                  className="relative overflow-hidden bg-[#f0ebe3] md:col-span-4 aspect-square"
                >
                  <Image
                    src={img.url}
                    alt={collection.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        </FadeIn>
      )}

      {/* ===== 5. Detail 单品图条 ===== */}
      {detail.length > 0 && (
        <FadeIn delay={100} offset={70}>
          <section className="py-12 md:py-20 px-6 md:px-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a7a5a] mb-6">
              Product Detail
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {detail.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(img)}
                  className="relative aspect-square overflow-hidden bg-[#f0ebe3] group"
                >
                  <Image
                    src={img.url}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
        </FadeIn>
      )}

      {/* ===== 6. Specs + CTA ===== */}
      <FadeIn delay={100} offset={80}>
        <section className="py-20 md:py-32 px-6 md:px-16 bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* 规格表 */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">
                Specifications
              </p>
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
                {/* 工厂信息（弱化品牌，但保留 fact 供需要者查找） */}
                <div className="flex border-b border-white/10 pb-4">
                  <dt className="w-1/3 text-white/50">Factory</dt>
                  <dd className="flex-1 text-white/70 text-xs tracking-wide">
                    {sourceBrand === 'opificio' ? 'Opificio Ceramico' : '41zero42'} · Italy
                  </dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                心仪此系列？
              </h2>
              <p className="text-white/70 leading-relaxed mb-10 max-w-md">
                将系列加入询价清单，我们的设计师团队将为您提供专属建议与样品支持。
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-[#1a1a1a] font-medium tracking-wide transition-all hover:bg-[#f0ebe3] ${
                    isAdding ? 'opacity-75' : ''
                  }`}
                >
                  {isAdding ? '✓ 已加入询价清单' : '加入询价清单'}
                </button>
                <div>
                  <Link
                    href="/contact"
                    className="text-sm text-white/60 hover:text-white border-b border-white/30 pb-1"
                  >
                    或直接联系设计师 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </FadeIn>

      {/* ===== Lightbox ===== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.label || collection.name}
              width={1400}
              height={1400}
              className="max-w-full max-h-[80vh] object-contain"
              unoptimized
            />
            {lightbox.label && (
              <p className="text-white/80 text-sm text-center mt-4 tracking-wide">
                {lightbox.label}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
