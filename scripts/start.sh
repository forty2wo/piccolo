#!/bin/bash
# Piccola E-commerce - 生产环境启动脚本
# 用法: ./scripts/start.sh [端口]
# 优先使用 PM2 管理进程，回退到 nohup 模式

set -e

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# 配置
PORT=${1:-3000}
HOST="0.0.0.0"
PID_FILE="$PROJECT_DIR/.next.pid"
LOG_FILE="$PROJECT_DIR/logs/app.log"

# 检查是否已在运行
if command -v pm2 &> /dev/null && pm2 list 2>/dev/null | grep -q "piccola.*online"; then
  echo "⚠️  服务已在运行 (PM2: piccola)"
  exit 0
fi

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "⚠️  服务已在运行 (PID: $PID)"
    exit 1
  else
    rm -f "$PID_FILE"
  fi
fi

# 确保日志目录存在
mkdir -p "$(dirname "$LOG_FILE")"

# 检查是否已构建
if [ ! -d "frontend/.next" ]; then
  echo "❌ 未找到构建产物，请先运行: ./scripts/deploy.sh"
  exit 1
fi

echo "🚀 启动 Piccola 电商平台..."
echo "   - 环境: production"
echo "   - 地址: http://$HOST:$PORT"
echo ""

# 优先使用 PM2
if command -v pm2 &> /dev/null; then
  echo "📦 使用 PM2 管理进程..."
  cd "$PROJECT_DIR"

  # 删除旧进程（确保配置更新生效）
  pm2 delete piccola 2>/dev/null || true

  PORT=$PORT HOSTNAME=$HOST \
  pm2 start ecosystem.config.json

  pm2 save 2>/dev/null || true

  echo ""
  echo "✅ 服务启动成功! (PM2: piccola)"
  echo "   查看日志: pm2 logs piccola"
  echo "   查看状态: pm2 status"
else
  echo "📦 使用 nohup 模式..."
  cd frontend

  NODE_ENV=production \
  PORT=$PORT \
  HOSTNAME=$HOST \
  nohup npx next start > "$LOG_FILE" 2>&1 &

  PID=$!
  echo $PID > "$PID_FILE"

  sleep 3

  if kill -0 "$PID" 2>/dev/null; then
    echo ""
    echo "✅ 服务启动成功! PID: $PID"
    echo "   访问地址: http://$HOST:$PORT"
  else
    echo "❌ 服务启动失败，请查看日志: $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
fi
