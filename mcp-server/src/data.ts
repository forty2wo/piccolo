import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_LIB_DIR = path.resolve(__dirname, '../../frontend/lib');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Swatch {
  number: number;
  description: string;
  image: string;
}

export interface CollectionImages {
  cover: string;
  details: string[];
  websiteDir: string;
  websiteCover: string[];
}

export interface Collection {
  id: string;
  name: string;
  nameCn?: string;
  designConcept?: string;
  technology?: string;
  finishes?: string[];
  thickness?: string;
  materialCategory?: string;
  colorFamily?: string[];
  applications?: string[];
  style?: string[];
  images: CollectionImages;
  websiteCover?: string;
  sourceUrl?: string;
  swatches: Swatch[];
  description?: string;
  specs?: Record<string, string>;
  projects?: any[];
}

export interface ProductFile {
  meta: {
    source: string;
    totalCollections: number;
    totalImages: number;
    brands: string[];
  };
  collections: Collection[];
}

export interface TechSpec {
  technology: string;
  finish: string;
  sizes: string;
  thickness: string;
  waterAbsorption?: string;
  slipRating?: string;
  peiRating?: string;
  frostResistant?: boolean;
  rectified?: boolean;
  material: string;
}

// ─── Data Loader ──────────────────────────────────────────────────────────────

let cache: {
  products41: ProductFile;
  productsOpificio: ProductFile;
  techSpecs: Record<string, TechSpec>;
} | null = null;

function loadJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function loadData() {
  if (cache) return cache;

  // 41zero42 文件是扁平 array，opificio 是 { collections: [...] }
  // 统一包装为 ProductFile 形状
  const products41Raw = loadJSON<Collection[] | ProductFile>(path.join(FRONTEND_LIB_DIR, 'products-data.json'));
  const productsOpificioRaw = loadJSON<ProductFile>(path.join(FRONTEND_LIB_DIR, 'opificio-products.json'));
  const techSpecs = loadJSON<Record<string, TechSpec>>(path.join(FRONTEND_LIB_DIR, '41zero42-technical-specs.json'));

  const products41: ProductFile = Array.isArray(products41Raw)
    ? {
        meta: { source: '41zero42', totalCollections: products41Raw.length, totalImages: 0, brands: ['41zero42'] },
        collections: products41Raw,
      }
    : products41Raw;
  const productsOpificio: ProductFile = productsOpificioRaw;

  cache = { products41, productsOpificio, techSpecs };
  return cache;
}

// ─── Search & Filter ─────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  brand?: string;
  style?: string;
  material?: string;
  application?: string;
  color?: string;
}

export function searchCollections(filters: SearchFilters): Collection[] {
  const data = loadData();
  let results: Collection[] = [
    ...data.products41.collections,
    ...data.productsOpificio.collections,
  ];

  if (filters.brand) {
    const b = filters.brand.toLowerCase();
    results = results.filter(c => {
      const brand = data.products41.collections.includes(c) ? '41zero42' : 'opificio';
      return brand.includes(b);
    });
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.nameCn && c.nameCn.toLowerCase().includes(q)) ||
      (c.designConcept && c.designConcept.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  if (filters.style) {
    const s = filters.style.toLowerCase();
    results = results.filter(c =>
      c.style?.some(st => st.toLowerCase().includes(s))
    );
  }

  if (filters.material) {
    const m = filters.material.toLowerCase();
    results = results.filter(c =>
      c.materialCategory?.toLowerCase().includes(m) ||
      c.technology?.toLowerCase().includes(m)
    );
  }

  if (filters.application) {
    const a = filters.application.toLowerCase();
    results = results.filter(c =>
      c.applications?.some(app => app.toLowerCase().includes(a))
    );
  }

  if (filters.color) {
    const cl = filters.color.toLowerCase();
    results = results.filter(c =>
      c.colorFamily?.some(cf => cf.toLowerCase().includes(cl))
    );
  }

  return results;
}

// ─── Recommend ────────────────────────────────────────────────────────────────

export interface RecommendInput {
  space?: string;       // 客厅、卫生间、厨房...
  style?: string;       // 北欧、现代、复古...
  material?: string;    // 陶瓷、 porcelain...
  color?: string;       // 暖色、冷色、灰色...
  budget?: string;      // 高、中、低
  keywords?: string[];  // 自由关键词
}

export function recommendTiles(input: RecommendInput): Collection[] {
  const filters: SearchFilters = {};

  // Map Chinese user input to searchable fields
  if (input.space) filters.application = input.space;
  if (input.style) filters.style = input.style;
  if (input.material) filters.material = input.material;
  if (input.color) filters.color = input.color;

  let results = searchCollections(filters);

  // If no filters matched, do keyword search across all fields
  if (results.length === 0 && input.keywords?.length) {
    const data = loadData();
    const all = [...data.products41.collections, ...data.productsOpificio.collections];
    results = all.filter(c => {
      const text = [
        c.name, c.nameCn || '', c.designConcept || '', c.description || '',
        ...(c.style || []), ...(c.applications || []), ...(c.colorFamily || []),
        c.technology || '', c.materialCategory || '',
      ].join(' ').toLowerCase();
      return input.keywords!.some(kw => text.includes(kw.toLowerCase()));
    });
  }

  // Score and rank
  const scored = results.map(c => ({
    collection: c,
    score: scoreCollection(c, input),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(s => s.collection);
}

function scoreCollection(c: Collection, input: RecommendInput): number {
  let score = 0;
  if (input.space && c.applications?.some(a => a.includes(input.space!))) score += 3;
  if (input.style && c.style?.some(s => s.includes(input.style!))) score += 3;
  if (input.color && c.colorFamily?.some(cf => cf.includes(input.color!))) score += 2;
  if (input.material && c.materialCategory?.toLowerCase().includes(input.material!.toLowerCase())) score += 2;
  if (c.swatches?.length > 10) score += 1; // More options = slightly better
  return score;
}

// ─── Quantity Calculator ──────────────────────────────────────────────────────

export interface CalcResult {
  collection: string;
  areaSqm: number;
  pattern: string;
  tilesNeeded: number;
  wastagePercent: number;
  totalTiles: number;
  estimatedPrice: string;
  notes: string;
}

const PATTERN_WASTAGE: Record<string, number> = {
  'straight': 10,    // 直铺
  'herringbone': 15, // 人字
  'fishbone': 15,    // 鱼骨
  'diagonal': 15,    // 斜铺
  'brick': 10,       // 工字
  'basket': 12,      // 编织
};

export function calculateQuantity(
  collectionId: string,
  areaSqm: number,
  pattern: string = 'straight'
): CalcResult | null {
  const data = loadData();
  const col = [...data.products41.collections, ...data.productsOpificio.collections]
    .find(c => c.id === collectionId);

  if (!col) return null;

  const spec = data.techSpecs[collectionId];
  const tileSize = spec?.sizes || col.swatches?.[0]?.description || '';

  // Parse tile dimensions to get area per tile (rough)
  const sizeMatch = tileSize.match(/(\d+[,.]?\d*)\s*x\s*(\d+[,.]?\d*)/);
  let tileAreaSqm = 0.04; // default 20x20cm
  if (sizeMatch) {
    const w = parseFloat(sizeMatch[1].replace(',', '.'));
    const h = parseFloat(sizeMatch[2].replace(',', '.'));
    tileAreaSqm = (w / 1000) * (h / 1000); // mm to m²
  }

  const wastage = PATTERN_WASTAGE[pattern] || 10;
  const tilesNeeded = Math.ceil(areaSqm / tileAreaSqm);
  const totalTiles = Math.ceil(tilesNeeded * (1 + wastage / 100));

  return {
    collection: col.name,
    areaSqm,
    pattern,
    tilesNeeded,
    wastagePercent: wastage,
    totalTiles,
    estimatedPrice: `需询价（${totalTiles} 片，约 ${(totalTiles * tileAreaSqm).toFixed(1)} m²）`,
    notes: `基于 ${tileSize} 规格计算，含 ${wastage}% 损耗。实际价格请联系销售确认。`,
  };
}

// ─── Compare ──────────────────────────────────────────────────────────────────

export function compareCollections(ids: string[]): Record<string, any>[] {
  const data = loadData();
  const all = [...data.products41.collections, ...data.productsOpificio.collections];

  return ids.map(id => {
    const col = all.find(c => c.id === id);
    if (!col) return { id, error: '未找到' };

    const spec = data.techSpecs[id];
    return {
      id: col.id,
      name: col.name,
      nameCn: col.nameCn,
      brand: data.products41.collections.includes(col) ? '41zero42' : 'Opificio Ceramico',
      designConcept: col.designConcept,
      technology: spec?.technology || col.technology,
      finish: spec?.finish || col.finishes?.join(', '),
      sizes: spec?.sizes,
      thickness: spec?.thickness || col.thickness,
      material: spec?.material || col.materialCategory,
      waterAbsorption: spec?.waterAbsorption,
      slipRating: spec?.slipRating,
      peiRating: spec?.peiRating,
      frostResistant: spec?.frostResistant,
      style: col.style,
      applications: col.applications,
      colorFamily: col.colorFamily,
      swatchCount: col.swatches?.length || 0,
    };
  });
}

// ─── Format for AI ────────────────────────────────────────────────────────────

export function formatCollectionBrief(c: Collection): string {
  const data = loadData();
  const brand = data.products41.collections.includes(c) ? '41zero42' : 'Opificio';
  return [
    `【${c.name}】(${c.nameCn || ''}) — ${brand}`,
    c.designConcept ? `  设计理念: ${c.designConcept}` : null,
    c.style?.length ? `  风格: ${c.style.join(', ')}` : null,
    c.applications?.length ? `  适用: ${c.applications.join(', ')}` : null,
    c.colorFamily?.length ? `  色系: ${c.colorFamily.join(', ')}` : null,
    c.technology ? `  工艺: ${c.technology}` : null,
    `  花色数: ${c.swatches?.length || 0}`,
  ].filter(Boolean).join('\n');
}

export function formatCollectionDetail(c: Collection): string {
  const data = loadData();
  const brand = data.products41.collections.includes(c) ? '41zero42' : 'Opificio';
  const spec = data.techSpecs[c.id];

  let text = [
    `═══ ${c.name} (${c.nameCn || ''}) ═══`,
    `品牌: ${brand}`,
    c.designConcept ? `设计理念: "${c.designConcept}"` : null,
    '',
    '【技术参数】',
    spec ? [
      `  工艺: ${spec.technology}`,
      `  表面: ${spec.finish}`,
      `  规格: ${spec.sizes}`,
      `  厚度: ${spec.thickness}`,
      `  材质: ${spec.material}`,
      spec.waterAbsorption ? `  吸水率: ${spec.waterAbsorption}` : null,
      spec.slipRating ? `  防滑等级: ${spec.slipRating}` : null,
      spec.peiRating ? `  耐磨等级: ${spec.peiRating}` : null,
      spec.frostResistant !== undefined ? `  抗冻: ${spec.frostResistant ? '是' : '否'}` : null,
    ].filter(Boolean).join('\n') : '  暂无详细技术参数',
    '',
    c.description ? `【描述】\n${c.description}` : null,
    '',
    c.swatches?.length ? `【花色 (${c.swatches.length})】\n${c.swatches.map((s) => '  ' + s.number + '. ' + s.description).join('\n')}` : null,
  ].filter(Boolean).join('\n');

  return text;
}
