#!/bin/bash
# Piccola E-commerce - 重新部署并重启
# 用法: ./scripts/redeploy.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🔄 Piccola 电商平台 - 重新部署"
echo "================================"

# 拉取最新代码
if [ -d ".git" ]; then
  echo "📥 拉取最新代码..."
  # 确保使用 HTTPS 协议（服务器上可能没有 SSH 密钥）
  CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
  if [[ "$CURRENT_REMOTE" == git@github.com* ]]; then
    HTTPS_REMOTE=$(echo "$CURRENT_REMOTE" | sed 's|git@github.com:|https://github.com/|')
    git remote set-url origin "$HTTPS_REMOTE"
  fi
  git pull
fi

# 构建
echo ""
echo "🔨 构建生产版本..."
bash scripts/deploy.sh

# 重启
echo ""
echo "🚀 重启服务..."
bash scripts/stop.sh || true
bash scripts/start.sh

echo ""
echo "✅ 重新部署完成!"
echo ""
bash scripts/status.sh
