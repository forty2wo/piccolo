# `data/_legacy/` — 历史数据存档

此目录下的 JSON 文件**已不被前端运行时引用**,仅作历史元数据存档保留。

## 文件清单

| 文件 | 状态 | 引用方 | 备注 |
|---|---|---|---|
| `41zero42-optimized-images.json` | 1044 条图片路径元数据 | 0 个 import | 图片源(PDF 自动抽取序列号命名)已删除,JSON 仅作存档 |
| `41zero42-pdf-images.json` | 225 条 PDF 图元数据 + 9 条短路径 | 0 个 import | 同上 |
| `41zero42-skus-template.json` | 42 条短路径模板 | 0 个 import | 早期数据格式,前端未采用 |

## 为什么移到 `_legacy/`

- 仓库内**没有任何 .ts/.tsx/.js/.jsx 文件 import 这些 JSON**(`grep` 已验证)
- 这些 JSON 里的图片路径(`/images/41zero42-optimized/...`、`/images/41zero42-pdf/...`、`/images/41zero42/<lowercase>/...`)在 `public/images/` 下都已不存在
- 即使修改 JSON 中的路径前缀,因命名风格不同(PDF 序列号 vs 品牌原始名),改完依然 404
- 移到 `_legacy/` 明确"存档"语义,避免未来误以为是运行时配置

## 不要

- ❌ 不要在新代码中 import 此目录的 JSON
- ❌ 不要把这里的图片路径当作"有效资源"对待

## 可以

- ✅ 作为"数据来源历史"参考(为什么某些系列在 `products-data.json` 里是这样组织的)
- ✅ 用脚本批量处理后另存为新格式(例:解析 `41zero42-optimized-images.json` 的 size 字段、提取到 `lib/`)
- ✅ 如未来从版权方获得新的优化图,可在此基础上重建 `_optimized/`

## 命名风格对照(作存档)

| 命名风格 | 例子 | 存在位置 |
|---|---|---|
| 品牌原始命名 | `41ZERO42_BISCUIT_24_01_BORDEAUX_DUNE_PLAIN_067_OK.jpg` | `public/images/41zero42-website/Biscuit/cover/` |
| PDF 序列号 | `page002_img000.webp` | (已删除,仅 `41zero42-optimized-images.json` 记录) |
| 早期短路径 | `/41zero42/biscuit/cover.jpg` | (已删除,仅 `41zero42-skus-template.json` 记录) |

后两种命名规范下的图都**已物理删除**。`public/images/41zero42-website/` 和 `opificio-ceramico/` 是唯一保留的真实图片资源。
