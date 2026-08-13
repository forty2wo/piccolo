#!/bin/bash
# Piccola E-commerce - 生产环境启动脚本
# 用法: ./scripts/start.sh [端口]

set -e

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# 配置
PORT=${1:-3000}
HOST="0.0.0.0"
NODE_ENV=production
PID_FILE="$PROJECT_DIR/.next.pid"
LOG_FILE="$PROJECT_DIR/logs/app.log"

# 检查是否已在运行
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "⚠️  服务已在运行 (PID: $PID)"
    exit 1
  else
    echo "🧹 清理过期的 PID 文件..."
    rm -f "$PID_FILE"
  fi
fi

# 确保日志目录存在
mkdir -p "$(dirname "$LOG_FILE")"

# 检查构建产物
if [ ! -d "frontend/.next/standalone" ]; then
  echo "❌ 未找到构建产物，请先运行: ./scripts/deploy.sh"
  exit 1
fi

echo "🚀 启动 Piccola 电商平台..."
echo "   - 环境: $NODE_ENV"
echo "   - 地址: http://$HOST:$PORT"
echo "   - 日志: $LOG_FILE"
echo ""

# 启动 Next.js (standalone 模式)
cd frontend

NODE_ENV=$NODE_ENV \
PORT=$PORT \
HOSTNAME=$HOST \
nohup node .next/standalone/server.js > "$LOG_FILE" 2>&1 &

PID=$!
echo $PID > "$PID_FILE"

# 等待服务启动
sleep 2

if kill -0 "$PID" 2>/dev/null; then
  echo "✅ 服务启动成功! PID: $PID"
  echo "   访问地址: http://$HOST:$PORT"
else
  echo "❌ 服务启动失败，请查看日志: $LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi
