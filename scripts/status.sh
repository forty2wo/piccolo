#!/bin/bash
# Piccola E-commerce - 服务状态查询
# 用法: ./scripts/status.sh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$PROJECT_DIR/.next.pid"
LOG_DIR="$PROJECT_DIR/logs"

echo "📊 Piccola 电商平台 - 服务状态"
echo "================================"

# 优先检查 PM2
if command -v pm2 &> /dev/null; then
  PM2_STATUS=$(pm2 list 2>/dev/null | grep "piccola" || true)
  if echo "$PM2_STATUS" | grep -q "online"; then
    echo "✅ 运行中 (PM2: piccola)"
    echo ""
    pm2 jlist 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
for p in data:
    if p['name'] == 'piccola':
        pm = p['pm2_env']
        print(f'   PID:      {p[\"pid\"]}')
        print(f'   运行时间: {pm[\"pm_uptime\"] and int((__import__(\"time\").time()*1000 - pm[\"pm_uptime\"])/1000) or 0}s')
        print(f'   重启次数: {pm[\"restart_time\"]}')
        print(f'   内存:     {round(p[\"monit\"][\"memory\"]/1024/1024, 1)} MB')
        print(f'   CPU:      {p[\"monit\"][\"cpu\"]}%')
        print(f'   日志:     ~/.pm2/logs/')
" 2>/dev/null || true
    echo ""
    echo "提示: pm2 logs piccola  # 查看日志"
    exit 0
  elif echo "$PM2_STATUS" | grep -q "stopped"; then
    echo "⏸️  已停止 (PM2: piccola)"
  fi
fi

# nohup 模式检查
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "✅ 运行中 (PID: $PID)"

    if command -v ss &> /dev/null; then
      PORT=$(ss -tlnp 2>/dev/null | grep "$PID" | awk '{print $4}' | head -1)
      if [ -n "$PORT" ]; then
        echo ""
        echo "监听端口: $PORT"
      fi
    fi

    if [ -f "$LOG_DIR/app.log" ]; then
      echo ""
      echo "最近日志 (最后 5 行):"
      tail -5 "$LOG_DIR/app.log"
    fi
  else
    echo "❌ 已停止 (PID 文件存在但进程不存在)"
    rm -f "$PID_FILE"
  fi
else
  if ! command -v pm2 &> /dev/null; then
    echo "⏸️  未运行"
  fi
fi
