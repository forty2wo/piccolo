import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpificioDetail from '@/components/OpificioDetail';
import { getOpificioCollection, adaptZero42Product } from '@/lib/opificio-collections';
import { products, normalizeBrand, getProductByCollection } from '@/lib/brand-products';
import type { Metadata } from 'next';

interface PageProps {
  params: { brand: string; collection: string };
  searchParams?: { size?: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { brand, collection: collectionId } = params;
  const decodedCollectionId = decodeURIComponent(collectionId);
  const collection = products.find(p =>
    normalizeBrand(p.brand) === normalizeBrand(brand) && p.collection === decodedCollectionId
  );
  if (!collection) return { title: '系列未找到' };

  const ogImage = collection.images?.[0] || collection.image;

  return {
    title: `${collection.name} | ${collection.brand} - Piccola`,
    description: collection.description?.slice(0, 160),
    openGraph: {
      title: `${collection.name} | ${collection.brand} - Piccola`,
      description: collection.description?.slice(0, 160),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

export default function CollectionDetailPage({ params }: PageProps) {
  const { brand, collection: collectionId } = params;
  const decodedCollectionId = decodeURIComponent(collectionId);

  // Opificio 走 OpificioDetail 模板
  const opificioCollection = normalizeBrand(brand) === 'opificio-ceramico' ? getOpificioCollection(decodedCollectionId) : undefined;
  if (opificioCollection) {
    return <OpificioDetail collection={opificioCollection} sourceBrand="opificio" />;
  }

  // 41zero42 也走 OpificioDetail（数据从 products-data.json 适配）
  const zero42Product = getProductByCollection(brand, decodedCollectionId);
  if (zero42Product) {
    return <OpificioDetail collection={adaptZero42Product(zero42Product)} sourceBrand="41zero42" />;
  }

  // 系列未找到
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      <div className="container py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">系列未找到</h1>
        <p className="text-gray-500 mb-6">抱歉，该系列不存在</p>
        <Link
          href="/collections"
          className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
        >
          返回系列列表
        </Link>
      </div>
      <Footer />
    </main>
  );
}
