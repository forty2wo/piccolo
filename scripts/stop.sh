#!/bin/bash
# Piccola E-commerce - 停止服务脚本
# 用法: ./scripts/stop.sh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

PID_FILE="$PROJECT_DIR/.next.pid"

# 优先用 PM2 停止
if command -v pm2 &> /dev/null && pm2 list 2>/dev/null | grep -q "piccola"; then
  echo "🛑 通过 PM2 停止服务..."
  pm2 stop ecosystem.config.json 2>/dev/null || pm2 stop piccola 2>/dev/null || true
  echo "✅ 服务已停止 (PM2)"
  exit 0
fi

# nohup 模式停止
if [ ! -f "$PID_FILE" ]; then
  echo "⚠️  未找到 PID 文件，服务可能未运行"
  exit 0
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
  echo "🛑 停止服务 (PID: $PID)..."
  kill "$PID"

  for i in {1..10}; do
    if ! kill -0 "$PID" 2>/dev/null; then
      break
    fi
    sleep 1
  done

  if kill -0 "$PID" 2>/dev/null; then
    echo "⚠️  进程未响应，强制终止..."
    kill -9 "$PID"
  fi

  rm -f "$PID_FILE"
  echo "✅ 服务已停止"
else
  echo "⚠️  进程不存在，清理 PID 文件"
  rm -f "$PID_FILE"
fi
