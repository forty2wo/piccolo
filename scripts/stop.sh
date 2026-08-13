#!/bin/bash
# Piccola E-commerce - 停止服务脚本
# 用法: ./scripts/stop.sh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$PROJECT_DIR/.next.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "⚠️  未找到 PID 文件，服务可能未运行"
  exit 0
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
  echo "🛑 停止服务 (PID: $PID)..."
  kill "$PID"

  # 等待进程结束
  for i in {1..10}; do
    if ! kill -0 "$PID" 2>/dev/null; then
      break
    fi
    sleep 1
  done

  # 强制结束
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
