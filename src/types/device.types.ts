/**
 * 设备相关类型定义
 */

// 设备类型枚举
export enum DeviceType {
  FumeHood = 'FumeHood',
  Environment = 'Environment',
  WaterMeter = 'WaterMeter',
  ElectricMeter = 'ElectricMeter',
  WaterImmersion = 'WaterImmersion',
  FrequencyConverter = 'FrequencyConverter',
  GasPathHost = 'GasPathHost', // 气体路径主机
}

// 楼层枚举
export enum Floor {
  RF = 'RF',
  F5 = '5F',
  F4 = '4F',
  F3 = '3F',
  F2 = '2F',
  F1 = '1F',
}

// 通风柜状态
export interface FumeHoodStatus {
  device_on_off?: string; // "停机" | "运行"
  air_shortage?: string; // "正常" | "异常"
  area_sensor_enabled?: string; // "使能" | "禁用"
  window_motor?: string; // "正常" | "异常"
  running?: string; // "运行" | "停止"
}

// 通风柜参数
export interface FumeHoodParameters {
  window_height_limit?: string; // "正常" | "超限"
  valve_opening?: number; // 0-100
  face_wind_speed?: number; // m/s
  window_height?: number; // mm
  exhaust_air_speed?: number; // m/s
  exhaust_air_volume?: number; // m³/h
}

// 环境设备状态
export interface EnvironmentStatus {
  running: string; // "运行" | "停止"
}

// 环境设备参数
export interface EnvironmentParameters {
  temperature?: number; // ℃
  humidity?: number; // %RH
  co2?: number; // ppm
  co?: number; // ppm
  tvoc?: number; // mg/m³或ppb
}

// 电表状态
export interface ElectricMeterStatus {
  running: string; // "运行" | "停止"
}

// 电表参数
export interface ElectricMeterParameters {
  phase_a_voltage?: number; // V
  phase_b_voltage?: number; // V
  phase_c_voltage?: number; // V
  current?: number; // A
  power?: number; // kW
  frequency?: number; // Hz
  power_factor?: number; // 0-1
  bidirectional_energy?: number; // kWh
  four_quadrant_energy?: number; // kWh
  multi_rate_energy?: number; // kWh
  accumulated_energy?: number; // kWh
}

// 水表状态
export interface WaterMeterStatus {
  running: string; // "运行" | "停止"
}

// 水表参数
export interface WaterMeterParameters {
  water_consumption?: number; // m³
  instantaneous_flow?: number; // m³/h
  valve_status?: number; // 0=关闭, 1=开启
}

// 浸水检测器状态
export interface WaterImmersionStatus {
  running: string; // "运行" | "停止"
  immersion: string; // "正常" | "浸水"
  alarm: string; // "正常" | "报警"
}

// 浸水检测器参数
export interface WaterImmersionParameters {
  immersion_status?: number; // 0=正常, 1=浸水
  alarm_status?: number; // 0=正常, 1=报警
}

// 排风机状态
export interface FrequencyConverterStatus {
  operating: string; // "正常运行" | "停止" | "故障"
  running?: string; // "运行" | "停止"
}

// 排风机参数
export interface FrequencyConverterParameters {
  duct_pressure_setting?: number; // Pa
  exhaust_frequency?: number; // Hz
  exhaust_speed?: number; // r/min
  duct_pressure?: number; // Pa
  operating_current?: number; // A
  input_voltage?: number; // V
  output_voltage?: number; // V
}

// 设备基础信息
export interface BaseDevice {
  deviceId: string;  // 注意：后端返回的是驼峰命名
  interfaceName: string;
  deviceType: DeviceType;
  floor: string;
  room: string;
  online: boolean;
  lastUpdate: number;
}

// 通风柜设备
export interface FumeHoodDevice extends BaseDevice {
  device_type: DeviceType.FumeHood;
  status: FumeHoodStatus;
  parameters: FumeHoodParameters;
}

// 环境设备
export interface EnvironmentDevice extends BaseDevice {
  device_type: DeviceType.Environment;
  status: EnvironmentStatus;
  parameters: EnvironmentParameters;
}

// 电表设备
export interface ElectricMeterDevice extends BaseDevice {
  device_type: DeviceType.ElectricMeter;
  status: ElectricMeterStatus;
  parameters: ElectricMeterParameters;
}

// 水表设备
export interface WaterMeterDevice extends BaseDevice {
  device_type: DeviceType.WaterMeter;
  status: WaterMeterStatus;
  parameters: WaterMeterParameters;
}

// 浸水检测器设备
export interface WaterImmersionDevice extends BaseDevice {
  device_type: DeviceType.WaterImmersion;
  status: WaterImmersionStatus;
  parameters: WaterImmersionParameters;
}

// 排风机设备
export interface FrequencyConverterDevice extends BaseDevice {
  device_type: DeviceType.FrequencyConverter;
  status: FrequencyConverterStatus;
  parameters: FrequencyConverterParameters;
}

// 气体路径主机状态
export interface GasPathHostStatus {
  running?: string;
  device_on_off?: string;
  operating?: string;
}

// 气体路径主机参数
export interface GasPathHostParameters {
  [key: string]: any; // 暂时使用通用类型
}

// 气体路径主机设备
export interface GasPathHostDevice extends BaseDevice {
  device_type: DeviceType.GasPathHost;
  status: GasPathHostStatus;
  parameters: GasPathHostParameters;
}

// 所有设备类型的联合类型
export type Device =
  | FumeHoodDevice
  | EnvironmentDevice
  | ElectricMeterDevice
  | WaterMeterDevice
  | WaterImmersionDevice
  | FrequencyConverterDevice
  | GasPathHostDevice;

// 设备列表响应
export interface DeviceListResponse {
  total: number;
  data: Device[];  // 注意：后端返回的是 data 而不是 list
}
