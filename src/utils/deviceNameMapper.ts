/**
 * 设备名称映射工具
 * 将英文设备类型转换为中文，保留设备编号
 */

import { DeviceType } from '../types/device.types';

/** 设备类型中文名称（与历史数据页设计图一致） */
export const DEVICE_TYPE_CN_NAMES: Record<DeviceType, string> = {
  Environment: '智能空气质量',
  FumeHood: '通风柜',
  WaterImmersion: '漏水检测',
  WaterMeter: '智能水表',
  ElectricMeter: '智能电表',
  FrequencyConverter: '排风机',
  GasPathHost: '气路主机',
};

/**
 * 设备类型英文名称映射（用于替换）
 * 使用更精确的匹配模式，避免误删楼层信息
 */
const DEVICE_TYPE_EN_PATTERNS: Record<DeviceType, RegExp> = {
  Environment: /Env_Sensor/g,
  FumeHood: /FumeHood/g,
  WaterImmersion: /WaterSensor/g,
  WaterMeter: /WaterMeter/g,
  ElectricMeter: /ElectricMeter/g,
  FrequencyConverter: /FrequencyConverter/g,
  GasPathHost: /GasPathHost/g,
};

/**
 * 将设备名称中的英文类型替换为中文，保留编号和其他信息
 * @param deviceType 设备类型
 * @param interfaceName 设备接口名称（后端返回的原始名称）
 * @returns 中文化的设备名称
 * 
 * 示例:
 * - "Env_Sensor_2F_21" -> "智能空气质量_2F_21"
 * - "FumeHood_3F_101" -> "通风柜_3F_101"
 * - "WaterMeter_2F_82" -> "智能水表_2F_82"
 * - "FrequencyConverter_2F_1" -> "排风机_2F_1"
 */
export const getDeviceDisplayName = (deviceType: DeviceType, interfaceName?: string): string => {
  if (!interfaceName) {
    return DEVICE_TYPE_CN_NAMES[deviceType] || deviceType;
  }

  const cnTypeName = DEVICE_TYPE_CN_NAMES[deviceType];
  const enPattern = DEVICE_TYPE_EN_PATTERNS[deviceType];

  if (cnTypeName && enPattern) {
    // 替换英文类型名称为中文，保留其他部分
    const result = interfaceName.replace(enPattern, cnTypeName);
    
    // 调试日志（生产环境可以删除）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[设备名称转换] ${interfaceName} -> ${result}`);
    }
    
    return result;
  }

  return interfaceName;
};
