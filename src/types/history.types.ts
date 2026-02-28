/**
 * 历史数据相关类型定义
 */

import { DeviceType } from './device.types';

/**
 * 时间序列数据点
 */
export interface TimeSeriesPoint {
  ts: number; // 时间戳（毫秒）
  value: string | number; // 值
}

/**
 * 统计信息
 */
export interface Statistics {
  avg: number;
  max: number;
  min: number;
}

/**
 * 告警信息
 */
export interface AlarmInfo {
  content: string;
  category: string;
}

/**
 * 历史数据响应
 */
export interface HistoryDataResponse {
  device_id: string;
  interface_name: string;
  device_type: DeviceType;
  timeseries: Record<string, TimeSeriesPoint[]>;
  statistics: Record<string, Statistics>;
  alarms: AlarmInfo[];
}

/**
 * 历史数据查询参数
 */
export interface HistoryQueryParams {
  deviceType: DeviceType;
  deviceId: string;
  timeLength: number; // 毫秒
  dataCount?: number; // 默认100
  parameters: string[]; // 选中的参数列表
}
