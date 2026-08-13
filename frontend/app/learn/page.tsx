'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

const articles = [
  {
    title: '如何选择适合厨房的瓷砖',
    titleEn: 'How to Choose Tiles for Kitchen',
    excerpt: '厨房是家庭的核心区域，选择合适的瓷砖至关重要...',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    date: '2026-03-28',
  },
  {
    title: '水磨石的复兴：现代设计中的经典材料',
    titleEn: 'The Revival of Terrazzo',
    excerpt: '水磨石作为一种经典材料，在现代设计中焕发新生...',
    image: 'https://images.unsplash.com/photo-1596627689623-8e8f81e6e0c0?w=800&q=80',
    date: '2026-03-25',
  },
  {
    title: '摩洛哥 Zellige 瓷砖的工艺之美',
    titleEn: 'The Craft of Moroccan Zellige',
    excerpt: '探索摩洛哥传统手工瓷砖的制作工艺...',
    image: 'https://images.unsplash.com/photo-1596627689914-7c587573b9cb?w=800&q=80',
    date: '2026-03-20',
  },
]

export default function LearnPage() {
  return (
    <main className="min-h-screen mt-16 md:mt-20">
      <Header />
      
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">灵感与知识</h1>
          <p className="text-gray-600">Cle Notes & Inspiration</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <span className="text-accent font-medium">
                  即将上线
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
