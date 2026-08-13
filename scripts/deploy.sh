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

echo "✅ 构建完成!"
echo ""
echo "启动服务: ./scripts/start.sh"
echo "停止服务: ./scripts/stop.sh"
echo "查看状态: ./scripts/status.sh"
