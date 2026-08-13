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

## 进程管理

脚本自动检测系统中的进程管理器，优先级别：
1. **PM2** - 如果系统已安装 PM2，优先使用 PM2 管理（推荐用于生产环境）
2. **nohup** - 没有 PM2 时回退到 nohup 后台模式

### PM2 常用命令

```bash
# 查看状态
pm2 status

# 查看实时日志
pm2 logs piccola

# 查看错误日志
pm2 logs piccola --err

# 重启
pm2 restart piccola

# 停止
pm2 stop piccola

# 配置开机自启
pm2 startup
pm2 save
```

## 技术细节

- **运行模式**: Next.js standalone 模式（`next.config.js` 中 `output: 'standalone'`）
- **进程管理**: PM2（推荐）或 nohup + PID 文件
- **日志**: PM2 模式下在 `~/.pm2/logs/`，nohup 模式下在 `logs/app.log`
- **端口**: 默认 3000，可通过参数自定义
- **主机绑定**: `0.0.0.0`（允许外部访问）
- **配置文件**: `ecosystem.config.json`（PM2 配置）

## 生产环境建议

1. **反向代理**: 建议使用 Nginx 做反向代理，配置 SSL 证书
2. **进程守护**: PM2 已集成，配置 `pm2 startup` 实现开机自启
3. **环境变量**: 将敏感配置放在 `frontend/.env.local` 中
4. **日志轮转**: PM2 自带日志管理，也可配置 logrotate
5. **监控**: 可通过 `pm2 monit` 实时监控资源使用
