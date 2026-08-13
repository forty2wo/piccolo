# CLAUDE.md - Piccola 项目上下文（AI 入口）

> 最后梳理：2026-08-09 09:21
> 项目位置：`~/.openclaw/workspace-wow/piccola-ecommerce`

## 项目概述

**Piccola** 是高端意大利手工瓷砖的展示 + 询价（选材清单）网站。**不是直接电商交易**——用户浏览系列，加入"选材清单"，提交后由设计团队联系报价。

- 两大品牌：**41zero42**（31 个系列）+ **Opificio Ceramico**（16 个系列），合计 **47 个 collection**
- 静态资源 209 MB（`public/images/41zero42-website/` 175 MB + `opificio-ceramico/` 34 MB）
- 完整选品/技术问答能力由独立 MCP Server 提供（`mcp-server/`）

## 技术栈

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | Next.js 14.1 (App Router, `output: 'standalone'`) | `reactStrictMode: false` |
| 语言 | TypeScript 5.3+ | strict mode |
| 样式 | Tailwind CSS 3.4 + `@tailwindcss/typography` | typography 已装，8 个 page 用 `prose` |
| 数据 | JSON + 适配层 | 无数据库 |
| 状态 | React Context (`cart-context.tsx`) | localStorage 持久化（key=`piccola-cart`） |
| 部署 | Vercel / standalone | `vercel.json` 存在 |

## 颜色系统（tailwind.config.js 实际定义）

```js
colors: {
  primary: { DEFAULT: '#1a1a1a', light: '#6b6b6b', muted: '#999999' },
  border: '#e5e5e5',
  surface: '#fafafa',
  accent: '#8b7355',
}
```

> ⚠️ **不存在** `bg-brand` / `text-brand` / `ring-brand` —— 之前被误用过，已清理。
> 字体栈：`Helvetica Neue` / `Arial` / `PingFang SC` / `Microsoft YaHei` / sans-serif

## 实际项目结构（2026-08-09 摸底）

```
piccola-ecommerce/
├── frontend/                       # Next.js 14 前端（包名 cletile-frontend）
│   ├── app/                        # App Router（20 个路由）
│   │   ├── layout.tsx              # 根布局：<CartProvider><CartSidebar/>
│   │   ├── page.tsx                # 首页：Header + Hero + BrandShowcase + InspireGrid + FeaturedCollections + Footer
│   │   ├── products/[brand]/       # 品牌列表页
│   │   ├── products/[brand]/[collection]/  # 详情页路由（统一走 OpificioDetail）
│   │   ├── collections/            # 全部 47 个 collection 瀑布流
│   │   ├── inspire/                # 灵感图集（瀑布流 + 无限滚动）
│   │   ├── cart/                   # 选材清单落地页（CartSidebar 已侧栏化）
│   │   ├── contact/                # 联系表单
│   │   ├── about/ bestsellers/ careers/ faq/ learn/ new-arrivals/
│   │   └── press/ privacy/ returns/ shipping/ sustainability/ terms/
│   ├── components/                 # 10 个组件（CLAUDE.md 旧版写"13"已修正）
│   │   ├── Header.tsx / Footer.tsx
│   │   ├── HeroSection.tsx         # 首页 hero 3 张图轮播
│   │   ├── BrandShowcase.tsx       # 双品牌卡片
│   │   ├── CollectionsGrid.tsx     # collections 瀑布流 + 品牌筛选 + 搜索
│   │   ├── FeaturedCollections.tsx # 8 个精选系列
│   │   ├── InspireGrid.tsx         # 无限滚动瀑布流
│   │   ├── ProductCard.tsx         # 单品卡
│   │   ├── OpificioDetail.tsx ⭐   # 详情页统一模板（6 段式编辑设计感）
│   │   └── CartSidebar.tsx         # 选材清单侧边栏
│   ├── lib/                        # 数据层（4 个文件，CLAUDE.md 旧版描述正确）
│   │   ├── products-data.json      # 47 个 collection，215 KB
│   │   ├── brand-products.ts       # Product interface + products array + normalizeBrand
│   │   ├── opificio-collections.ts # Opificio 数据 + adaptZero42Product() 适配层
│   │   ├── cart-context.tsx        # 选材清单 Context
│   │   └── README.md               # 数据层说明
│   ├── public/images/              # 209 MB 静态图片
│   │   ├── 41zero42-website/       # 31 个系列，{SeriesName}/{cover,swatches,content,projects}/
│   │   └── opificio-ceramico/      # 16 个系列，{DirName}/content/
│   ├── tailwind.config.js
│   ├── next.config.js              # images.remotePatterns = [unsplash, pexels] + CSP header
│   ├── tsconfig.json               # paths: { "@/*": ["./*"] }
│   └── package.json                # 包名 `cletile-frontend`
├── mcp-server/                     # MCP Server v0.1.0（独立 TS 服务）
│   ├── src/
│   │   ├── index.ts                # 6 tools + 3 resources + 2 prompts
│   │   ├── data.ts                 # 数据加载/搜索/推荐/计算/对比
│   │   ├── prompts/                # 空目录（prompts 内联在 index.ts）
│   │   ├── resources/              # 空目录
│   │   └── tools/                  # 空目录
│   ├── dist/                       # tsc 编译产物
│   ├── tsconfig.json               # ES2022 + Node16 + declaration
│   └── package.json
├── data/                           # 运行时不动；处理中间产物 + 根 products JSON
│   ├── 41zero42-products.json
│   ├── 41zero42-technical-specs.json
│   ├── 41zero42-catalogue-parsed.json
│   ├── 41zero42-pdf-descriptions.json
│   ├── opificio-products.json
│   ├── pdf-extracted-data.json
│   ├── general-catalogue-text.txt
│   └── _legacy/                    # 3 个旧 JSON + 1 README
├── scripts/                        # 4 个活跃 .py + 11 个 _archive/
│   ├── clean-skus.py
│   ├── clean-skus2.py
│   ├── fix-descriptions.py
│   ├── restore-opificio-images.py
│   └── _archive/                   # 11 个历史数据迁移/优化脚本
├── docs/                           # 设计/审计/营销文档
│   ├── CODE-REVIEW-2026-08-03.md   # 最近一次代码审计（21 个 issue）
│   ├── ai-scenarios.md             # 6 个 AI 应用场景规划
│   └── marketing-content-batch-1.md # 第一波营销内容
├── HANDOFF-REPORT.md               # 2026-07-27 交接报告（保留）
├── REVIEW-ISSUES.md                # 三轮审计问题清单（保留）
├── CLAUDE.md                       # 本文件
├── LICENSE
└── README.md                       # 项目入口
```

## 数据流（实际生效）

```
products-data.json (47 个 collection, 215 KB)
  ↓
brand-products.ts (Product interface + products[] + normalizeBrand)
  ↓                          (5 处直接 import: products/[brand]/page, [collection]/page, bestsellers, new-arrivals, CollectionsGrid)
opificio-collections.ts
  ├─ getOpificioCollection()      → Opificio 16 个 collection
  └─ adaptZero42Product()         → 41zero42 31 个 collection 适配为 OpificioCollection
  ↓
OpificioDetail 组件（统一模板，sourceBrand: 'opificio' | '41zero42'）
  ↓
所有 47 个详情页 — 路径：
  /products/opificio-ceramico/[collection]  → getOpificioCollection() → OpificioDetail
  /products/41zero42/[collection]           → getProductByCollection() → adaptZero42Product() → OpificioDetail
```

> **所有 47 个 collection 的详情页都走 `OpificioDetail` 模板**，没有 fallback 模板。
> 2026-08-03 已删除：GalleryIsland / SpecCard / SkuSelector / ProjectShowcase / image-categories / app/inquiry/

## OpificioDetail 6 段式模板

`OpificioDetail` 组件按以下段序渲染（所有 47 个详情页统一）：

1. **Hero** — lifestyle 全屏大图 + 暗化 + 品牌标 + 系列名（中英）+ 设计师署名 + SCROLL 提示
2. **Concept** — 大段引文（designConcept）
3. **Variant 色卡** — 网格缩略图 + `parseVariantFile()` 解析的色号 caption
4. **Lifestyle 故事板** — 拼贴布局（1 大 + 2 中 + 3+ 网格）
5. **Detail 单品** — 缩略图条
6. **Specs + CTA** — 暗色背景规格表 + "加入询价清单" 按钮

`sourceBrand` prop 控制：
- `'opificio'` → `Opificio Ceramico · Italia` 标
- `'41zero42'` → `41zero42 · Italia` 标 + designer 强制为 `Neri&Hu`

## Variant 文件名解析（`opificio-collections.ts`）

`parseVariantFile()` 支持 6 种 regex 模式拆出 `finish / texture / color`：

```
Gloss_Calle_Nebbia_1-scaled.jpg       → { finish: 'Gloss', texture: 'Calle', color: 'Nebbia' }
Matt_Cemento_2-scaled.jpg              → { finish: 'Matt',  texture: '',      color: 'Cemento' }
09_OpificioCeramico_Stromboli_Grigio_Artico.jpg
                                        → { finish: '',     texture: 'Stromboli', color: 'Grigio Artico' }
OpificioCeramico_Rain_Ash-1-1.jpg      → { finish: '',     texture: 'Rain',     color: 'Ash' }
Biscuit_5-scaled.jpg (matera 之类)     → { finish: '',     texture: '',        color: 'Biscuit' }
OC_Stromboli_Grigio_Artico             → 模式 6
```

## Opificio 图片路径

`imageUrl(seriesId, category, file)` 生成路径：

```
/images/opificio-ceramico/{DirName}/content/{file}
```

`DIR_OVERRIDES` 特殊映射：
- `rondo` → `Rondo`
- `venezia-cromie` → `Venezia_Cromie`

其余 id 默认 `seriesId.charAt(0).toUpperCase() + seriesId.slice(1)`。

## 41zero42 图片路径

`products-data.json` 里 file 是**完整路径**（`/images/41zero42-website/{SeriesName}/{category}/{file}`），不需要 `toUrl` 拼路径。

## 路由清单

| 路径 | 文件 | 角色 |
|---|---|---|
| `/` | `app/page.tsx` | 首页 |
| `/products/[brand]` | `app/products/[brand]/page.tsx` | 品牌列表（按 `normalizeBrand` 比对） |
| `/products/[brand]/[collection]` | `app/products/[brand]/[collection]/page.tsx` | 详情页（走 OpificioDetail） |
| `/collections` | `app/collections/page.tsx` | 全部 47 collection 瀑布流 |
| `/inspire` | `app/inspire/page.tsx` | 灵感图集（瀑布流 + 无限滚动 + IntersectionObserver） |
| `/cart` | `app/cart/page.tsx` | 选材清单落地页（实际用 CartSidebar） |
| `/contact` | `app/contact/page.tsx` | 联系表单 |
| `/about` `/bestsellers` `/careers` `/faq` `/learn` `/new-arrivals` `/press` `/privacy` `/returns` `/shipping` `/sustainability` `/terms` | 营销/法律静态页 | 全部 client component，metadata 在 layout.tsx |

## 常用命令

```bash
# 根目录（monorepo 入口）
npm run dev      # → cd frontend && npm run dev (http://localhost:3000)
npm run build    # → cd frontend && npm run build
npm run start    # → cd frontend && npm run start

# frontend/
cd frontend
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # next lint

# mcp-server/
cd mcp-server
npm run build    # tsc
npm start        # node dist/index.js (stdio MCP)
npm run dev      # tsx src/index.ts (开发)
```

## MCP Server 暴露面（v0.1.0）

**6 Tools**:
- `search_collections` — 按 brand/style/material/application/color 筛选
- `get_collection_detail` — 单个系列完整信息
- `recommend_tiles` — 基于需求智能推荐（带评分排序）
- `calculate_quantity` — 铺贴用量+损耗（straight/herringbone/diagonal/brick 等 pattern）
- `get_technical_specs` — 防滑/吸水率/厚度/PEI
- `compare_collections` — 多系列参数对比

**3 Resources**:
- `piccola://products` — 全部产品目录
- `piccola://products/{brand}/{collection_id}` — 单系列详情
- `piccola://specs/{collection_id}` — 技术规格

**2 Prompts**（内联在 `index.ts`）:
- `tile_advisor` — 选品顾问
- `tech_qa` — 技术问答

数据源从 `frontend/lib/*.json` 读取，**首次加载后内存缓存**，不写。

## 已知问题（2026-08-03 审计遗留）

详见 `docs/CODE-REVIEW-2026-08-03.md` 和 `REVIEW-ISSUES.md`。当前活跃 P0/P1：

| 严重度 | 问题 | 位置 |
|---|---|---|
| 🔴 P0 | `/bestsellers` filter 永远空（所有 stock=100） | `app/bestsellers/page.tsx:9` |
| 🔴 P0 | Cottolab 邮箱/400 占位符散落 6 个 page | contact/about/careers/press/privacy/terms/shipping/returns |
| 🟡 P1 | `unoptimized: true` 关闭了 Next.js 图片优化 | （CLAUDE.md 注：实际看 `next.config.js` 已经移除了 unoptimized，✅ 修了） |
| 🟡 P1 | 13 个 page 缺 SEO metadata | 大部分营销/法律页 |
| 🟡 P1 | `reactStrictMode: false` | `next.config.js` |
| 🟢 P2 | Footer "Inspire" href 是 `/collections`（错） | `components/Footer.tsx:19` |
| 🟢 P2 | `mcp-server/data.ts` 第 261 行 `spec.peatRating` typo | （应 `spec.peiRating`） |

## 不要再犯的坑

1. ❌ 别用 `bg-brand` / `text-brand` / `ring-brand`（不存在）
2. ❌ 别用 CSS `backgroundImage` 加载图（5 个组件以前犯过）
3. ❌ 别从 `frontend/lib/products-data.json` 之外的路径加载产品数据
4. ❌ 别再建 fallback 详情页模板——所有 47 个 collection 都走 `OpificioDetail`
5. ✅ 改产品数据只改 `frontend/lib/products-data.json`（这是唯一数据源）
6. ✅ 新增产品图放 `frontend/public/images/41zero42-website/{SeriesName}/{category}/`
7. ✅ 写 client component 的 metadata 必须放 `layout.tsx`（page 是 client 不能 export metadata）
