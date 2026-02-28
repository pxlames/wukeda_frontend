/**
 * 历史数据模块模拟数据
 * 为所有设备类型提供合理 mock，便于开发/演示
 */

import type { HistoryDataResponse } from '../types/history.types';
import { DeviceType } from '../types/device.types';
import { DEVICE_HISTORY_PARAMETERS } from '../config/historyParams.config';

/** 是否使用模拟数据（开发环境且未配置禁用时可用 mock） */
export const USE_HISTORY_MOCK_WHEN_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_HISTORY_MOCK !== 'false';

/** 各参数合理范围：base, min, max, decimals；连续型用 amplitude 控制波动幅度（相对 (max-min) 的比例，如 0.03 表示约 ±3%） */
const PARAM_RANGES: Record<string, { base: number; min: number; max: number; decimals?: number; amplitude?: number }> = {
  // 排风机
  startIndicator: { base: 1, min: 0, max: 1, decimals: 0, amplitude: 0 },
  operatingFrequency: { base: 45, min: 43, max: 47, decimals: 1, amplitude: 0.03 },
  operatingSpeed: { base: 1200, min: 1150, max: 1250, decimals: 0, amplitude: 0.02 },
  ductPressure: { base: 450, min: 420, max: 480, decimals: 0, amplitude: 0.025 },
  ductPressureSetting: { base: 500, min: 495, max: 505, decimals: 0, amplitude: 0.02 },
  operatingCurrent: { base: 12.5, min: 11.5, max: 13.5, decimals: 2, amplitude: 0.03 },
  inputVoltage: { base: 380, min: 375, max: 385, decimals: 0, amplitude: 0.015 },
  outputVoltage: { base: 220, min: 215, max: 225, decimals: 0, amplitude: 0.02 },
  // 水浸
  immersionStatus: { base: 0, min: 0, max: 1, decimals: 0, amplitude: 0 },
  alarmStatus: { base: 0, min: 0, max: 1, decimals: 0, amplitude: 0 },
  // 环境
  temperature: { base: 22, min: 20, max: 24, decimals: 1, amplitude: 0.04 },
  humidity: { base: 55, min: 50, max: 60, decimals: 0, amplitude: 0.04 },
  co2: { base: 600, min: 550, max: 650, decimals: 0, amplitude: 0.03 },
  tvoc: { base: 0.3, min: 0.2, max: 0.4, decimals: 2, amplitude: 0.05 },
  co: { base: 8, min: 6, max: 10, decimals: 1, amplitude: 0.04 },
  // 通风柜
  operatingStatus: { base: 1, min: 0, max: 1, decimals: 0, amplitude: 0 },
  windowHeight: { base: 500, min: 450, max: 550, decimals: 0, amplitude: 0.03 },
  exhaustAirSpeed: { base: 0.5, min: 0.45, max: 0.55, decimals: 2, amplitude: 0.03 },
  exhaustAirVolume: { base: 1200, min: 1150, max: 1250, decimals: 0, amplitude: 0.025 },
  valveOpening: { base: 60, min: 55, max: 65, decimals: 0, amplitude: 0.03 },
  forcedExhaustSwitch: { base: 0, min: 0, max: 1, decimals: 0, amplitude: 0 },
  alarmInfo: { base: 0, min: 0, max: 1, decimals: 0, amplitude: 0 },
  // 智能水表
  totalWaterConsumption: { base: 125.5, min: 125.5, max: 200, decimals: 2, amplitude: 0 },
  instantaneousFlow: { base: 2.5, min: 2.0, max: 3.0, decimals: 2, amplitude: 0.04 },
  valveStatus: { base: 1, min: 0, max: 1, decimals: 0, amplitude: 0 },
  // 智能电表
  phaseAVoltage: { base: 220, min: 218, max: 222, decimals: 1, amplitude: 0.02 },
  phaseBVoltage: { base: 221, min: 219, max: 223, decimals: 1, amplitude: 0.02 },
  phaseCVoltage: { base: 219, min: 217, max: 221, decimals: 1, amplitude: 0.02 },
  current: { base: 15.5, min: 14.5, max: 16.5, decimals: 2, amplitude: 0.03 },
  power: { base: 8.2, min: 7.5, max: 8.9, decimals: 2, amplitude: 0.03 },
  frequency: { base: 50, min: 49.9, max: 50.1, decimals: 2, amplitude: 0.02 },
  powerFactor: { base: 0.92, min: 0.90, max: 0.94, decimals: 2, amplitude: 0.02 },
  bidirectionalEnergy: { base: 120, min: 120, max: 500, decimals: 1, amplitude: 0 },
  fourQuadrantEnergy: { base: 0, min: 0, max: 50, decimals: 1, amplitude: 0 },
  multiRateEnergy: { base: 80, min: 80, max: 300, decimals: 1, amplitude: 0 },
  accumulatedEnergy: { base: 1250, min: 1250, max: 5000, decimals: 1, amplitude: 0 },
};

const DEFAULT_RANGE = { base: 50, min: 45, max: 55, decimals: 0, amplitude: 0.03 };

/** 判断是否为累积型参数（只增不减） */
function isAccumulativeParam(paramId: string): boolean {
  return [
    'totalWaterConsumption',
    'bidirectionalEnergy',
    'fourQuadrantEnergy',
    'multiRateEnergy',
    'accumulatedEnergy',
  ].includes(paramId);
}

/** 确定性 + 极小扰动：在 base 附近平滑波动，无大浮动、无大偏移 */
function continuousValue(paramId: string, index: number, dataCount: number): number {
  const r = PARAM_RANGES[paramId] ?? DEFAULT_RANGE;
  const range = r.max - r.min;
  const amp = (r.amplitude ?? 0.03) * range * 0.5; // 波动幅度约为 (max-min) 的 amplitude/2
  // 平滑正弦波，周期约为 dataCount/2，使整段内曲线平滑
  const period = Math.max(2, dataCount / 2);
  const smooth = Math.sin((2 * Math.PI * index) / period);
  // 极小随机扰动：±0.5% 范围，避免曲线过于机械
  const tinyNoise = (Math.random() - 0.5) * range * 0.005;
  let val = r.base + amp * smooth + tinyNoise;
  val = Math.max(r.min, Math.min(r.max, val));
  if (r.decimals !== undefined) {
    const f = Math.pow(10, r.decimals);
    val = Math.round(val * f) / f;
  } else {
    val = Math.round(val);
  }
  return val;
}

/** 累积型：从 base 单调递增至接近 max，按时间线性增长 + 每点极小扰动（±0.5% 步长），无回退、无突变 */
function accumulativeValue(paramId: string, index: number, dataCount: number): number {
  const r = PARAM_RANGES[paramId] ?? DEFAULT_RANGE;
  const start = r.base;
  const totalRange = r.max - r.min;
  const step = totalRange / Math.max(1, dataCount);
  const linear = start + step * index;
  const tinyNoise = step * 0.005 * (Math.random() - 0.5) * 2; // ±0.5% 步长
  let val = linear + tinyNoise;
  val = Math.min(r.max, Math.max(r.min, val));
  if (r.decimals !== undefined) {
    const f = Math.pow(10, r.decimals);
    val = Math.round(val * f) / f;
  } else {
    val = Math.round(val);
  }
  return val;
}

/** 设备类型默认告警（写死，按类型区分） */
const DEFAULT_ALARMS: Record<DeviceType, { content: string; category: string }[]> = {
  [DeviceType.FrequencyConverter]: [
    { content: '管道压力波动异常', category: '压力' },
    { content: '运行频率低于设定值', category: '频率' },
  ],
  [DeviceType.WaterImmersion]: [
    { content: '检测到浸水风险', category: '浸水' },
    { content: '传感器通讯异常', category: '报警' },
  ],
  [DeviceType.Environment]: [
    { content: 'CO₂浓度偏高', category: '空气质量' },
    { content: '温度超出设定范围', category: '温度' },
  ],
  [DeviceType.WaterMeter]: [
    { content: '瞬时流量异常', category: '流量' },
    { content: '阀门状态变更', category: '阀门' },
  ],
  [DeviceType.ElectricMeter]: [
    { content: 'A相电压波动', category: '电压' },
    { content: '功率因数偏低', category: '电能' },
  ],
  [DeviceType.FumeHood]: [
    { content: '视窗高度异常', category: '视窗' },
    { content: '排风量低于设定', category: '排风' },
  ],
  [DeviceType.GasPathHost]: [
    { content: '管道压力波动异常', category: '压力' },
    { content: '运行频率异常', category: '频率' },
  ],
};

/**
 * 按设备类型生成历史数据 mock
 */
export function getMockHistoryDataForDevice(
  deviceType: DeviceType,
  deviceId: string,
  deviceName: string,
  startTs: number,
  timeLength: number,
  dataCount: number = 24
): HistoryDataResponse {
  const step = Math.max(1000, Math.floor(timeLength / dataCount));
  const timeseries: Record<string, { ts: number; value: number | string }[]> = {};
  const statistics: Record<string, { avg: number; max: number; min: number }> = {};
  const paramConfig = DEVICE_HISTORY_PARAMETERS[deviceType] || [];
  const paramIds = paramConfig.map((p) => p.id);
  if (paramIds.length === 0) {
    return {
      device_id: deviceId,
      interface_name: deviceName || `${deviceType}`,
      device_type: deviceType,
      timeseries: {},
      statistics: {},
      alarms: DEFAULT_ALARMS[deviceType] || [],
    };
  }

  paramIds.forEach((paramId) => {
    const r = PARAM_RANGES[paramId] ?? DEFAULT_RANGE;
    const points: { ts: number; value: number | string }[] = [];
    const values: number[] = [];

    const isBinary = r.min === 0 && r.max === 1 && (r.decimals === 0 || r.decimals === undefined);

    for (let i = 0; i < dataCount; i++) {
      const ts = startTs + i * step;
      let val: number;

      // 状态/二值参数：固定业务合理值，不随机翻转，避免大浮动
      if (paramId === 'startIndicator' || paramId === 'operatingStatus' || paramId === 'valveStatus') {
        val = 1; // 运行/开
      } else if (paramId === 'forcedExhaustSwitch') {
        val = 0; // 关
      } else if (paramId === 'immersionStatus' || paramId === 'alarmStatus' || paramId === 'alarmInfo') {
        val = 0; // 正常：无浸水、无告警
      } else if (isBinary) {
        val = r.base >= 0.5 ? 1 : 0;
      } else if (isAccumulativeParam(paramId)) {
        val = accumulativeValue(paramId, i, dataCount);
      } else {
        val = continuousValue(paramId, i, dataCount);
      }

      const v = isBinary ? Math.round(Number(val)) : val;
      points.push({ ts, value: v });
      if (typeof v === 'number') values.push(v);
    }

    timeseries[paramId] = points;
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      statistics[paramId] = {
        avg: Math.round((sum / values.length) * 100) / 100,
        max: Math.max(...values),
        min: Math.min(...values),
      };
    }
  });

  return {
    device_id: deviceId,
    interface_name: deviceName || `${deviceType} ${deviceId}`,
    device_type: deviceType,
    timeseries,
    statistics,
    alarms: DEFAULT_ALARMS[deviceType] || [],
  };
}

/**
 * 排风机历史数据 mock（兼容旧调用）
 */
export function getMockHistoryData(
  deviceId: string,
  deviceName: string,
  startTs: number,
  timeLength: number,
  dataCount: number = 24
): HistoryDataResponse {
  return getMockHistoryDataForDevice(
    DeviceType.FrequencyConverter,
    deviceId,
    deviceName,
    startTs,
    timeLength,
    dataCount
  );
}
