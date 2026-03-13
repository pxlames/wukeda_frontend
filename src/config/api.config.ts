/**
 * API 配置文件
 * 用于配置后端服务地址和相关参数
 */

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
  };
}

// 根据环境变量或默认值配置后端地址
const getBaseURL = (): string => {
  // 开发环境固定走同源路径，由 Vite 代理到后端，避免浏览器 CORS
  if (import.meta.env.MODE === 'development') {
    return '';
  }

  // 优先使用环境变量
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // 如果环境变量存在且不为空，使用环境变量
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  
  // 生产环境默认走同源（推荐由 Nginx 将 /api 转发到后端）
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  // 无 window 场景兜底
  return '';
};

export const apiConfig: ApiConfig = {
  baseURL: getBaseURL(),
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
};

// 导出常用的 API 端点
export const API_ENDPOINTS = {
  // 认证
  LOGIN: '/api/auth/login',
  
  // 设备监控
  DEVICES: '/api/devices',
  DEVICE_HISTORY: (deviceId: string) => `/api/devices/${deviceId}/history`,
  DEVICE_ALARMS: (deviceId: string) => `/api/devices/${deviceId}/alarms`,
  
  // 首页
  HOME_FUME_HOOD: (deviceId: string) => `/api/home/fume-hood/${deviceId}`,
  HOME_ENVIRONMENT: (deviceId: string) => `/api/home/environment/${deviceId}`,
  HOME_ELECTRIC_METER: (deviceId: string) => `/api/home/electric-meter/${deviceId}`,
  HOME_EXHAUST_FAN: (deviceId: string) => `/api/home/exhaust-fan/${deviceId}`,
  HOME_WATER_METER: (deviceId: string) => `/api/home/water-meter/${deviceId}`,
  HOME_WATER_IMMERSION: (deviceId: string) => `/api/home/water-immersion/${deviceId}`,
  
  // 历史数据
  HISTORY_ENVIRONMENT: (deviceId: string) => `/api/history/environment/${deviceId}`,
  HISTORY_WATER_METER: (deviceId: string) => `/api/history/water-meter/${deviceId}`,
  HISTORY_ELECTRIC_METER: (deviceId: string) => `/api/history/electric-meter/${deviceId}`,
  HISTORY_FUME_HOOD: (deviceId: string) => `/api/history/fume-hood/${deviceId}`,
  HISTORY_WATER_IMMERSION: (deviceId: string) => `/api/history/water-immersion/${deviceId}`,
  HISTORY_EXHAUST_FAN: (deviceId: string) => `/api/history/exhaust-fan/${deviceId}`,
  HISTORY_DATA: (deviceType: string, deviceId: string) => `/api/history/${deviceType}/${deviceId}`,
  
  // 报警
  ALARMS: '/api/alarms',
  ALARMS_STATS: '/api/alarms/stats',
  
  // 环境
  ENVIRONMENT_DEVICES: '/api/environment/devices',
  ENVIRONMENT_FLOOR_DEVICES: (floor: string) => `/api/environment/floors/${floor}/devices`,
  ENVIRONMENT_FLOOR_TEMPERATURE_TODAY: (floor: string) => `/api/environment/floors/${floor}/temperature/today`,
  ENVIRONMENT_FLOOR_HISTORY: (floor: string) => `/api/environment/floors/${floor}/history`,
  ENVIRONMENT_FLOOR_SUMMARY: (floor: string) => `/api/environment/floors/${floor}/summary`,
  ENVIRONMENT_DEVICE_SNAPSHOT: (deviceId: string) => `/api/environment/devices/${deviceId}/snapshot`,
  ENVIRONMENT_DEVICE_REALTIME: (deviceId: string) => `/api/environment/devices/${deviceId}/realtime`,
  ENVIRONMENT_WEATHER_TODAY: (deviceId: string) => `/api/environment/devices/${deviceId}/weather/today`,
  
  // 排风
  EXHAUST_FANS: '/api/exhaust-fans',
  EXHAUST_FLOOR_DEVICES: (floor: string) => `/api/exhaust-fans/floors/${floor}/devices`,
  EXHAUST_FAN_STATUS: (deviceId: string) => `/api/exhaust-fans/${deviceId}/status`,
  
  // 通风
  VENTILATION_FLOOR_DEVICES: (floor: string) => `/api/ventilation/floors/${floor}/devices`,
  VENTILATION_HOOD_STATUS: (deviceId: string) => `/api/ventilation/hoods/${deviceId}/status`,
  
  // 能耗
  ENERGY_METERS: '/api/energy/meters',
  ENERGY_SUMMARY: '/api/energy/summary',
  ENERGY_TREND: '/api/energy/trend',
  ENERGY_FLOORS: '/api/energy/floors',
  ENERGY_FLOOR_SUMMARY: (floor: string) => `/api/energy/floors/${floor}/summary`,
  ENERGY_FLOOR_ROOMS: (floor: string) => `/api/energy/floors/${floor}/rooms`,
  ENERGY_FLOOR_TREND: (floor: string) => `/api/energy/floors/${floor}/trend`,
  ENERGY_ELECTRIC_METERS: '/api/energy/electric-meters',
  ENERGY_WATER_METERS: '/api/energy/water-meters',
  
  // 简介
  LAB_INTRO: '/api/lab/intro',
};

export default apiConfig;
