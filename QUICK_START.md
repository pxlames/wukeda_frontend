# 🚀 快速启动指南

## 前置条件

- Node.js >= 16
- npm 或 yarn
- 后端服务运行在 `http://47.117.105.21:8080`

## ⚠️ 重要：CORS 跨域问题已解决

本项目使用 **Vite 代理** 解决跨域问题：
- 开发环境：前端请求 `/api/*` 会自动代理到 `http://47.117.105.21:8080/api/*`
- 生产环境：需要后端配置 CORS 或使用 Nginx 反向代理

## 5 分钟快速启动

### 1. 安装依赖（首次运行）

```bash
cd wukeda_frontend_react
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

**重要**：修改配置后必须重启开发服务器！

### 3. 访问页面

打开浏览器访问：
```
http://localhost:5173/device-dashboard
```

## 验证功能

### ✅ 自动登录
- 打开浏览器开发者工具（F12）
- 切换到 Network 标签
- 刷新页面，应该看到 `/api/auth/login` 请求成功

### ✅ 设备数据加载
- 页面应该显示设备卡片
- 不同设备类型显示不同的卡片样式
- 在线设备显示绿色指示灯，离线设备显示红色

### ✅ 楼层切换
- 点击左侧楼层按钮（如 "3F"）
- 设备列表应该更新为该楼层的设备
- 当前选中楼层按钮文字为白色

### ✅ 自动刷新
- 等待 1 分钟
- 在 Network 标签中应该看到新的 `/api/devices` 请求
- 设备数据自动更新

## 常见问题

### Q: 页面显示"加载失败"或"Failed to fetch"
**A:** 这是 CORS 跨域问题，已通过 Vite 代理解决：

1. 确认 `.env.development` 中 `VITE_API_BASE_URL` 为空：
   ```env
   VITE_API_BASE_URL=
   ```

2. 确认 `vite.config.ts` 中有代理配置：
   ```typescript
   server: {
     proxy: {
       '/api': {
         target: 'http://47.117.105.21:8080',
         changeOrigin: true,
       },
     },
   }
   ```

3. **重启开发服务器**（Ctrl+C 然后 `npm run dev`）

4. 检查后端服务是否正常：
   ```bash
   curl http://47.117.105.21:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"tenant@thingsboard.org","password":"tenant"}'
   ```

### Q: 如何修改后端地址？
**A:** 

**开发环境（推荐使用代理）：**
编辑 `vite.config.ts`：
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8080', // 修改这里
      changeOrigin: true,
    },
  },
}
```

**或者直接访问后端（如果后端支持 CORS）：**
编辑 `.env.development`：
```env
VITE_API_BASE_URL=http://your-backend-url:8080
```

**生产环境：**
编辑 `.env.production`：
```env
VITE_API_BASE_URL=http://your-backend-url:8080
```

修改后必须重启开发服务器！

### Q: 如何修改刷新间隔？
**A:** 编辑 `src/config/app.config.ts`：
```typescript
export const appConfig = {
  refreshInterval: 30000, // 改为 30 秒
};
```

### Q: 如何禁用自动刷新？
**A:** 编辑 `src/config/app.config.ts`：
```typescript
export const appConfig = {
  autoRefresh: false, // 禁用自动刷新
};
```

## 测试工具

### 使用 API 测试页面
在浏览器中打开 `test-api.html` 文件：
```bash
open test-api.html  # macOS
start test-api.html # Windows
```

功能：
- 测试登录
- 获取设备列表
- 按楼层筛选
- 查看设备统计

## 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录。

## 目录结构

```
wukeda_frontend_react/
├── src/
│   ├── components/DeviceCard/    # 设备卡片组件
│   ├── hooks/useDevices.ts       # 设备数据 Hook
│   ├── utils/auth.ts             # 认证工具
│   ├── services/api.service.ts   # API 服务
│   └── screens/DeviceDashboard/  # 设备监测页面
├── .env.development              # 开发环境配置
├── test-api.html                 # API 测试工具
└── QUICK_START.md                # 本文件
```

## 下一步

- 查看 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) 了解完整实现
- 查看 [DEVICE_DASHBOARD_INTEGRATION.md](./DEVICE_DASHBOARD_INTEGRATION.md) 了解技术细节
- 查看 [CONFIG.md](./CONFIG.md) 了解配置选项

## 技术支持

遇到问题？
1. 检查浏览器控制台错误信息
2. 检查 Network 标签的请求响应
3. 使用 `test-api.html` 测试 API 连接
4. 查看详细文档

祝你使用愉快！🎉
