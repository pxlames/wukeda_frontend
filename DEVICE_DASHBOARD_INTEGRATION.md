# 设备监测页面前后端联调实现文档

## 实现概述

已完成设备监测页面（DeviceDashboard）的前后端联调，实现了以下功能：

1. ✅ 自动登录认证
2. ✅ 获取并显示真实设备数据
3. ✅ 支持楼层筛选切换
4. ✅ 自动刷新（1分钟间隔，可配置）
5. ✅ 支持所有设备类型的动态渲染

## 架构设计

### 1. 类型系统 (`src/types/device.types.ts`)

定义了完整的设备类型系统：
- 6种设备类型：FumeHood、Environment、ElectricMeter、WaterMeter、WaterImmersion、FrequencyConverter
- 每种设备的状态和参数接口
- TypeScript 类型安全保障

### 2. 认证系统 (`src/utils/auth.ts`)

实现了公共认证方法：
- `ensureAuthenticated()` - 确保已认证，未登录则自动登录
- `autoLogin()` - 使用固定账号自动登录
- `saveToken()` / `getToken()` / `clearToken()` - Token 管理
- Token 过期检查（默认24小时）

### 3. API 服务层 (`src/services/api.service.ts`)

新增设备服务方法：
```typescript
deviceService.getAllDevices(floor?: string): Promise<Device[]>
```

### 4. 自定义 Hook (`src/hooks/useDevices.ts`)

封装设备数据获取逻辑：
```typescript
const { devices, loading, error, refresh } = useDevices({
  floor: '2F',           // 可选：楼层筛选
  autoRefresh: true,     // 是否自动刷新
  refreshInterval: 60000 // 刷新间隔（毫秒）
});
```

特性：
- 自动认证
- 自动刷新
- 加载状态管理
- 错误处理

### 5. 设备卡片组件 (`src/components/DeviceCard/`)

为每种设备类型创建了专用卡片组件：
- `FumeHoodCard.tsx` - 通风柜（4个状态徽章 + 4个参数）
- `EnvironmentCard.tsx` - 环境设备（温湿度、CO2、CO、TVOC）
- `ElectricMeterCard.tsx` - 电表（电压、电流、功率等）
- `WaterMeterCard.tsx` - 水表（用水量、流量、阀门状态）
- `WaterImmersionCard.tsx` - 浸水检测器（浸水状态、报警状态）
- `FrequencyConverterCard.tsx` - 排风机（压力、频率、转速等）
- `index.tsx` - 统一入口，根据设备类型自动渲染对应卡片

### 6. 页面组件更新

#### DeviceStatusDashboardSection
- 使用 `useDevices` Hook 获取数据
- 显示加载中、错误、无数据状态
- 动态渲染设备卡片（每行3个）
- 支持楼层筛选

#### NavigationSidebarSection
- 支持楼层切换
- 高亮当前选中楼层
- 回调函数通知父组件

#### DeviceDashboard
- 管理楼层选择状态
- 传递楼层参数给子组件

## 配置文件

### 应用配置 (`src/config/app.config.ts`)

```typescript
export const appConfig = {
  refreshInterval: 60000,  // 1分钟刷新
  autoRefresh: true,       // 启用自动刷新
  defaultFloor: '2F',      // 默认楼层
};
```

### API 配置 (`src/config/api.config.ts`)

已包含所有设备监测相关的 API 端点。

### 环境变量 (`.env.development`)

```env
VITE_API_BASE_URL=http://47.117.105.21:8080
```

## 使用流程

### 1. 页面加载流程

```
用户访问 /device-dashboard
    ↓
DeviceDashboard 组件初始化
    ↓
DeviceStatusDashboardSection 调用 useDevices Hook
    ↓
useDevices 调用 ensureAuthenticated()
    ↓
检查 Token → 无 Token → autoLogin() → 保存 Token
    ↓
调用 deviceService.getAllDevices(floor)
    ↓
请求 GET /api/devices?floor=2F
    ↓
返回设备列表数据
    ↓
根据设备类型渲染对应卡片
```

### 2. 楼层切换流程

```
用户点击楼层按钮（如 "3F"）
    ↓
NavigationSidebarSection 触发 onFloorChange('3F')
    ↓
DeviceDashboard 更新 selectedFloor 状态
    ↓
DeviceStatusDashboardSection 接收新的 floor 参数
    ↓
useDevices Hook 检测到 floor 变化
    ↓
重新请求 GET /api/devices?floor=3F
    ↓
更新设备列表
```

### 3. 自动刷新流程

```
页面加载完成
    ↓
useDevices 启动定时器（60秒）
    ↓
定时器触发
    ↓
调用 fetchDevices()
    ↓
请求 GET /api/devices?floor=当前楼层
    ↓
更新设备数据（不显示加载状态）
    ↓
等待下一个周期
```

## API 接口对接

### 请求示例

```bash
# 获取所有楼层设备
GET http://47.117.105.21:8080/api/devices
Header: X-Authorization: Bearer {token}

# 获取指定楼层设备
GET http://47.117.105.21:8080/api/devices?floor=2F
Header: X-Authorization: Bearer {token}
```

### 响应示例

```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "total": 9,
    "list": [
      {
        "device_id": "xxx",
        "interface_name": "F0203-2层制片室",
        "device_type": "FumeHood",
        "floor": "2F",
        "room": "F0203",
        "online": true,
        "status": {
          "device_on_off": "停机",
          "air_shortage": "正常",
          "area_sensor_enabled": "使能",
          "window_motor": "正常"
        },
        "parameters": {
          "window_height_limit": "正常",
          "valve_opening": 0,
          "face_wind_speed": 0,
          "window_height": 308,
          "exhaust_air_speed": 0,
          "exhaust_air_volume": 0
        },
        "last_update": 1767100821479
      }
    ]
  }
}
```

## 运行项目

### 1. 安装依赖

```bash
cd wukeda_frontend_react
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问页面

```
http://localhost:5173/device-dashboard
```

## 功能验证

### 1. 自动登录
- 打开浏览器开发者工具 → Network
- 访问页面，应该看到 `/api/auth/login` 请求
- 检查 LocalStorage，应该有 `auth_token`

### 2. 设备数据加载
- 应该看到 `/api/devices?floor=2F` 请求
- 页面显示设备卡片
- 不同设备类型显示不同的卡片样式

### 3. 楼层切换
- 点击左侧楼层按钮（如 "3F"）
- 应该看到新的 `/api/devices?floor=3F` 请求
- 设备列表更新为 3F 的设备

### 4. 自动刷新
- 等待 1 分钟
- 应该看到新的 `/api/devices` 请求
- 设备数据自动更新

### 5. 错误处理
- 断开网络连接
- 页面应显示错误提示

## 配置调整

### 修改刷新间隔

编辑 `src/config/app.config.ts`：

```typescript
export const appConfig = {
  refreshInterval: 30000, // 改为 30 秒
  autoRefresh: true,
};
```

### 禁用自动刷新

编辑 `src/hooks/useDevices.ts` 调用：

```typescript
const { devices, loading, error } = useDevices({
  floor,
  autoRefresh: false, // 禁用自动刷新
});
```

### 修改默认楼层

编辑 `src/screens/DeviceDashboard/DeviceDashboard.tsx`：

```typescript
const [selectedFloor, setSelectedFloor] = useState<string | undefined>('3F');
```

## 注意事项

1. **Token 管理**：Token 默认有效期 24 小时，过期后会自动重新登录
2. **设备类型**：系统支持 6 种设备类型，会根据 `device_type` 自动渲染对应卡片
3. **楼层筛选**：点击"楼层"按钮会显示所有楼层的设备
4. **性能优化**：使用 React.memo 和 useCallback 优化渲染性能
5. **错误处理**：网络错误会显示友好的错误提示

## 后续优化建议

1. 添加设备详情弹窗（点击卡片查看详细信息）
2. 添加设备搜索功能
3. 添加设备类型筛选
4. 添加设备状态统计（在线/离线数量）
5. 优化卡片样式（根据设备状态动态改变颜色）
6. 添加骨架屏加载效果
7. 添加数据导出功能

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Fetch API

## 文件清单

### 新增文件
- `src/types/device.types.ts` - 设备类型定义
- `src/utils/auth.ts` - 认证工具
- `src/hooks/useDevices.ts` - 设备数据 Hook
- `src/config/app.config.ts` - 应用配置
- `src/components/DeviceCard/index.tsx` - 设备卡片入口
- `src/components/DeviceCard/FumeHoodCard.tsx` - 通风柜卡片
- `src/components/DeviceCard/EnvironmentCard.tsx` - 环境设备卡片
- `src/components/DeviceCard/ElectricMeterCard.tsx` - 电表卡片
- `src/components/DeviceCard/WaterMeterCard.tsx` - 水表卡片
- `src/components/DeviceCard/WaterImmersionCard.tsx` - 浸水检测器卡片
- `src/components/DeviceCard/FrequencyConverterCard.tsx` - 排风机卡片

### 修改文件
- `src/services/api.service.ts` - 新增 getAllDevices 方法
- `src/screens/DeviceDashboard/DeviceDashboard.tsx` - 添加楼层状态管理
- `src/screens/DeviceDashboard/sections/DeviceStatusDashboardSection.tsx` - 使用真实数据
- `src/screens/DeviceDashboard/sections/NavigationSidebarSection.tsx` - 添加楼层切换

## 联系方式

如有问题，请联系开发团队。
