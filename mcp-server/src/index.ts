import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  loadData,
  searchCollections,
  recommendTiles,
  calculateQuantity,
  compareCollections,
  formatCollectionBrief,
  formatCollectionDetail,
} from './data.js';

const server = new McpServer({
  name: 'piccola-tiles',
  version: '0.1.0',
});

// ─── Tools ────────────────────────────────────────────────────────────────────

// 1. Search Collections
server.tool(
  'search_collections',
  '搜索/筛选瓷砖系列。支持按品牌、风格、材质、应用场景、颜色筛选',
  {
    query: z.string().optional().describe('关键词搜索（名称、设计理念、描述）'),
    brand: z.string().optional().describe('品牌：41zero42 或 Opificio'),
    style: z.string().optional().describe('风格：现代、复古、北欧等'),
    material: z.string().optional().describe('材质：陶瓷、porcelain 等'),
    application: z.string().optional().describe('应用场景：客厅、卫生间、厨房、地面、墙面等'),
    color: z.string().optional().describe('色系：暖棕系、灰色系、白色系等'),
  },
  async (args) => {
    const results = searchCollections(args);
    if (results.length === 0) {
      return { content: [{ type: 'text', text: '没有找到符合条件的系列，请尝试调整筛选条件。' }] };
    }
    const text = `找到 ${results.length} 个系列：\n\n${results.map(formatCollectionBrief).join('\n\n')}`;
    return { content: [{ type: 'text', text }] };
  },
);

// 2. Get Collection Detail
server.tool(
  'get_collection_detail',
  '获取某个瓷砖系列的完整信息，包括设计理念、技术参数、花色列表',
  {
    collection_id: z.string().describe('系列 ID，如 milano70、brutus、chicco'),
  },
  async ({ collection_id }) => {
    const data = loadData();
    const all = [...data.products41.collections, ...data.productsOpificio.collections];
    const col = all.find(c => c.id === collection_id);
    if (!col) {
      return { content: [{ type: 'text', text: `未找到系列 "${collection_id}"。可用系列：${all.map(c => c.id).join(', ')}` }] };
    }
    return { content: [{ type: 'text', text: formatCollectionDetail(col) }] };
  },
);

// 3. Recommend Tiles
server.tool(
  'recommend_tiles',
  '根据用户需求智能推荐瓷砖系列。输入空间类型、风格偏好、颜色等，返回最匹配的系列',
  {
    space: z.string().optional().describe('空间类型：客厅、卫生间、厨房、阳台、商业空间等'),
    style: z.string().optional().describe('风格偏好：现代、北欧、复古、工业、极简、日式等'),
    material: z.string().optional().describe('材质偏好：陶瓷、瓷质砖、釉面等'),
    color: z.string().optional().describe('颜色偏好：暖色、冷色、灰色、白色、深色等'),
    budget: z.string().optional().describe('预算：高、中、低'),
    keywords: z.array(z.string()).optional().describe('其他关键词'),
  },
  async (args) => {
    const results = recommendTiles(args);
    if (results.length === 0) {
      return { content: [{ type: 'text', text: '根据您的需求暂无完美匹配，以下是热门推荐：' }] };
    }
    const header = `为您推荐 ${results.length} 个系列：\n`;
    const body = results.map((c, i) => `${i + 1}. ${formatCollectionBrief(c)}`).join('\n\n');
    return { content: [{ type: 'text', text: header + body }] };
  },
);

// 4. Calculate Quantity
server.tool(
  'calculate_quantity',
  '计算铺贴用量。输入房间面积和铺贴方式，返回所需瓷砖数量、损耗和预估用量',
  {
    collection_id: z.string().describe('系列 ID'),
    area_sqm: z.number().describe('房间面积（平方米）'),
    pattern: z.string().optional().describe('铺贴方式：straight(直铺)、herringbone(人字)、diagonal(斜铺)、brick(工字)'),
  },
  async ({ collection_id, area_sqm, pattern }) => {
    const result = calculateQuantity(collection_id, area_sqm, pattern || 'straight');
    if (!result) {
      return { content: [{ type: 'text', text: `未找到系列 "${collection_id}"` }] };
    }
    const text = [
      `═══ 铺贴用量计算 ═══`,
      `系列: ${result.collection}`,
      `面积: ${result.areaSqm} m²`,
      `铺贴方式: ${result.pattern}`,
      `基础用量: ${result.tilesNeeded} 片`,
      `损耗率: ${result.wastagePercent}%`,
      `总用量: ${result.totalTiles} 片`,
      `预估: ${result.estimatedPrice}`,
      ``,
      `⚠️ ${result.notes}`,
    ].join('\n');
    return { content: [{ type: 'text', text }] };
  },
);

// 5. Get Technical Specs
server.tool(
  'get_technical_specs',
  '获取瓷砖系列的技术参数：工艺、防滑等级、吸水率、厚度、耐磨等级等',
  {
    collection_id: z.string().describe('系列 ID'),
  },
  async ({ collection_id }) => {
    const data = loadData();
    const spec = data.techSpecs[collection_id];
    if (!spec) {
      return { content: [{ type: 'text', text: `未找到系列 "${collection_id}" 的技术规格` }] };
    }
    const text = [
      `═══ ${collection_id} 技术参数 ═══`,
      `工艺: ${spec.technology}`,
      `表面: ${spec.finish}`,
      `规格: ${spec.sizes}`,
      `厚度: ${spec.thickness}`,
      `材质: ${spec.material}`,
      spec.waterAbsorption ? `吸水率: ${spec.waterAbsorption}` : null,
      spec.slipRating ? `防滑等级: ${spec.slipRating}` : null,
      spec.peiRating ? `耐磨等级: ${spec.peiRating}` : null,
      spec.frostResistant !== undefined ? `抗冻: ${spec.frostResistant ? '是' : '否'}` : null,
      spec.rectified !== undefined ? `切割: ${spec.rectified ? '精切' : '非精切'}` : null,
    ].filter(Boolean).join('\n');
    return { content: [{ type: 'text', text }] };
  },
);

// 6. Compare Collections
server.tool(
  'compare_collections',
  '对比多个瓷砖系列的参数差异，支持同时对比 2-5 个系列',
  {
    collection_ids: z.array(z.string()).describe('要对比的系列 ID 列表，如 ["milano70", "brutus", "dandy"]'),
  },
  async ({ collection_ids }) => {
    if (collection_ids.length < 2) {
      return { content: [{ type: 'text', text: '请至少提供 2 个系列进行对比' }] };
    }
    const results = compareCollections(collection_ids);
    const header = `═══ 系列对比 (${collection_ids.join(' vs ')}) ═══\n`;

    // Build comparison table
    const fields = ['name', 'brand', 'technology', 'finish', 'sizes', 'thickness', 'material', 'slipRating', 'peiRating', 'frostResistant', 'style', 'applications', 'colorFamily'];
    const rows = fields.map(field => {
      const values = results.map(r => {
        const v = r[field];
        if (Array.isArray(v)) return v.join(', ');
        if (v === true) return '✅';
        if (v === false) return '❌';
        return v || '-';
      });
      return `${field}: ${values.join(' | ')}`;
    });

    return { content: [{ type: 'text', text: header + rows.join('\n') }] };
  },
);

// ─── Resources ────────────────────────────────────────────────────────────────

server.resource(
  'product-catalog',
  'piccola://products',
  { description: '全部产品目录（41zero42 + Opificio Ceramico）', mimeType: 'application/json' },
  async () => {
    const data = loadData();
    const summary = {
      brands: ['41zero42', 'Opificio Ceramico'],
      totalCollections: data.products41.meta.totalCollections + (data.productsOpificio.collections?.length || 0),
      collections41: data.products41.collections.map(c => ({ id: c.id, name: c.name, nameCn: c.nameCn, swatches: c.swatches?.length || 0 })),
      collectionsOpificio: data.productsOpificio.collections.map(c => ({ id: c.id, name: c.name, nameCn: c.nameCn })),
    };
    return { contents: [{ uri: 'piccola://products', text: JSON.stringify(summary, null, 2), mimeType: 'application/json' }] };
  },
);

server.resource(
  'collection-detail',
  'piccola://products/{brand}/{collection_id}',
  { description: '单个系列的完整产品信息', mimeType: 'application/json' },
  async (uri: URL) => {
    const data = loadData();
    const all = [...data.products41.collections, ...data.productsOpificio.collections];
    // Parse URI: piccola://products/41zero42/milano70
    const uriStr = uri.toString();
    const parts = uriStr.replace('piccola://products/', '').split('/');
    const collectionId = parts[parts.length - 1];
    const col = all.find(c => c.id === collectionId);
    if (!col) {
      return { contents: [{ uri: uriStr, text: JSON.stringify({ error: `未找到系列 ${collectionId}` }), mimeType: 'application/json' }] };
    }
    return { contents: [{ uri: uriStr, text: JSON.stringify(col, null, 2), mimeType: 'application/json' }] };
  },
);

server.resource(
  'tech-specs',
  'piccola://specs/{collection_id}',
  { description: '瓷砖系列的技术规格', mimeType: 'application/json' },
  async (uri: URL) => {
    const data = loadData();
    const uriStr = uri.toString();
    const collectionId = uriStr.split('/').pop()!;
    const spec = data.techSpecs[collectionId];
    if (!spec) {
      return { contents: [{ uri: uriStr, text: JSON.stringify({ error: `未找到 ${collectionId} 的技术规格` }), mimeType: 'application/json' }] };
    }
    return { contents: [{ uri: uriStr, text: JSON.stringify(spec, null, 2), mimeType: 'application/json' }] };
  },
);

// ─── Prompts ──────────────────────────────────────────────────────────────────

server.prompt(
  'tile_advisor',
  '瓷砖选品顾问 prompt — 帮助用户选择合适的瓷砖',
  {},
  () => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `你是 Piccola 瓷砖的选品顾问，专注意大利手工瓷砖（41zero42 和 Opificio Ceramico）。

当用户咨询时：
1. 先了解他们的需求：空间类型、风格偏好、颜色倾向、预算
2. 使用 search_collections 或 recommend_tiles 工具查找匹配的系列
3. 推荐 2-3 个最佳选项，说明为什么适合
4. 如果用户需要技术细节，用 get_technical_specs 获取
5. 如果用户想对比，用 compare_collections 工具
6. 如果用户问用量，用 calculate_quantity 工具

回复风格：专业但亲切，用中文回复，技术参数可以保留英文原文。`,
      },
    }],
  }),
);

server.prompt(
  'tech_qa',
  '瓷砖技术问答 prompt — 回答专业问题（材质、防滑、施工等）',
  {},
  () => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `你是瓷砖技术专家，负责回答关于瓷砖的专业问题。

你掌握以下知识领域：
- 材质区别（陶瓷 vs 瓷质砖 vs 玻化砖）
- 防滑等级（R9-R13）和适用区域
- 耐磨等级（PEI I-V）
- 吸水率及其影响
- 施工工艺（薄贴法、厚贴法、美缝）
- 日常保养和清洁
- 不同空间的选砖建议

回答时：
1. 先用简单易懂的语言解释
2. 如果涉及具体产品，用 get_technical_specs 查询真实数据
3. 给出明确的建议，不要模棱两可
4. 中文回复，专业术语保留原文`,
      },
    }],
  }),
);

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  // Pre-load data
  loadData();

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
