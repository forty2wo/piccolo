import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, normalizeBrand } from '@/lib/brand-products';
import type { Metadata } from 'next';

interface PageProps {
  params: { brand: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const brand = decodeURIComponent(params.brand);
  const brandProducts = products.filter(p => normalizeBrand(p.brand) === normalizeBrand(brand));
  if (brandProducts.length === 0) return { title: '品牌未找到' };
  const brandName = brandProducts[0].brand;
  return {
    title: `${brandName} 系列列表 - Piccola`,
    description: `浏览 ${brandName} 旗下全部 ${brandProducts.length} 个系列`,
  };
}

export default function BrandPage({ params }: PageProps) {
  const brand = decodeURIComponent(params.brand);
  const brandProducts = products.filter(p => normalizeBrand(p.brand) === normalizeBrand(brand));

  if (brandProducts.length === 0) {
    return (
      <main className="min-h-screen mt-16 md:mt-20">
        <Header />
        <div className="container py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">品牌未找到</h1>
          <p className="text-gray-500 mb-6">抱歉，该品牌不存在</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            返回全部系列
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const brandName = brandProducts[0].brand;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container pt-24 md:pt-28 pb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gray-600 transition-colors shrink-0">首页</Link>
          <span className="shrink-0">/</span>
          <Link href="/collections" className="hover:text-gray-600 transition-colors shrink-0">系列</Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-700 shrink-0">{brandName}</span>
        </nav>
      </div>

      <section className="container pb-12 md:pb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
          {brandName}
        </h1>
        <p className="text-gray-500">{brandProducts.length} 个系列</p>
      </section>

      <section className="container pb-20 md:pb-28">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {brandProducts.map((product) => (
            <Link
              key={product.collection}
              href={`/products/${normalizeBrand(product.brand)}/${product.collection}`}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-3 relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.nameCn || product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                    📦
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-primary mb-1 group-hover:text-accent-gold transition-colors duration-300">
                {product.nameCn || product.name}
              </h3>
              <p className="text-xs text-[#8c8c8c]">{product.nameEn}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
