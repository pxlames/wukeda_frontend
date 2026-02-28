/**
 * 设备配置文件
 * 包含设备类型的中文映射
 */

import { DeviceType } from '../types/device.types';

/**
 * 设备类型中文名称映射
 */
export const DEVICE_TYPE_NAMES: Record<DeviceType, string> = {
  Environment: '智能空气质量',
  FumeHood: '通风柜',
  WaterImmersion: '漏水检测',
  WaterMeter: '智能水表',
  ElectricMeter: '智能电表',
  FrequencyConverter: '排风机',
  GasPathHost: '气路主机',
};

/**
 * 获取设备类型的中文名称
 */
export const getDeviceTypeName = (type: DeviceType): string => {
  return DEVICE_TYPE_NAMES[type] || type;
};
