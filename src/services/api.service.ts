/**
 * API 服务层
 * 封装所有后端接口调用
 */

import { request } from '../utils/request';
import { API_ENDPOINTS } from '../config/api.config';
import { Device, DeviceListResponse } from '../types/device.types';

// 类型定义
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 认证服务
 */
export const authService = {
  /**
   * 登录
   */
  async login(username: string, password: string): Promise<string> {
    const response = await request.post<{ token: string }>(API_ENDPOINTS.LOGIN, {
      username,
      password,
    });
    
    if (response.code === 200 && response.data.token) {
      request.setAuthToken(response.data.token);
      return response.data.token;
    }
    
    throw new Error(response.message || '登录失败');
  },

  /**
   * 登出
   */
  logout(): void {
    request.clearAuthToken();
  },
};

/**
 * 设备监控服务
 */
export const deviceService = {
  /**
   * 获取设备列表
   */
  async getDevices(params?: {
    floor?: string;
    type?: string;
    room?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<Device>> {
    const response = await request.get<PageResult<Device>>(API_ENDPOINTS.DEVICES, {
      params,
    });
    return response.data;
  },

  /**
   * 获取所有设备（不分页）
   */
  async getAllDevices(floor?: string): Promise<Device[]> {
    const response = await request.get<DeviceListResponse>(API_ENDPOINTS.DEVICES, {
      params: floor ? { floor } : undefined,
    });
    
    // 调试：打印后端返回的原始数据
    if (process.env.NODE_ENV === 'development' && response.data.data && response.data.data.length > 0) {
      console.log('[后端返回的设备数据示例]', response.data.data[0]);
    }
    
    // 后端返回的是 data.data，不是 data.list
    return response.data.data || [];
  },

  /**
   * 获取设备历史数据
   */
  async getDeviceHistory(
    deviceId: string,
    params?: {
      deviceType?: string;
      timeLength?: string;
      dataCount?: number;
    }
  ): Promise<any> {
    const response = await request.get(API_ENDPOINTS.DEVICE_HISTORY(deviceId), {
      params,
    });
    return response.data;
  },

  /**
   * 获取设备告警
   */
  async getDeviceAlarms(
    deviceId: string,
    params?: {
      startTs?: number;
      endTs?: number;
    }
  ): Promise<any> {
    const response = await request.get(API_ENDPOINTS.DEVICE_ALARMS(deviceId), {
      params,
    });
    return response.data;
  },
};

/**
 * 历史数据服务
 */
export const historyService = {
  /**
   * 获取设备历史数据
   */
  async getHistoryData(
    deviceType: string,
    deviceId: string,
    params?: {
      timeLength?: number; // 时间长度（毫秒），默认300000（5分钟）
      dataCount?: number; // 数据点数，默认100
    }
  ): Promise<any> {
    const response = await request.get(
      API_ENDPOINTS.HISTORY_DATA(deviceType, deviceId),
      { params }
    );
    return response.data;
  },
};

/** 环境设备 API（环境页用） */
export interface EnvironmentDeviceApi {
  device_id: string;
  interface_name: string;
  floor: string;
  room: string;
  online: boolean;
  temperature?: number;
  humidity?: number;
  co2?: number;
  tvoc?: number;
  co?: number;
}

/**
 * 环境服务
 */
export const environmentService = {
  /**
   * 获取环境设备列表
   */
  async getDevices(params?: {
    floor?: string;
    room?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<Device>> {
    const response = await request.get<PageResult<Device>>(
      API_ENDPOINTS.ENVIRONMENT_DEVICES,
      { params }
    );
    return response.data;
  },

  /**
   * 获取指定楼层的环境设备列表（环境页）
   */
  async getFloorDevices(floor: string): Promise<{ list: EnvironmentDeviceApi[] }> {
    try {
      const response = await request.get<any>(API_ENDPOINTS.ENVIRONMENT_FLOOR_DEVICES(floor));
      // 兼容两种返回结构：
      // 1) data: { total, data: [...] }
      // 2) data: { total, list: [...] }
      const pageResult = response.data ?? {};
      const raw = Array.isArray(pageResult?.data)
        ? pageResult.data
        : Array.isArray(pageResult?.list)
          ? pageResult.list
          : [];
      const list: EnvironmentDeviceApi[] = raw.map((d: any) => ({
        device_id: d.deviceId ?? d.device_id ?? '',
        interface_name: d.interfaceName ?? d.interface_name ?? '',
        floor: d.floor ?? floor,
        room: d.room ?? '',
        online: d.online ?? true,
        temperature: d.temperature,
        humidity: d.humidity,
        co2: d.co2,
        tvoc: d.tvoc,
        co: d.co,
      }));
      return { list };
    } catch (e: any) {
      if (e?.message?.includes('404') || e?.message?.includes('No devices found')) {
        return { list: [] };
      }
      throw e;
    }
  },

  /**
   * 获取楼层今日温度统计
   */
  async getFloorTemperatureToday(floor: string): Promise<{
    temperature_avg?: number;
    temperature_max?: number;
    temperature_min?: number;
  }> {
    const response = await request.get<any>(
      API_ENDPOINTS.ENVIRONMENT_FLOOR_TEMPERATURE_TODAY(floor)
    );
    const d = response.data?.data ?? response.data ?? {};
    return {
      temperature_avg: d.temperature_avg ?? d.temperatureAvg,
      temperature_max: d.temperature_max ?? d.temperatureMax,
      temperature_min: d.temperature_min ?? d.temperatureMin,
    };
  },

  /**
   * 获取楼层历史数据
   */
  async getFloorHistory(
    floor: string,
    params?: { timeLength?: number; dataCount?: number }
  ): Promise<{ timeseries?: any[] }> {
    const response = await request.get<any>(
      API_ENDPOINTS.ENVIRONMENT_FLOOR_HISTORY(floor),
      { params }
    );
    const d = response.data?.data ?? response.data ?? {};
    return { timeseries: d.timeseries ?? d.data ?? [] };
  },

  /**
   * 获取设备实时数据
   */
  async getDeviceRealtime(deviceId: string): Promise<{
    interface_name?: string;
    temperature?: number;
    humidity?: number;
    co2?: number;
    tvoc?: number;
    co?: number;
  }> {
    const response = await request.get<any>(
      API_ENDPOINTS.ENVIRONMENT_DEVICE_REALTIME(deviceId)
    );
    return response.data?.data ?? response.data ?? {};
  },

  /**
   * 获取楼层环境汇总
   */
  async getFloorSummary(floor: string): Promise<any> {
    const response = await request.get(API_ENDPOINTS.ENVIRONMENT_FLOOR_SUMMARY(floor));
    return response.data;
  },

  /**
   * 获取设备快照
   */
  async getDeviceSnapshot(deviceId: string): Promise<any> {
    const response = await request.get(
      API_ENDPOINTS.ENVIRONMENT_DEVICE_SNAPSHOT(deviceId)
    );
    return response.data;
  },
};

/** 能耗趋势单点（Nenghao 用） */
export interface EnergyTrendSample {
  ts?: number;
  waterConsumption?: number;
  electricityConsumption?: number;
  [key: string]: number | undefined;
}

/** 统一拿到业务层 data，兼容 {code,message,data} 或直接业务对象 */
const unwrapApiData = <T = any>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload.data ?? {}) as T;
  }
  return (payload ?? {}) as T;
};

/**
 * 能耗汇总（整栋楼）
 */
export async function getEnergySummary(params?: {
  startTs?: number;
  endTs?: number;
}): Promise<any> {
  const response = await request.get<any>(API_ENDPOINTS.ENERGY_SUMMARY, { params });
  const raw = unwrapApiData(response);
  return (typeof raw === 'object' && raw !== null ? raw : {}) as any;
}

/**
 * 能耗趋势（整栋楼或指定楼层）
 */
export async function getEnergyTrend(
  scope: 'building' | 'floor',
  params: {
    floor?: string;
    startTs: number;
    endTs: number;
    interval: string;
  }
): Promise<{ samples?: EnergyTrendSample[]; data?: EnergyTrendSample[]; [k: string]: any }> {
  const response = await request.get<any>(API_ENDPOINTS.ENERGY_TREND, {
    params: { scope, ...params },
  });
  const raw = unwrapApiData(response);
  return (typeof raw === 'object' && raw !== null ? raw : {}) as any;
}

/**
 * 能耗服务
 */
export const energyService = {
  getSummary: getEnergySummary,
  getTrend: getEnergyTrend,

  /**
   * 获取能耗汇总
   */
  async getFloorSummary(
    floor: string,
    params?: { startTs?: number; endTs?: number }
  ): Promise<any> {
    try {
      const response = await request.get<any>(
        API_ENDPOINTS.ENERGY_FLOOR_SUMMARY(floor),
        { params }
      );
      return unwrapApiData(response);
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('404') || msg.includes('No devices found for floor')) {
        return { floor, waterConsumption: 0, electricityConsumption: 0 };
      }
      throw e;
    }
  },

  /**
   * 获取楼层房间能耗
   */
  async getFloorRooms(
    floor: string,
    params?: { startTs?: number; endTs?: number }
  ): Promise<any> {
    try {
      const response = await request.get<any>(
        API_ENDPOINTS.ENERGY_FLOOR_ROOMS(floor),
        { params }
      );
      // 兼容两种返回结构：
      // 1) data: { total, data: [...] }
      // 2) data: { total, list: [...] }
      const pageResult = unwrapApiData<any>(response);
      const list = Array.isArray(pageResult?.data)
        ? pageResult.data
        : Array.isArray(pageResult?.list)
          ? pageResult.list
          : [];
      return { ...pageResult, floor: pageResult?.floor ?? floor, list };
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('404') || msg.includes('No devices found for floor')) {
        return { floor, list: [] };
      }
      throw e;
    }
  },

  /**
   * 获取各楼层能耗
   */
  async getFloors(params?: { startTs?: number; endTs?: number }): Promise<any> {
    try {
      const response = await request.get(API_ENDPOINTS.ENERGY_FLOORS, { params });
      return unwrapApiData(response);
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      if (msg.includes('404') || msg.includes('No data')) {
        return { floors: [] };
      }
      throw e;
    }
  },

  /**
   * 获取楼层能耗趋势
   */
  async getFloorTrend(
    floor: string,
    params?: {
      startTs?: number;
      endTs?: number;
      interval?: string;
      fill?: boolean;
    }
  ): Promise<any> {
    const response = await request.get(API_ENDPOINTS.ENERGY_FLOOR_TREND(floor), {
      params,
    });
    return unwrapApiData(response);
  },
};

/**
 * 报警服务
 */
export const alarmService = {
  /**
   * 获取告警列表
   */
  async getAlarms(params?: {
    module?: string;
    severity?: string;
    status?: string;
    deviceId?: string;
    startTs?: number;
    endTs?: number;
  }): Promise<any> {
    const response = await request.get(API_ENDPOINTS.ALARMS, { params });
    return response.data;
  },

  /**
   * 获取告警统计
   */
  async getStats(params?: { startTs?: number; endTs?: number }): Promise<any> {
    const response = await request.get(API_ENDPOINTS.ALARMS_STATS, { params });
    return response.data;
  },
};

/** 排风机设备 API */
export interface ExhaustDeviceApi {
  device_id: string;
  interface_name: string;
  device_type: string;
  floor: string;
  room: string;
  online: boolean;
  status?: { operating?: string };
  parameters?: {
    duct_pressure_setting?: number;
    exhaust_frequency?: number;
    exhaust_speed?: number;
    duct_pressure?: number;
    operating_current?: number;
    input_voltage?: number;
    output_voltage?: number;
  };
  last_update?: number;
}

/** 排风服务 */
export const exhaustService = {
  async getFloorDevices(floor: string): Promise<{ list: ExhaustDeviceApi[] }> {
    try {
      const response = await request.get<any>(API_ENDPOINTS.EXHAUST_FLOOR_DEVICES(floor));
      // 兼容两种返回结构：
      // 1) data: { total, data: [...] }
      // 2) data: { total, list: [...] }
      const pageResult = response.data ?? {};
      const raw = Array.isArray(pageResult?.data)
        ? pageResult.data
        : Array.isArray(pageResult?.list)
          ? pageResult.list
          : [];
      const list: ExhaustDeviceApi[] = raw.map((d: any) => {
        const params = d.parameters ?? {};
        return {
          device_id: d.deviceId ?? d.device_id ?? '',
          interface_name: d.interfaceName ?? d.interface_name ?? '',
          device_type: d.deviceType ?? d.device_type ?? 'FrequencyConverter',
          floor: d.floor ?? floor,
          room: d.room ?? '',
          online: d.online ?? true,
          status: d.status ?? {},
          parameters: {
            duct_pressure_setting: params.ductPressureSetting ?? params.duct_pressure_setting,
            exhaust_frequency: params.exhaustFrequency ?? params.exhaust_frequency,
            exhaust_speed: params.exhaustSpeed ?? params.exhaust_speed,
            duct_pressure: params.ductPressure ?? params.duct_pressure,
          },
          last_update: d.lastUpdate ?? d.last_update,
        };
      });
      return { list };
    } catch (e: any) {
      if (e?.message?.includes('404') || e?.message?.includes('No devices found')) {
        return { list: [] };
      }
      throw e;
    }
  },
};

/** 通风柜设备 API */
export interface VentilationDeviceApi {
  device_id: string;
  interface_name: string;
  device_type: string;
  floor: string;
  room: string;
  online: boolean;
  status?: { device_on_off?: string };
  parameters?: {
    valve_opening?: number;
    window_height?: number;
    exhaust_air_speed?: number;
    exhaust_air_volume?: number;
    forced_exhaust_switch?: number;
    face_wind_speed?: number;
  };
  last_update?: number;
}

/** 通风服务 */
export const ventilationService = {
  async getFloorDevices(floor: string): Promise<{ list: VentilationDeviceApi[] }> {
    try {
      const response = await request.get<any>(API_ENDPOINTS.VENTILATION_FLOOR_DEVICES(floor));
      // 兼容两种返回结构：
      // 1) data: { total, data: [...] }
      // 2) data: { total, list: [...] }
      const pageResult = response.data ?? {};
      const raw = Array.isArray(pageResult?.data)
        ? pageResult.data
        : Array.isArray(pageResult?.list)
          ? pageResult.list
          : [];
      const list: VentilationDeviceApi[] = raw.map((d: any) => {
        const params = d.parameters ?? {};
        return {
          device_id: d.deviceId ?? d.device_id ?? '',
          interface_name: d.interfaceName ?? d.interface_name ?? '',
          device_type: d.deviceType ?? d.device_type ?? 'FumeHood',
          floor: d.floor ?? floor,
          room: d.room ?? '',
          online: d.online ?? true,
          status: d.status ?? {},
          parameters: {
            valve_opening: params.valveOpening ?? params.valve_opening,
            window_height: params.windowHeight ?? params.window_height,
            exhaust_air_speed: params.exhaustAirSpeed ?? params.exhaust_air_speed,
            exhaust_air_volume: params.exhaustAirVolume ?? params.exhaust_air_volume,
            forced_exhaust_switch: params.forcedExhaustSwitch ?? params.forced_exhaust_switch,
            face_wind_speed: params.faceWindSpeed ?? params.face_wind_speed,
          },
          last_update: d.lastUpdate ?? d.last_update,
        };
      });
      return { list };
    } catch (e: any) {
      if (e?.message?.includes('404') || e?.message?.includes('No devices found')) {
        return { list: [] };
      }
      throw e;
    }
  },
};

export default {
  auth: authService,
  device: deviceService,
  environment: environmentService,
  energy: energyService,
  alarm: alarmService,
};
