// opificio-collections.ts
// 从 data/opificio-products.json 读取 opificio 数据, 提供按分类的图片 URL 数组

import data from './opificio-products.json'
import type { Product } from '@/lib/brand-products'

export interface OpificioImageSet {
  count: number
  files: string[]
}

export interface OpificioCollection {
  id: string
  name: string
  nameCn: string
  sourceUrl: string
  status: 'active' | 'draft'
  designConcept: string
  designer: string
  technology: string
  finishes: string[]
  thickness: string
  materialCategory: string
  colorFamily: string[]
  applications: string[]
  style: string[]
  features: string[]
  images: {
    cover: OpificioImageSet
    lifestyle: OpificioImageSet
    variant: OpificioImageSet
    detail: OpificioImageSet
    designer: OpificioImageSet
    other: OpificioImageSet
  }
  // 可选
  sizes?: string[]
  patterns?: string[]
  textures?: string[]
  size?: string
}

const collections = (data as { collections: OpificioCollection[] }).collections

// 实际图片在 /images/opificio-ceramico/{DirName}/content/{file}
// collection id -> 目录名映射（大部分首字母大写即可，特殊映射如下）
const DIR_OVERRIDES: Record<string, string> = {
  'rondo': 'Rondo',       // id 去重音
  'venezia-cromie': 'Venezia_Cromie',  // 连字符 -> 下划线
}

function getDirName(seriesId: string): string {
  if (DIR_OVERRIDES[seriesId]) return DIR_OVERRIDES[seriesId]
  // 默认: 首字母大写
  return seriesId.charAt(0).toUpperCase() + seriesId.slice(1)
}

const IMG_BASE = '/images/opificio-ceramico'

/** 把相对文件路径转成完整 URL: /images/opificio-ceramico/{DirName}/content/{file} */
export function imageUrl(seriesId: string, _category: string, file: string): string {
  return `${IMG_BASE}/${getDirName(seriesId)}/content/${file}`
}

/** 列表查询 - 同步 */
export function listOpificioCollections(): OpificioCollection[] {
  return collections
}

/** 单条查询 - 同步 */
export function getOpificioCollection(id: string): OpificioCollection | undefined {
  return collections.find(c => c.id === id)
}

/** 把 category 数组展开成 [{url, category, file, label}] 列表, 用于色卡/故事板渲染 */
export interface FlatImage {
  url: string
  category: 'cover' | 'lifestyle' | 'variant' | 'detail' | 'designer' | 'other'
  file: string
  /** 解析出的色号 caption (variant 才有) */
  label?: string
  /** 是否首图 */
  hero?: boolean
}

/** 从 variant 文件名拆出 finish + texture + color 三段
 *  例子:
 *    Gloss_Calle_Nebbia_1-scaled.jpg    -> { finish: 'Gloss', texture: 'Calle', color: 'Nebbia' }
 *    Matt_Cemento_2-scaled.jpg           -> { finish: 'Matt', texture: '', color: 'Cemento' }
 *    09_OpificioCeramico_Stromboli_Grigio_Artico.jpg
 *                                        -> { finish: '', texture: 'Stromboli', color: 'Grigio Artico' }
 */
export interface ParsedVariant {
  finish: string  // Gloss / Matt / Satin
  texture: string // 纹理名
  color: string   // 颜色名
  fullLabel: string
}

export function parseVariantFile(file: string): ParsedVariant | null {
  // 模式 1: Gloss_Calle_Nebbia_1-scaled.jpg
  let m = file.match(/^(Gloss|Matt|Satin)_([A-Z][a-zàèìòù]+)_([A-Z][a-zàèìòù]+)(?:_\d+)?(?:-scaled)?\.jpg$/i)
  if (m) {
    const [, finish, texture, color] = m
    return { finish, texture, color, fullLabel: `${finish} ${texture} ${color}` }
  }
  // 模式 2: Gloss_Calle_Nebbia.jpg (无数字)
  m = file.match(/^(Gloss|Matt|Satin)_([A-Z][a-zàèìòù]+)_([A-Z][a-zàèìòù]+)\.jpg$/i)
  if (m) {
    const [, finish, texture, color] = m
    return { finish, texture, color, fullLabel: `${finish} ${texture} ${color}` }
  }
  // 模式 3: 09_OpificioCeramico_Stromboli_Grigio_Artico.jpg
  m = file.match(/^\d+_OpificioCeramico_([A-Z][a-zàèìòù]+)_([A-Z][a-zàèìòù]+(?:_[A-Z][a-zàèìòù]+)?)\.jpg$/i)
  if (m) {
    const [, texture, color] = m
    return { finish: '', texture, color, fullLabel: `${texture} ${color}` }
  }
  // 模式 4: OpificioCeramico_Rain_Ash-1-1.jpg
  m = file.match(/^OpificioCeramico_([A-Z][a-zàèìòù]+)_([A-Z][a-zàìòù]+)(?:-\d+)?\.jpg$/i)
  if (m) {
    const [, texture, color] = m
    return { finish: '', texture, color, fullLabel: `${texture} ${color}` }
  }
  // 模式 5: {color}_{N}-scaled.jpg (matera)
  m = file.match(/^([A-Z][a-zàèìòù]+)_\d+-scaled\.jpg$/i)
  if (m) {
    const [, color] = m
    return { finish: '', texture: '', color, fullLabel: color }
  }
  // 模式 6: OC_Stromboli_Grigio_Artico
  return null
}

/** 把 file 转成 url: 已经是 /images/ 开头的绝对路径直接用, 否则拼 IMG_BASE
 *  41zero42 数据里 file 是完整路径 (/images/41zero42-website/...), opifico 是裸文件名 */
function toUrl(seriesId: string, category: string, file: string): string {
  return file.startsWith('/images/') ? file : imageUrl(seriesId, category, file)
}

/** 展开 collection 的所有图片, 带色号 caption */
export function flattenImages(c: OpificioCollection): {
  hero: FlatImage | null
  lifestyle: FlatImage[]
  variant: FlatImage[]
  detail: FlatImage[]
} {
  const hero =
    c.images.cover.files[0] ? {
      url: toUrl(c.id, 'cover', c.images.cover.files[0]),
      category: 'cover' as const,
      file: c.images.cover.files[0],
      hero: true,
    } : c.images.lifestyle.files[0] ? {
      url: toUrl(c.id, 'lifestyle', c.images.lifestyle.files[0]),
      category: 'lifestyle' as const,
      file: c.images.lifestyle.files[0],
      hero: true,
    } : c.images.variant.files[0] ? {
      url: toUrl(c.id, 'variant', c.images.variant.files[0]),
      category: 'variant' as const,
      file: c.images.variant.files[0],
      hero: true,
    } : null

  const lifestyle = c.images.lifestyle.files.slice(1).map(file => ({
    url: toUrl(c.id, 'lifestyle', file),
    category: 'lifestyle' as const,
    file,
  }))

  const variant = c.images.variant.files.map(file => {
    const parsed = parseVariantFile(file)
    return {
      url: toUrl(c.id, 'variant', file),
      category: 'variant' as const,
      file,
      label: parsed?.fullLabel,
    }
  })

  const detail = c.images.detail.files.map(file => ({
    url: toUrl(c.id, 'detail', file),
    category: 'detail' as const,
    file,
  }))

  return { hero, lifestyle, variant, detail }
}

/** 通过 collection id 拿到 URL 列表 - 给 ImageGallery 兼容用 */
export function getAllImageUrls(c: OpificioCollection): string[] {
  const order: (keyof OpificioCollection['images'])[] = ['cover', 'lifestyle', 'variant', 'detail', 'designer']
  const urls: string[] = []
  for (const cat of order) {
    for (const file of c.images[cat].files) {
      urls.push(imageUrl(c.id, cat, file))
    }
  }
  return urls
}

// =====================================================================
// 41zero42 适配层 - 把 products-data.json 里的 Product 映射成 OpificioCollection
// 让 OpificioDetail 组件能被两个品牌复用, 风格统一
// =====================================================================

const EMPTY_SET: OpificioImageSet = { count: 0, files: [] }

/** 把 41zero42 的 Product 适配成 OpificioCollection */
export function adaptZero42Product(p: Product): OpificioCollection {
  const sizes = (p.size || '').split(',').map(s => s.trim()).filter(Boolean)

  return {
    id: String(p.id),
    name: p.nameEn || p.name,
    nameCn: p.nameCn || p.name,
    sourceUrl: '',
    status: 'active',
    // Concept 段: 中文长描述
    designConcept: p.description || '',
    // 41zero42 品牌设计师: Neri&Hu
    designer: 'Neri&Hu',
    // specs 映射
    technology: p.specs?.['工艺'] || '',
    finishes: p.specs?.['表面处理'] ? [p.specs['表面处理']] : [],
    thickness: p.specs?.['厚度'] || '',
    materialCategory: p.specs?.['材质'] || '',
    colorFamily: p.colorFamily || [],
    applications: p.applications || [],
    style: p.style || [],
    features: [],
    images: {
      cover: EMPTY_SET,
      // 41zero42 全部图当 lifestyle (无 cover/variant/detail 分类, 走通用图集)
      lifestyle: { count: p.images?.length || 0, files: p.images || [] },
      variant: EMPTY_SET,
      detail: EMPTY_SET,
      designer: EMPTY_SET,
      other: EMPTY_SET,
    },
    sizes: sizes.length > 0 ? sizes : undefined,
    size: p.size,
  }
}
