#!/bin/bash
# Piccola E-commerce - 服务状态查询
# 用法: ./scripts/status.sh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$PROJECT_DIR/.next.pid"
LOG_FILE="$PROJECT_DIR/logs/app.log"

echo "📊 Piccola 电商平台 - 服务状态"
echo "================================"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "✅ 运行中 (PID: $PID)"

    # 获取进程信息
    if command -v ps &> /dev/null; then
      echo ""
      echo "进程详情:"
      ps -p "$PID" -o pid,ppid,etime,cmd --no-headers 2>/dev/null || echo "  PID: $PID"
    fi

    # 检查端口
    if command -v ss &> /dev/null; then
      PORT=$(ss -tlnp 2>/dev/null | grep "$PID" | awk '{print $4}' | head -1)
      if [ -n "$PORT" ]; then
        echo ""
        echo "监听端口: $PORT"
      fi
    elif command -v netstat &> /dev/null; then
      PORT=$(netstat -tlnp 2>/dev/null | grep "$PID" | awk '{print $4}' | head -1)
      if [ -n "$PORT" ]; then
        echo ""
        echo "监听端口: $PORT"
      fi
    fi

    # 最近日志
    if [ -f "$LOG_FILE" ]; then
      echo ""
      echo "最近日志 (最后 5 行):"
      tail -5 "$LOG_FILE"
    fi
  else
    echo "❌ 已停止 (PID 文件存在但进程不存在)"
    rm -f "$PID_FILE"
  fi
else
  echo "⏸️  未运行"
fi
