# Piccola 微信小程序 — 开发记录

> 创建日期：2026-08-12
> 项目路径：`~/.openclaw/workspace/wow-projects/piccola-miniprogram/`
> 来源：从 `piccola-ecommerce` Next.js 前端迁移

## 项目概况

将 Piccola 意大利手工瓷砖展示网站迁移为微信小程序，MVP 版本，保留核心浏览 + 询价流程。

## 技术栈

- 原生微信小程序（无框架，审核最友好）
- 本地 JSON 数据（与 Web 版同源，47 个系列）
- wx.storage 持久化购物车
- 图片走服务器 HTTP（开发用 localhost:3000，上线用 HTTPS 域名）

## 页面清单（7 个）

| 页面 | 路径 | 对应原站 |
|------|------|----------|
| 首页 | `pages/index` | `/` |
| 全部系列 | `pages/collections` | `/collections` |
| 品牌系列 | `pages/brand` | `/products/[brand]` |
| 产品详情 | `pages/detail` | `/products/[brand]/[collection]` |
| 选材清单 | `pages/cart` | `/cart` |
| 联系我们 | `pages/contact` | `/contact` |
| 关于 | `pages/about` | `/about` |

## 数据层

- `utils/products-data.js` — 47 个产品（从 Web 版同步）
- `utils/opificio-products.js` — Opificio 16 个系列原始数据
- `utils/opificio-collections.js` — Opificio 数据处理 + 41zero42 适配层
- `utils/brand-products.js` — 产品查询/筛选/搜索
- `utils/cart.js` — 购物车（选材清单）
- `utils/image.js` — 图片 URL 工具

## 上线清单

- [ ] `app.js` 中 `imageBaseUrl` 改为正式 HTTPS 域名
- [ ] `project.config.json` 中 `appid` 改为真实 AppID
- [ ] `images/` 中 TabBar 图标替换为正式设计图
- [ ] 微信公众平台配置 downloadFile 合法域名
- [ ] 询价表单对接真实后端接口
- [ ] 隐私协议、用户协议等合规页面

## 与 Web 版的差异

1. **页面精简**：19 → 7 页，砍掉 FAQ/Press/Returns 等低频静态页
2. **详情交互**：侧滑抽屉 → 独立页面（小程序页面栈更自然）
3. **瀑布流**：CSS Grid 变宽 12 列 → 移动端两列交错（3 种比例变体）
4. **样式方案**：Tailwind → 原生 WXSS + 工具类
5. **包体积**：图片全部走网络，不占包（2MB 主包限制）

## 后续可扩展

- 接入真实提交接口（目前模拟）
- 微信授权登录
- 更多静态页（FAQ/Shipping/Returns/Terms 等 12 页）
- 小程序客服
- 消息订阅（询价进度通知）
- 分享海报

## 已知坑

- `products-data.json` 中 `id` 是数字类型，操作字符串方法前必须 `String()` 包裹
- 小程序不支持 CSS 伪类 `:hover`，交互态用 `active` 或 JS 控制
- TabBar 图标必须是本地 PNG，不能用网络图片
- 小程序主包 2MB / 整包 20MB 限制
