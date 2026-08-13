'use client'

import Link from 'next/link'
import Image from 'next/image'
import { normalizeBrand } from '@/lib/brand-products'

interface ProductCardProps {
  product: {
    id: number
    name: string
    nameEn: string
    price: number
    brand: string
    collection: string
    image: string
    stock: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${normalizeBrand(product.brand)}/${product.collection}`}
      className="group block"
    >
      <div className="aspect-square overflow-hidden bg-surface mb-4 relative">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.brand}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.stock > 0 && product.stock < 50 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary text-white text-[10px] tracking-wider uppercase z-10">
            热销
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary-muted text-white text-[10px] tracking-wider uppercase z-10">
            缺货
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-normal text-primary mb-0.5 group-hover:text-primary-light transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-primary-muted mb-2">{product.nameEn}</p>
        <p className="text-xs text-primary-muted mb-2">{product.brand}</p>
        {product.price > 0 ? (
          <p className="text-sm text-primary">
            ¥{product.price}
            <span className="text-xs text-primary-muted font-normal ml-0.5">/㎡</span>
          </p>
        ) : (
          <p className="text-sm text-accent">
            询价
          </p>
        )}
      </div>
    </Link>
  )
}
