# 前端配置说明

## 环境变量配置

项目使用 Vite 的环境变量系统来管理不同环境的配置。

### 配置文件

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.local` - 本地配置（优先级最高，不会被提交到 Git）
- `.env.example` - 配置示例文件

### 配置后端 API 地址

#### 方法 1: 使用环境变量文件

1. 复制 `.env.example` 为 `.env.local`:
```bash
cp .env.example .env.local
```

2. 修改 `.env.local` 中的 API 地址:
```env
VITE_API_BASE_URL=http://your-backend-url:8080
```

#### 方法 2: 直接修改环境配置文件

开发环境修改 `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

生产环境修改 `.env.production`:
```env
VITE_API_BASE_URL=http://47.117.105.21:8080
```

### 配置优先级

```
.env.local > .env.[mode] > .env
```

其中 `[mode]` 是 `development` 或 `production`。

## API 配置文件

### `src/config/api.config.ts`

这是 API 配置的核心文件，包含：

- `baseURL`: 后端服务地址（从环境变量读取）
- `timeout`: 请求超时时间（默认 30 秒）
- `headers`: 默认请求头
- `API_ENDPOINTS`: 所有 API 端点的定义

### 使用示例

```typescript
import { apiConfig, API_ENDPOINTS } from '@/config/api.config';

// 获取配置的后端地址
console.log(apiConfig.baseURL);

// 使用 API 端点
const url = API_ENDPOINTS.DEVICES;
```

## HTTP 请求工具

### `src/utils/request.ts`

封装了统一的 HTTP 请求方法，自动处理：

- 认证 Token（自动添加 `X-Authorization` 头）
- 请求超时
- 错误处理
- 401 自动跳转登录

### 使用示例

```typescript
import { request } from '@/utils/request';

// GET 请求
const response = await request.get('/api/devices', {
  params: { floor: '2F' }
});

// POST 请求
const response = await request.post('/api/auth/login', {
  username: 'admin',
  password: 'password'
});
```

## API 服务层

### `src/services/api.service.ts`

封装了所有后端接口调用，提供类型安全的 API 方法。

### 使用示例

```typescript
import apiService from '@/services/api.service';

// 登录
const token = await apiService.auth.login('admin', 'password');

// 获取设备列表
const devices = await apiService.device.getDevices({
  floor: '2F',
  page: 0,
  pageSize: 20
});

// 获取环境数据
const summary = await apiService.environment.getFloorSummary('2F');
```

## 开发调试

### 查看当前配置

在浏览器控制台执行：

```javascript
import { apiConfig } from './src/config/api.config';
console.log('API Base URL:', apiConfig.baseURL);
console.log('Environment:', import.meta.env.MODE);
```

### 切换环境

开发环境：
```bash
npm run dev
```

生产环境构建：
```bash
npm run build
```

## 常见问题

### Q: 如何修改后端地址？

A: 创建 `.env.local` 文件并设置 `VITE_API_BASE_URL`。

### Q: 为什么修改配置后没有生效？

A: 需要重启开发服务器（`npm run dev`）。

### Q: 如何在代码中访问环境变量？

A: 使用 `import.meta.env.VITE_变量名`。

### Q: 生产环境如何配置？

A: 修改 `.env.production` 文件，或在构建时通过环境变量传入：
```bash
VITE_API_BASE_URL=http://production-url:8080 npm run build
```

## 注意事项

1. 环境变量必须以 `VITE_` 开头才能在客户端代码中访问
2. `.env.local` 文件不会被提交到 Git，适合存放本地配置
3. 修改环境变量后需要重启开发服务器
4. 生产构建时会使用 `.env.production` 的配置
