/**
 * 应用配置文件
 */

export const appConfig = {
  // 数据刷新间隔（毫秒）
  refreshInterval: 60000, // 1 分钟

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
