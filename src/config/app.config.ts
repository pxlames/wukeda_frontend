/**
 * 应用配置文件
 * 设备看板刷新间隔可通过环境变量 VITE_DEVICE_DASHBOARD_REFRESH_INTERVAL（毫秒）覆盖
 */

const envRefreshMs = import.meta.env.VITE_DEVICE_DASHBOARD_REFRESH_INTERVAL;
const deviceDashboardRefreshFromEnv =
  typeof envRefreshMs !== 'undefined' && envRefreshMs !== ''
    ? Number(envRefreshMs)
    : undefined;

export const appConfig = {
  // 设备看板页面的数据刷新间隔（毫秒），默认 1 秒，可用 VITE_DEVICE_DASHBOARD_REFRESH_INTERVAL 配置
  deviceDashboardRefreshInterval:
    deviceDashboardRefreshFromEnv != null && !Number.isNaN(deviceDashboardRefreshFromEnv) && deviceDashboardRefreshFromEnv > 0
      ? deviceDashboardRefreshFromEnv
      : 1000,

  // 是否启用自动刷新
  autoRefresh: true,

  // 默认楼层
  defaultFloor: '2F',

  // 分页配置
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 200,
  },

  // 请求超时时间（毫秒）
  requestTimeout: 30000,
};

export default appConfig;
