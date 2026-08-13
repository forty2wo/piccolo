# Lessons Learned

## SPA scroll restoration 是个深坑

### 背景
在 `piccola-ecommerce` 项目（Next.js 14 App Router）上尝试修复：
- 列表页点图进详情页 → back → 页面"从顶部动态滚动到原 Y 位置"
- 期望：返回瞬间在原位（41zero42.com 那种体验）

### 试过的方案
1. **`next.config.js` 加 `experimental.scrollRestoration: true`**
   - **失败**：dev server 报告显示启用，但实际行为不变
   - Next.js 14.1 已知问题：dev mode 下不稳定
2. **自己实现 client component 拦截 popstate + click**
   - `components/ScrollRestoration.tsx` (~120 行)
   - 关键设计：`restoreWhenReady(savedY)` 循环 rAF 重试，等图片 lazy load 把页面撑到 savedY 高度
   - **失败**：用户报告"仍然有问题"
   - 回滚

### 根本原因（推断）
- **MPA** 整页加载天然 zero-flicker → "瞬间原位"是天然效果
- **SPA** 必须自己拼装：保存 scrollY + 等 React 挂载 + 等图片 load + scrollTo
- 每个步骤的时序都不完全可控（图片加载速度、React 状态切换、route cache 失效）
- **结构性困难**，不是 5 行代码能解决的

### 结论
- 不要在 production 前置任务里投入时间修这个
- 如果非修不可，先用 production build 测，确认问题在 dev 还是 prod
- 在一个简单 page pair 上单测 `restoreWhenReady` 的 rAF 重试覆盖度
- 备选：让用户接受"动态滚动"（这是 Next.js App Router 的默认行为，不算 bug）

### 相关文件（已全部回滚）
- `frontend/components/ScrollRestoration.tsx` — 删了
- `frontend/app/layout.tsx` — 恢复
- `frontend/next.config.js` — 恢复
