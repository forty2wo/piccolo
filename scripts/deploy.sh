#!/bin/bash
# Piccola E-commerce - 生产环境部署脚本
# 用法: ./scripts/deploy.sh

set -e

echo "🚀 Piccola 电商平台 - 生产部署"
echo "================================"

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "📦 安装前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
  npm install
fi
cd ..

echo "🔨 构建生产版本..."
npm run build

# 修复静态文件权限（确保 Nginx/www-data 能读取）
echo "🔧 修复静态文件权限..."
if [ -d "frontend/public" ]; then
  chmod -R o+rX frontend/public/
fi
if [ -d "frontend/.next/static" ]; then
  chmod -R o+rX frontend/.next/static/
fi
# 确保目录可进入
chmod o+x "$PROJECT_DIR" "$PROJECT_DIR/frontend" "$PROJECT_DIR/frontend/public" "$PROJECT_DIR/frontend/.next" 2>/dev/null || true

echo "✅ 构建完成!"
echo ""
echo "启动服务: ./scripts/start.sh"
echo "停止服务: ./scripts/stop.sh"
echo "查看状态: ./scripts/status.sh"
