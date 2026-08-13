# Piccola — 高端意大利手工瓷砖

> **展示 + 选材清单询价** 网站（非在线交易）
> 两大品牌：**41zero42**（31 系列）+ **Opificio Ceramico**（16 系列），合计 **47 个 collection**

## 快速开始

```bash
# 根目录（monorepo 入口）
npm run dev      # → cd frontend && npm run dev → http://localhost:3000
npm run build    # 生产构建（Next.js standalone）
npm run start    # 启动生产服务器

# MCP Server（AI 选品/技术问答）
cd mcp-server
npm install && npm run build && npm start    # stdio 模式
npm run dev                                  # tsx 开发模式
```

## 项目结构

```
piccola-ecommerce/
├── frontend/                 # Next.js 14 前端（包名 cletile-frontend）
│   ├── app/                  # App Router · 20 个路由
│   ├── components/           # 10 个组件（含 OpificioDetail 详情页统一模板）
│   ├── lib/                  # 数据层：products-data.json + brand-products.ts + opificio-collections.ts + cart-context.tsx
│   └── public/images/        # 209 MB 静态图片
├── mcp-server/               # 独立 MCP Server v0.1.0（6 tools + 3 resources + 2 prompts）
├── data/                     # 数据处理中间产物（运行时不动）
├── scripts/                  # 4 个活跃 .py + 11 个 _archive/ 历史脚本
├── docs/                     # 设计/审计/营销文档
├── CLAUDE.md                 # ⭐ AI 入口（项目上下文、技术栈、数据流、已知问题）
├── HANDOFF-REPORT.md         # 2026-07-27 交接报告（保留）
├── REVIEW-ISSUES.md          # 三轮审计问题清单（保留）
└── README.md                 # 本文件
```

## 业务模式

- **不是电商交易** —— 用户浏览系列详情，加入"选材清单"，提交后由设计团队联系报价
- 选材清单数据存浏览器 `localStorage`（key=`piccola-cart`）
- "购物车"= 选材清单（B2B 询价流程，不显示价格）

## 数据流

```
frontend/lib/products-data.json (47 个 collection, 215 KB)
  ↓
frontend/lib/brand-products.ts (Product interface + products array + normalizeBrand)
  ↓
frontend/lib/opificio-collections.ts (getOpificioCollection + adaptZero42Product 适配层)
  ↓
components/OpificioDetail.tsx (统一 6 段式编辑设计感模板)
  ↓
所有 47 个详情页（/products/[brand]/[collection]）
```

> 📖 详细文档见 [`CLAUDE.md`](./CLAUDE.md)（技术栈 / 颜色系统 / 路由清单 / MCP 暴露面 / 已知问题）

## MCP Server 能力

启动后（stdio 模式）暴露：

- **6 Tools** — `search_collections` / `get_collection_detail` / `recommend_tiles` / `calculate_quantity` / `get_technical_specs` / `compare_collections`
- **3 Resources** — `piccola://products` / `piccola://products/{brand}/{id}` / `piccola://specs/{id}`
- **2 Prompts** — `tile_advisor` / `tech_qa`

接入 Claude Desktop / OpenClaw / Cursor 等 MCP 客户端即可使用。

## 文档索引

| 文档 | 内容 |
|------|------|
| [`CLAUDE.md`](./CLAUDE.md) | ⭐ **AI 必读** — 技术栈 / 颜色 / 数据流 / 路由 / 已知问题 |
| [`frontend/lib/README.md`](./frontend/lib/README.md) | 数据层详细说明 |
| [`mcp-server/README.md`](./mcp-server/README.md) | MCP Server 接入文档 |
| [`docs/CODE-REVIEW-2026-08-03.md`](./docs/CODE-REVIEW-2026-08-03.md) | 2026-08-03 代码审计（21 个 issue） |
| [`docs/ai-scenarios.md`](./docs/ai-scenarios.md) | 6 个 AI 应用场景规划 |
| [`docs/marketing-content-batch-1.md`](./docs/marketing-content-batch-1.md) | 第一波营销内容 |
| [`HANDOFF-REPORT.md`](./HANDOFF-REPORT.md) | 2026-07-27 交接报告 |
| [`REVIEW-ISSUES.md`](./REVIEW-ISSUES.md) | 三轮审计问题清单 |

## 环境

- Node.js v24.18.0
- Next.js 14.1.0
- Swiper 14.0.6（仅文档说明遗留，实际不再使用）
- OS Linux ARM64
- 磁盘使用 ~1.6 GB（图片为主）
