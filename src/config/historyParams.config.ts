/**
 * 历史数据参数配置
 * 定义每种设备类型的可查询参数
 */

import { DeviceType } from '../types/device.types';

export interface ParameterOption {
  id: string;
  label: string;
  unit?: string;
}

/**
 * 设备类型对应的历史数据参数配置
 */
export const DEVICE_HISTORY_PARAMETERS: Record<DeviceType, ParameterOption[]> = {
  // 环境设备参数
  Environment: [
    { id: 'temperature', label: '温度', unit: '℃' },
    { id: 'humidity', label: '湿度', unit: '%RH' },
    { id: 'co2', label: 'CO₂', unit: 'ppm' },
    { id: 'tvoc', label: 'TVOC', unit: 'mg/m³' },
    { id: 'co', label: 'CO', unit: 'ppm' },
  ],

  // 通风柜参数
  FumeHood: [
    { id: 'operatingStatus', label: '运行状态' },
    { id: 'windowHeight', label: '视窗高度', unit: 'mm' },
    { id: 'exhaustAirSpeed', label: '排风速度', unit: 'm/s' },
    { id: 'exhaustAirVolume', label: '排风量', unit: 'm³/h' },
    { id: 'valveOpening', label: '阀门开度', unit: '%' },
    { id: 'forcedExhaustSwitch', label: '强排开关' },
    { id: 'alarmInfo', label: '报警信息' },
  ],

  // 水浸传感器参数
  WaterImmersion: [
    { id: 'immersionStatus', label: '浸水状态' },
    { id: 'alarmStatus', label: '报警状态' },
  ],

  // 智能水表参数
  WaterMeter: [
    { id: 'totalWaterConsumption', label: '总用水量', unit: 'm³' },
    { id: 'instantaneousFlow', label: '瞬时流量', unit: 'm³/h' },
    { id: 'valveStatus', label: '阀门状态' },
  ],

  // 智能电表参数
  ElectricMeter: [
    { id: 'phaseAVoltage', label: 'A相电压', unit: 'V' },
    { id: 'phaseBVoltage', label: 'B相电压', unit: 'V' },
    { id: 'phaseCVoltage', label: 'C相电压', unit: 'V' },
    { id: 'current', label: '电流', unit: 'A' },
    { id: 'power', label: '功率', unit: 'kW' },
    { id: 'frequency', label: '频率', unit: 'Hz' },
    { id: 'powerFactor', label: '功率因素' },
    { id: 'bidirectionalEnergy', label: '双向电能', unit: 'kWh' },
    { id: 'fourQuadrantEnergy', label: '四象限电能', unit: 'kWh' },
    { id: 'multiRateEnergy', label: '复费率电能', unit: 'kWh' },
    { id: 'accumulatedEnergy', label: '累积电能', unit: 'kWh' },
  ],

  // 排风机（变频器）参数
  FrequencyConverter: [
    { id: 'startIndicator', label: '运行状态' },
    { id: 'operatingFrequency', label: '运行频率', unit: 'Hz' },
    { id: 'operatingSpeed', label: '运行转速', unit: 'r/min' },
    { id: 'ductPressure', label: '管道压力', unit: 'Pa' },
    { id: 'ductPressureSetting', label: '压力设定值', unit: 'Pa' },
    { id: 'operatingCurrent', label: '运行电流', unit: 'A' },
    { id: 'inputVoltage', label: '输入电压', unit: 'V' },
    { id: 'outputVoltage', label: '输出电压', unit: 'V' },
  ],

  // 气路主机参数（暂时使用排风机参数）
  GasPathHost: [
    { id: 'operatingFrequency', label: '运行频率', unit: 'Hz' },
    { id: 'ductPressure', label: '管道压力', unit: 'Pa' },
  ],
};

/**
 * 设备类型到API路径的映射
 */
export const DEVICE_TYPE_TO_API_PATH: Record<DeviceType, string> = {
  Environment: 'environment',
  FumeHood: 'fume-hood',
  WaterImmersion: 'water-immersion',
  WaterMeter: 'water-meter',
  ElectricMeter: 'electric-meter',
  FrequencyConverter: 'exhaust-fan',
  GasPathHost: 'exhaust-fan', // 暂时使用排风机接口
};
