'use client'

import Link from 'next/link'
import Image from 'next/image'

// Static cover — Piccola 是策展平台，不是品牌聚合站，不需要轮播。
// 选用 Kappa（41zero42 经典小砖/马赛克系列）作为 Hero 图：
//   - 主色沙土暖调 (#91705a)，与暖米底 #F7F3ED 同色温，不会“砸”色
//   - 1733x2000 portrait 比例，与左 55% 分栏布局完美匹配
//   - 中等亮度 119、有质感（不过亮也不压暗）
//   - 重复复用率低（精选 6 张卡片中未使用该图，避免 Hero 与卡片撞图）
// 替换：原 Stories 系列封面包含静物（烟灰缸、烟头），与策展调性冲突。
const heroImage = '/images/41zero42-website/Kappa/cover/kappa-15.jpg'

export default function HeroSection() {
  return (
    <section className="bg-warm-paper">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] min-h-[85vh] md:min-h-[90vh]">
        {/* 左：大图，缓慢淡入 + 极轻 scale。替代轮播。 */}
        <div className="relative overflow-hidden bg-warm-cream aspect-[4/3] md:aspect-auto order-1">
          <Image
            src={heroImage}
            alt="意大利手工瓷砖作品"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            className="object-cover animate-[heroFade_1800ms_ease-out_forwards] motion-reduce:animate-none"
          />
        </div>

        {/* 右：暖米色文字区 */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-0 order-2">
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent mb-6">
            Piccola · 策展
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-primary leading-[1.2]">
            意大利手工瓷砖<br />
            当代艺术表达
          </h1>
          <p className="mt-6 text-sm md:text-[15px] text-primary-light max-w-md leading-relaxed font-light">
            精选自意大利工坊与设计系列的小规格作品，
            每一枚都为空间的光影与触感而生。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {/* 主 CTA */}
            <Link
              href="/collections"
              className="px-8 py-3.5 bg-primary text-white text-xs tracking-[0.15em] uppercase hover:bg-warm-text transition-colors duration-300"
            >
              探索系列
            </Link>
            {/* 次 CTA：申请样品，轻量入口 */}
            <Link
              href="/contact?intent=sample"
              className="text-xs tracking-[0.15em] uppercase text-primary border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors duration-300"
            >
              申请样品
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
