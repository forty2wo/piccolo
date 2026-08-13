# Piccola MCP Server

瓷砖产品的 MCP (Model Context Protocol) Server，为 AI 模型提供产品搜索、推荐、技术参数查询等能力。

## 目录结构

```
mcp-server/
├── src/
│   ├── index.ts      # MCP Server 入口（工具/资源/提示词注册）
│   └── data.ts       # 数据层（加载、搜索、推荐、计算）
├── package.json
├── tsconfig.json
└── README.md
```

数据来源：`../data/` 目录下的 JSON 文件（与前端共享，不复制）。

## 快速开始

```bash
npm install
npm run build     # 编译 TypeScript
npm start         # 启动 MCP Server（stdio 模式）

# 或开发模式直接运行
npm run dev
```

## 暴露的 Tools（工具）

| 工具名 | 说明 |
|--------|------|
| `search_collections` | 按品牌/风格/材质/空间/颜色筛选系列 |
| `get_collection_detail` | 获取单个系列完整信息 |
| `recommend_tiles` | 基于用户需求智能推荐 |
| `calculate_quantity` | 铺贴用量+损耗计算 |
| `get_technical_specs` | 获取技术参数（防滑/吸水率/厚度等） |
| `compare_collections` | 多系列参数对比 |

## 暴露的 Resources（资源）

| URI | 说明 |
|-----|------|
| `piccola://products` | 全部产品目录概览 |
| `piccola://products/{brand}/{id}` | 单个系列详情 |
| `piccola://specs/{id}` | 技术规格 |

## Prompts（提示词模板）

| 名称 | 说明 |
|------|------|
| `tile_advisor` | 瓷砖选品顾问 |
| `tech_qa` | 技术问答专家 |

## 接入方式

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "piccola-tiles": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

### OpenClaw

在 OpenClaw 配置中添加 MCP server 配置即可。

## 注意事项

- Server 使用 stdio 传输，适合作为子进程被 Client 启动
- 数据从 `../data/*.json` 读取，首次加载后缓存在内存中
- 不会修改任何数据文件（只读）
