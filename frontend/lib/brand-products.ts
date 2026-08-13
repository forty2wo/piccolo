// 品牌产品数据 - 41zero42 & Opificio Ceramico
// 自动生成于 2026-08-01T13:30:00+08:00
// 共 47 个系列
// 数据来源: 网站爬取 + PDF解析 (catalogue + info-tech)
// SKU: 从总目录PDF Specifications章节 + 系列info-tech PDF提取

import productsData from './products-data.json'

export interface Product {
  id: number
  name: string
  nameEn: string
  price: number
  size: string
  description: string
  descriptionEn: string
  image: string
  images: string[]
  stock: number
  specs: Record<string, string>
  brand: string
  collection: string
  designConcept?: string
  nameCn?: string
  applications?: string[]
  style?: string[]
  colorFamily?: string[]
  projects?: Array<{ title: string; image: string; link?: string }>
  longDescription?: string
  skus?: Array<{
    skuCode: string
    size: string
    colorName: string
  }>
}

export function normalizeBrand(brand: string): string {
  return decodeURIComponent(brand).toLowerCase().replace(/\s+/g, '-')
}

export const products: Product[] = productsData as Product[]

export function getProductByCollection(brand: string, collection: string): Product | undefined {
  const nb = normalizeBrand(brand)
  const nc = collection.toLowerCase().replace(/\s+/g, '-')
  return products.find(p => normalizeBrand(p.brand) === nb && p.collection.toLowerCase().replace(/\s+/g, '-') === nc)
}

export function getProductsByBrand(brand: string): Product[] {
  const nb = normalizeBrand(brand)
  return products.filter(p => normalizeBrand(p.brand) === nb)
}

export function getAllBrands(): string[] {
  return Array.from(new Set(products.map(p => p.brand)))
}
