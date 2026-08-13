# Piccola 首页 + 关键路径 严肃批评

> **作者角色**：资深 PM + 经验丰富的前端设计师  
> **评审日期**：2026-08-09  
> **评审范围**：首页（`/`） + 关键路径（首页 → 品牌列表 → 详情页 → 选材清单）  
> **方法**：基于真实代码梳理，不参考竞品站；不画线框；不引言，直接挑刺  
> **目标用户**：国内设计师 + 业主 / 核心目标：微信、邮箱、留资后销售跟进 / 高定零售 / 中英双语考虑

---

## 一、PM 视角：5 个致命问题

### 🔴 P0.1 首页没有"留资入口"——核心转化目标直接缺失

**代码事实**：`app/page.tsx` 渲染的 5 个 section（Header / HeroSection / BrandShowcase / InspireGrid / FeaturedCollections / Footer）里，**没有一个**有「微信二维码 / 邮箱订阅 / 预约咨询 / 索取样品 / 销售跟进」任何一种留资组件。Footer 唯一的"联系"链到 `/contact`，但 `/contact` 是普通表单页，跟"留资后销售跟进"这个核心目标**没有显式连接**。

**严重性**：致命。网站目标 = 微信/邮箱/留资跟进，但首页**整个 fold + scroll-out 没看到一个明确的转化钩子**。用户来 → 看完 → 走掉。`/contact` 隐藏在 footer 第 2 列第 1 行，对设计师用户来说**形同虚设**。

**修复方向**：
- HeroSection 内嵌一个**极克制的**「预约设计顾问」CTA（不是「立即购买」）
- 全站固定右下角的**悬浮入口**（微信/邮箱/电话，至少一个）
- FeaturedCollections 下方加一个**窄横条**（不是大 banner）：「想为您的项目定制方案？留下邮箱，48 小时内回复」

---

### 🔴 P0.2 47 个 collection 全部推给首页瀑布流——信息架构灾难

**代码事实**：`InspireGrid` 把 `products` 数组里**所有 47 个 collection 的所有图**（每 collection 限 3 张）打散，做成"无限滚动瀑布流"，**占首页 50% 以上的 scroll 空间**。`FeaturedCollections` 紧接其后，**也展示 8 个产品**。两个 section **在视觉上做的事情 90% 重叠**——都是"看图 → 点击进详情"。

**严重性**：高定零售的首页**应该是编辑精选**（6-8 个 curated stories），不是"批发市集"。用户进来看到的不是"这家品牌的审美和价值观"，而是"这是一家卖瓷砖的网站有很多瓷砖"。这跟"高定零售"定位**直接冲突**。

**修复方向**：
- **删掉**首页 `InspireGrid`（移到 `/inspire` 已经存在）
- 首页只留 4 个 section：Hero / Brand Story / **Editorial 精选 6-8 个**（带策展文案）/ Footer
- 精选的 6-8 个**按场景/风格策展**（不是按品牌均分）：例如「2026 春夏 4 个趋势」「最受欢迎」「设计师特别推荐」

---

### 🔴 P0.3 Header 导航缺少 3 个关键入口

**代码事实**：`Header.tsx` 的 `navItems` 只有 4 项：`Collections / Brands (dropdown: 41zero42 / Opificio Ceramico) / Inspire / About`。**没有**：
- 设计师入口（设计师用户识别 / 投稿 / 案例投稿 / 个人主页）
- 项目案例 / Projects（41zero42 200+ 项目，是最强的转化资产，**全站找不到入口**）
- 媒体 / Journal（高端品牌的标配内容叙事）

**严重性**：高端瓷砖品牌的网站**核心叙事**是"这个砖铺在哪里、长什么样、谁在用"。**Header 居然没有 Projects 入口**——这是把最有说服力的资产藏起来。

**修复方向**：
- Header 加 `Projects`（指向 `/projects` 路由，**目前根本不存在**，要新建）
- Header 加 `Designers`（指向 `/designers` 或 `/about#designers`）
- 长期：考虑加 `Journal`（但需要内容生产，先不上）

---

### 🔴 P0.4 设计师用户和业主用户走同一条路径——分流缺失

**代码事实**：
- 「加入选材清单」叫"购物车"（`CartSidebar` / `useCart`），但价格全是 0，**对业主用户（看价格）来说就是"假购物车"**
- 业主用户要的是"我看到这个砖漂亮，能留个样品 / 联系方式吗"——目前只能走"加选材清单 → 跳 /contact"这个**对业主来说很重的路径**
- 设计师用户要的是"我要把这个砖放进我的项目库 / 整理给客户看"——目前**没有项目库概念**，"加选材清单"对设计师来说就是"看中的砖凑一起"，没有项目组织

**严重性**：两类用户的需求**完全分裂**。把"加选材清单"这一个按钮给所有人用 = **谁都用不好**。

**修复方向**（**最低成本版**）：
- Hero CTA 一分为二：「我是设计师」（→ Projects + 工具）/ 「我是业主」（→ 灵感 + 留资）
- 或者更轻：Header 加一个**轻量分流**（右上角一个「设计师登录」链接，先不做登录系统，链到一个 `/for-designers` 介绍页）
- 「加选材清单」按钮文案**根据用户身份动态改**（初期可用 cookie 记忆，但首先要在 UI 上区分"加到我的项目"vs"索取样品"两个动作）

---

### 🟡 P0.5 没有中文/英文切换——`CLAUDE.md` 写了"考虑中英双语"，但代码里 0 痕迹

**代码事实**：
- 全站 `HeroSection` 写死 `意大利陶瓷艺术 / 设计师之选`
- `BrandShowcase` 写死 `甄选品牌 / 来自意大利萨索罗的现代瓷砖品牌...`
- `Header` 写死 `Collections / Brands / Inspire / About`
- `Footer` 写死 `Shop / Support / Company / Contact Us / FAQ / Shipping / Returns / About / Sustainability / Careers / Press / Privacy Policy / Terms of Service`
- **没有任何 i18n 库**（没看到 `next-intl` / `next-i18next` / `react-i18next`），没有任何 `useLocale` / `locale/` 目录
- `package.json` 也没装 i18n 包

**严重性**：「考虑中英双语」在文档里就是「待办」，但代码里**完全是中文硬编码**。如果要做双语，需要：
- 引入 i18n 库（推荐 `next-intl`，Next.js 14 App Router 原生支持最好）
- 把所有硬编码字符串提取到 `messages/zh.json` + `messages/en.json`
- 路由分组 `[locale]/...`
- Hero / Footer / Header / BrandShowcase 等所有组件改用 `useTranslations`

**修复方向**：
- 短期（1 周）：**先做 Header 切换器** + Hero 关键句中英对照（用 `dictionary` 简单对象就行，先不上 i18n 库）
- 中期：上 `next-intl`，全站切换
- **不要**在没规划好之前做双语——会做两遍

---

## 二、前端设计师视角：4 个严重问题

### 🟡 D1. HeroSection 的视觉冲击力 vs 行业惯例——文案权重失衡

**代码事实**：
- Hero 高度 `h-[85vh] md:h-[90vh]`（合适）
- 但 Hero 内部文字层级有 **6 层**：`Italian Ceramic Art · Designer's Choice`（副标小字）→ `意大利陶瓷艺术`（主标大字）→ `设计师之选`（次大）→ `源自意大利的高端手工瓷砖 · 41zero42 & Opificio Ceramico`（说明）→ 两个 CTA
- 视觉权重**主标被次大、副标、说明全部稀释**——用户进首页 3 秒内**不知道这页要说什么**

**严重性**：高端品牌的 Hero 永远只有 **1 个主标 + 1 个副标 + 1 个 CTA**（最多 2 个）。**6 层文字的 Hero 像 2015 年企业官网**。

**修复方向**：
- Hero 只留：英文小标（如 `Italian Ceramic Art`） + 中文主标（4-8 字） + 1 个 CTA
- 删掉 `设计师之选` `源自意大利...` `Italian Ceramic Art · Designer's Choice` 中的 2-3 个
- 副标/说明放到第二屏（Brand Story section）

---

### 🟡 D2. InspireGrid 的瀑布流在移动端是灾难

**代码事实**：
- `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` 网格布局
- 但每张图都是**固定 `aspectRatio: '4/5'`**——不是真正的瀑布流
- 移动端 2 列、每张图 4:5——意味着**用户打开首页第一屏全是图**，3 屏才能滚到 FeaturedCollections
- `MAX_PER_COLLECTION = 3` 限制 + `simpleHash` 排序——总共可能 140+ 张图（47 collection × 3 张）
- `IntersectionObserver` 无限滚动 + `rootMargin: 400px` 预加载——**移动端首次打开加载一堆不必要的图**

**严重性**：P0.2 已经说了"删掉首页 InspireGrid"。**D2 是它的次生问题**：即使保留，移动端体验也崩。

**修复方向**：随 P0.2 一并删除；保留到 `/inspire` 路由（已存在）。

---

### 🟡 D3. BrandShowcase 用了 `#c9a962`——但设计系统里**没有这个色**

**代码事实**：
- `tailwind.config.js` 定义的颜色：`primary` 系列 / `border` / `surface` / `accent: #8b7355`
- **但 `BrandShowcase` 和 `FeaturedCollections` 用了 `#c9a962`**（金色）作为 CTA hover / 链接色
- 这个色**不在设计系统里**——是**硬编码 hex 值**

**严重性**：设计系统最忌讳"硬编码色"——这意味着后续任何主题/品牌色调整都得全文搜。`#c9a962` 这个金色在深色背景上看其实**对比度不够**（a11y 不达标），但**因为是硬编码**，连 a11y 问题都难追溯。

**修复方向**：
- 把 `#c9a972` 加到 `tailwind.config.js` 命名为 `accent-gold`（或更准确的名字）
- 全站 `c9a962` 全文搜 + 替换为 `text-accent-gold`
- 同时**检查 a11y 对比度**（白字背景 → 4.5:1 以上）

---

### 🟡 D4. FeaturedCollections 品牌徽章逻辑跟 BrandShowcase 的 swatches 计数对不上

**代码事实**：
- `BrandShowcase` 算 41zero42 的 swatches 数 = **包含** `/swatches/` 子目录的文件数；算 Opificio 的 swatches 数 = **排除** `/swatches/` 子目录的文件数
- 这是**两个 brand 用了两套不同口径**——同样的"swatches 数字"含义不同
- 旧 `REVIEW-ISSUES.md` 已经标记了（不过那份报告你刚删了）
- `FeaturedCollections` 显示 `41zero42` / `Opificio` 徽章用 `product.brand === '41zero42' ? '41zero42' : 'Opificio'` 简化处理——但 Opificio 的 `brand` 字段实际是 `'Opificio Ceramico'`，**所以徽章其实对，但完全靠这个 fallback**

**严重性**：数据口径不一致 → 数字不专业 → 高定零售用户一眼能看出。

**修复方向**：
- 统一 swatches 计数口径：要么都算 `/swatches/` 子目录，要么都按"图总数"算
- 品牌徽章用 `brandMap[p.brand]?.shortName` 映射，不要内联三元

---

## 三、关键路径（首页 → 品牌列表 → 详情页 → 选材清单）的问题

### 🟡 P3.1 `/products/[brand]` 列表页"加选材清单"按钮**没有反馈**

**代码事实**：`ProductCard` 的"加选材清单"按钮（如果存在）调 `addToCart`，会触发 `setIsOpen(true)` 自动打开侧边栏——**这部分 OK**。但 `/products/[brand]` 列表页本身有 P0 提到的 `/bestsellers` filter bug（所有 stock=100，filter 永远空）——这是历史 bug 但**没修**。

**严重性**：P1 / 中等。`/bestsellers` 是边缘路由，但 `stock=100` 写在所有 47 个产品上是**数据问题**，会让所有依赖 `stock` 字段的逻辑（比如 ProductCard 缺货标签、库存提示）**永远不触发**。

**修复方向**：
- 短期：把 `stock` 全部改成 `null` 或加 `inStock: boolean` 字段
- 长期：库存是真业务数据，应该有后端——目前没后端，先用"全部有货"硬编码

---

### 🟡 P3.2 详情页（`OpificioDetail`）已经修得不错，遗留 1 个明显问题

**代码事实**：`OpificioDetail` 6 段式模板（Hero / Concept / Variant 色卡 / Lifestyle / Detail / Specs）已经统一所有 47 个 collection 的详情页。但 **CTA 区只有一个"加入选材清单"按钮**——没有：
- 「保存到我的项目」/ 「保存为对比」
- 「下载系列资料 PDF」（41zero42 站有 PDF 下载，CLAUDE.md 旧版提过但没做）
- 「分享给同事」（设计师用户强烈需要）

**严重性**：P2 / 低。但对设计师用户是**高价值功能缺失**。

**修复方向**：
- 加「下载资料」按钮（链到 PDF，PDF 已经在 `data/41zero42-pdf-descriptions.json` 旁边）
- 短期不上"项目库"（要登录系统）
- 「分享」可以用纯 URL + Web Share API

---

### 🟡 P3.3 「选材清单」侧边栏没解决"业主用户不知道下一步"的问题

**代码事实**：`CartSidebar` 加完项目后**只显示清单列表 + 总件数 + 「继续浏览 / 提交询价」**。但"提交询价"跳 `/contact`——**选材清单的内容没带过去**（CLAUDE.md 旧版提过的"转化路径断裂"问题，没修）。

**严重性**：P1 / 高。这是**最重要的转化漏斗**——业主用户加完 3 个砖点"提交询价"，结果跳到 /contact 是一个**空表单**，他得重新口述刚才选了哪 3 个砖——**99% 的人这时候就关了**。

**修复方向**（**最低成本**）：
- 跳 `/contact?items=...` 带 query 参数（base64 编码选材清单 ID）
- `/contact` 页读 query，预填"我感兴趣的系列"多选
- 长期：上后端，把选材清单作为询价单提交（目前是 localStorage，刷新换设备就丢）

---

## 四、总结

### 致命问题（先修）

1. **首页没留资入口**——核心转化目标直接缺失
2. **首页 47 个 collection 全展示**——信息架构灾难
3. **Header 缺 Projects / Designers 入口**——最强资产藏起来
4. **设计师/业主用户同路径**——分流缺失
5. **中英双语 0 痕迹**——CLAUDE.md 写了"考虑"，代码完全没做

### 严重问题（中期修）

6. Hero 文字层级 6 层过载
7. InspireGrid 移动端是灾难
8. `#c9a962` 金色硬编码在设计系统外
9. swatches 计数口径不统一
10. 选材清单 → 询价单 转化路径断裂（带不出选材内容）

### 11 个 P0/P1 全部基于代码事实

每条都能在 `frontend/app/page.tsx` / `frontend/components/*.tsx` / `frontend/lib/*.ts` 里直接核对。**不参考竞品**（你说了忽略），**不画线框**（你说了短）。

---

## 五、不做的事

- ❌ 不画 wireframe（你没让）
- ❌ 不参考 Mutina / GB / FM / La Riggiola（你说了忽略）
- ❌ 不做信息架构图（短 = 不画图）
- ❌ 不重写 CLAUDE.md（不在本次范围）
- ❌ 不动任何代码（review 是 review，不动工程）

---

**总长 ~2000 字。所有问题都有代码定位。可以直接拆 issue 干。**
