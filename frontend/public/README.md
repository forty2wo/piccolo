# `public/images/` — 图片资源

部署时由 Next.js 直接 serve(`public/` 是 Next 的静态资源根)。

## 目录结构(运行时有效)

| 路径 | 用途 | 引用方 |
|---|---|---|
| `41zero42-website/` | 41zero42 品牌各系列(36 个系列) | `frontend/lib/products-data.json`、`HeroSection.tsx` |
| `opificio-ceramico/` | Opificio Ceramico 品牌(16 个系列) | `frontend/lib/opificio-products.json`、`opificio-collections.ts` |
| `_manifests/` | 对账记录(见 `path-mapping.json`) | 仅文档,不参与运行时 |

## 41zero42-website 子结构

```
41zero42-website/<Series>/<Category>/<File>
```

- **Series**(36 个):Biscuit, Brutus, Chicco, Cosmo, Dandy, Futura, Hops, Italic, Kappa, Milano70, Mou, Nano Gap, Nok, One, Otto, Paper41 Lux / Pro / Up(各 2 个变体), Pietre41 Chevron, Pixel41, Rigo, Solo, Spectre, Stories, Superclassica SCB/SCG/SCW(各 2 个变体), Supreme, Technicolor, Two, WigWag
- **Category**:`cover/`、`swatches/`、`projects/`、`content/` 之一
- **File**:品牌原始命名,例 `41ZERO42_BISCUIT_24_01_BORDEAUX_DUNE_PLAIN_067_OK.jpg`

## Opificio 子结构

```
opificio-ceramico/<Series>/content/<File>
```

- **Series**(16 个):Beat, Biolith, Firenze, Matera, Mediterranea, Murano, Pantelleria, Polignano, Repetit, Reverse, Rondo, Sanremo, Stromboli, Torino, Venezia, Venezia_Cromie
- **File**:品牌原始命名,例 `01_OpificioCeramico_Rain_Clay-2.jpg`,部分系列混有 `biolith_logo_*.png` / `*_icona_*.png` 等 social icon

## 注意事项

- **Linux 大小写敏感**:引用必须用准确大小写,例 `/Biscuit/...` 不是 `/biscuit/...`
- **空格 vs 下划线**:部分系列有别名变体(`Paper41 Lux` 和 `Paper41_Lux` 都存在、都各被引用),**运行时 OK**,但应避免在新增内容时引入更多别名
- **图片资源不进 git**:`frontend/public/images/` 下的 `41zero42-website/` 和 `opificio-ceramico/` 体积大(约 254 MB)、来自外部版权素材,**仅在工作树保留**,不 commit。仓库根 `.gitignore` 已加入 ignore 规则(2026-08-14)。部署时通过 `rsync` 同步(见 `_manifests/path-mapping.json` 的 `deployment_mapping` 段)
- **位置已修正**:Next.js 14 的静态资源根是 `frontend/public/`,不是仓库根 `public/`。代码引用路径 `/images/...` 必须对应物理路径 `frontend/public/images/...`,否则 404。

## 完整对账记录

见 [`_manifests/path-mapping.json`](./_manifests/path-mapping.json)。
