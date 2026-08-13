# `lib/` 数据层说明

> 最后更新：2026-08-09（与新版 `CLAUDE.md` 对齐）

## 数据流（实际）

```
products-data.json  (47 个产品的扁平数据，215 KB)
        ↓
brand-products.ts  (数据加载层：Product interface + products array + normalizeBrand)
        ↓
opificio-collections.ts  (适配层：Opificio 数据 + adaptZero42Product → OpificioDetail)
        ↓
页面 & 组件（所有 47 个详情页走 OpificioDetail）
```

## 文件

| 文件 | 作用 | 状态 |
|------|------|------|
| `products-data.json` | 唯一数据源（41zero42 + Opificio Ceramico 47 个 collection） | ✅ 活跃 |
| `brand-products.ts` | 数据加载层：`Product` interface + `products` array + `normalizeBrand` + `getProductByCollection` + `getProductsByBrand` + `getAllBrands` | ✅ 活跃（5 处 import） |
| `opificio-collections.ts` | 适配层：`getOpificioCollection` / `adaptZero42Product` / `flattenImages` / `imageUrl` / `parseVariantFile` → `OpificioDetail` | ✅ 活跃 |
| `cart-context.tsx` | 选材清单 React Context（`useCart` hook + localStorage 持久化） | ✅ 活跃 |
| `41zero42-technical-specs.json` | 41zero42 技术参数（mcp-server 用） | ✅ 活跃 |
| `opificio-products.json` | Opificio 16 个 collection 结构化数据 | ✅ 活跃 |

## 关键适配逻辑

### `brand-products.ts` — 数据加载层

- 导出 `Product` interface（id/name/nameEn/price/size/description/descriptionEn/image/images/stock/specs/brand/collection/designConcept/nameCn/applications/style/colorFamily/projects/longDescription/skus）
- 导出 `products: Product[]`（47 个 collection，扁平 array）
- `normalizeBrand(brand)`：解码 + 转小写 + 空格转 `-`（统一 `"Opificio Ceramico"` ↔ `"opificio-ceramico"`）
- `getProductByCollection(brand, collection)` / `getProductsByBrand(brand)` / `getAllBrands()`

**5 处 import**（CLAUDE.md 详细列出）：
- `app/products/[brand]/page.tsx`
- `app/products/[brand]/[collection]/page.tsx`
- `app/bestsellers/page.tsx`
- `app/new-arrivals/page.tsx`
- `components/CollectionsGrid.tsx`

> 注意：`opificio-collections.ts` 提供了等价的 `listOpificioCollections` / `getOpificioCollection` / `adaptZero42Product`，未来可考虑把这 5 处迁过去（见 `REVIEW-ISSUES.md` P1#7）。

### `opificio-collections.ts` — 适配层

#### `getOpificioCollection(id)` / `listOpificioCollections()`
直接读 `opificio-products.json`，返回 `OpificioCollection[]`（16 个）。

#### `adaptZero42Product(p: Product): OpificioCollection`
把 41zero42 的 `Product` 适配成 `OpificioCollection`：
- 设计师强制设为 `Neri&Hu`
- `images.cover/variant/detail/designer/other` 都设为 `EMPTY_SET`
- `images.lifestyle` = 41zero42 全部图（无 cover/variant/detail 分类）
- `sizes` 从 `p.size`（逗号分隔）拆开
- `specs` 映射到 `technology` / `finishes` / `thickness` / `materialCategory`

#### `imageUrl(seriesId, category, file)` / `DIR_OVERRIDES`
生成 `/images/opificio-ceramico/{DirName}/content/{file}`，特殊映射：
- `rondo` → `Rondo`
- `venezia-cromie` → `Venezia_Cromie`

#### `parseVariantFile(file)` — Variant 文件名解析
6 种 regex 模式拆出 `{ finish, texture, color, fullLabel }`：
1. `Gloss_Calle_Nebbia_1-scaled.jpg` → `{ Gloss, Calle, Nebbia }`
2. `Matt_Cemento_2-scaled.jpg` → `{ Matt, '', Cemento }`
3. `09_OpificioCeramico_Stromboli_Grigio_Artico.jpg` → `{ '', Stromboli, 'Grigio Artico' }`
4. `OpificioCeramico_Rain_Ash-1-1.jpg` → `{ '', Rain, Ash }`
5. `Biscuit_5-scaled.jpg`（matera 之类）→ `{ '', '', Biscuit }`
6. `OC_Stromboli_Grigio_Artico` → 模式 6

#### `flattenImages(c)` — 展开 collection 所有图片
返回 `{ hero, lifestyle, variant, detail }`，给 `OpificioDetail` 用：
- `hero` 从 cover → lifestyle[0] → variant[0] 依次取
- `lifestyle` 跳过 hero 那张
- `variant` 带 `parseVariantFile` 解析出的 `label`
- `detail` 原样映射

### `cart-context.tsx` — 选材清单 Context

- `CartItem` 字段：`id / collectionId / collectionName / collectionNameEn / image / brand / quantity / addedAt`
- `useCart()` hook 返回：`items / addToCart / removeFromCart / updateQuantity / clearCart / totalItems / isOpen / setIsOpen`
- **localStorage 持久化**（key=`piccola-cart`），刷新页面不丢
- addToCart 已存在的 item 自动 +1 数量；自动打开侧边栏

## 已删除（清理记录）

| 文件 | 删除原因 | 日期 |
|------|----------|------|
| `image-categories.ts` | 死代码（仅被已删的 GalleryIsland 引用） | 2026-08-03 |
| `products.ts.archive` | 旧归档 | 2026-08-03 |
| `store.ts` | 旧 zustand store（zustand 已从依赖移除） | 2026-08-03 |

## 架构说明

- `brand-products.ts` 是数据加载层，提供原始 Product 数据（47 个 collection）
- `opificio-collections.ts` 是适配层，把数据转换为 `OpificioCollection` 格式供 `OpificioDetail` 组件使用
- 所有产品详情页都走 `OpificioDetail` 模板（统一编辑设计感风格）
- 购物车是"选材清单"（询价流程），不涉及价格展示
