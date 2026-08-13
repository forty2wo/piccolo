# 部署脚本说明

## 脚本列表

| 脚本 | 用途 |
|------|------|
| `deploy.sh` | 安装依赖 + 构建生产版本 |
| `start.sh` | 启动生产服务（后台运行） |
| `stop.sh` | 停止服务 |
| `status.sh` | 查看服务状态 |
| `redeploy.sh` | 拉取代码 + 重新构建 + 重启 |

## 使用方法

### 首次部署

```bash
# 1. 进入项目目录
cd /home/ubuntu/piccola

# 2. 安装依赖并构建
./scripts/deploy.sh

# 3. 启动服务（默认端口 3000）
./scripts/start.sh

# 4. 指定端口启动
./scripts/start.sh 8080
```

### 日常运维

```bash
# 查看状态
./scripts/status.sh

# 停止服务
./scripts/stop.sh

# 重新部署（拉取最新代码 + 构建 + 重启）
./scripts/redeploy.sh
```

## 技术细节

- **运行模式**: Next.js standalone 模式（`next.config.js` 中 `output: 'standalone'`）
- **进程管理**: 通过 PID 文件（`.next.pid`）管理后台进程
- **日志**: 输出到 `logs/app.log`
- **端口**: 默认 3000，可通过参数自定义
- **主机绑定**: `0.0.0.0`（允许外部访问）

## 生产环境建议

1. **反向代理**: 建议使用 Nginx 做反向代理，配置 SSL
2. **进程守护**: 生产环境建议使用 PM2 或 systemd 管理进程
3. **环境变量**: 将敏感配置放在 `.env.local` 中
4. **日志轮转**: 配置 logrotate 管理日志文件大小
