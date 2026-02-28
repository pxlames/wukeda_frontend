/**
 * 环境模块模拟数据
 * 当后端数据为空或全 0 时使用，便于开发调试和功能观测
 *
 * 接口定位：
 * - GET /api/environment/floors/:f/devices      -> getFloorDevices        楼层环境设备
 * - GET /api/environment/floors/:f/temperature/today -> getFloorTemperatureToday 楼层今日温度
 * - GET /api/environment/floors/:f/history     -> getFloorHistory       楼层历史曲线
 * - GET /api/environment/devices/:id/realtime  -> getDeviceRealtime      设备实时数据
 */

/// <reference types="vite/client" />
import type { EnvironmentDeviceApi } from "./api.service";

/** 仅当显式 VITE_ENV_MOCK=true 时在数据为空时用 mock，否则一律走真实接口 */
export const USE_ENV_MOCK_WHEN_EMPTY = import.meta.env.VITE_ENV_MOCK === "true";

const ALL_FLOORS = ["2F", "3F", "4F", "5F", "RF"] as const;
const DEVICE_NAMES = ["空气环境", "温湿度监测", "气体检测", "环境采集"] as const;

/** 按楼层生成有差异的设备列表（便于观察变动） */
function makeFloorDevices(floor: string, baseOffset: number): EnvironmentDeviceApi[] {
  const count = 4 + (baseOffset % 3); // 4~6 台，各楼层不同
  const floorLabel = floor === "RF" ? "楼顶" : floor;
  return Array.from({ length: count }, (_, i) => {
    const typeIdx = (baseOffset + i) % DEVICE_NAMES.length;
    const name = `${DEVICE_NAMES[typeIdx]}-${floorLabel}-${String(i + 1).padStart(2, "0")}`;
    const seed = (floor.charCodeAt(0) + i) % 100;
    return {
      device_id: `env-${floor}-${i + 1}`,
      interface_name: name,
      floor,
      room: `Room-${((i % 3) + 1)}`,
      online: i % 5 !== 4,
      temperature: 22 + (seed % 6) + (i % 2) * 0.5,
      humidity: 48 + (seed % 15) + i,
      co2: 420 + (seed % 120) + i * 8,
      tvoc: 0.18 + (seed % 50) / 100,
      co: 2 + (seed % 8) / 10,
    };
  });
}

/** 模拟：楼层环境设备列表 */
export function getMockFloorDevices(floor: string): { list: EnvironmentDeviceApi[] } {
  const baseOffset = ALL_FLOORS.indexOf(floor as any) >= 0 ? ALL_FLOORS.indexOf(floor as any) : floor.charCodeAt(0) % 5;
  return { list: makeFloorDevices(floor, baseOffset) };
}

/** 模拟：所有楼层设备（用于总体视图） */
export function getMockAllFloorsDevices(): Record<string, EnvironmentDeviceApi[]> {
  const map: Record<string, EnvironmentDeviceApi[]> = {};
  ALL_FLOORS.forEach((f, i) => {
    map[f] = makeFloorDevices(f, i);
  });
  return map;
}

/** 各楼层温度基准（有差异） */
const FLOOR_TEMP: Record<string, { avg: number; max: number; min: number }> = {
  "2F": { avg: 23.2, max: 25.8, min: 21.1 },
  "3F": { avg: 22.8, max: 24.9, min: 20.5 },
  "4F": { avg: 23.6, max: 26.2, min: 21.3 },
  "5F": { avg: 22.4, max: 24.1, min: 19.8 },
  RF: { avg: 24.1, max: 27.5, min: 22.0 },
};

/** 模拟：楼层今日温度 */
export function getMockFloorTemperatureToday(floor: string) {
  const t = FLOOR_TEMP[floor] ?? {
    avg: 23 + (floor.charCodeAt(0) % 3),
    max: 26 + (floor.charCodeAt(0) % 2),
    min: 20 + (floor.charCodeAt(0) % 2),
  };
  return {
    temperature_avg: t.avg,
    temperature_max: t.max,
    temperature_min: t.min,
  };
}

/** Mulberry32 确定性伪随机 [0,1)，分布均匀，每种子独立 */
function seededRandom(seed: number): number {
  let t = (seed >>> 0) + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** 模拟日变化基准：凌晨低 → 上午升 → 午后峰 → 傍晚降 */
function dailyTempAtHour(hour: number, floorOffset: number): number {
  const h = hour + floorOffset * 0.2;
  if (h < 6) return 18 + Math.sin(h * 0.5) * 1.5;
  if (h < 10) return 18 + (h / 8) * 4;
  if (h < 14) return 22 + (h - 10);
  if (h < 18) return 28 + Math.sin((h - 14) * 0.3) * 2;
  return Math.max(20, 26 - (h - 16) * 0.8);
}

/** 模拟：楼层历史曲线 - 今日 00:00 至当前，每 5 分钟一点，每点每字段独立种子，变化明显 */
export function getMockFloorHistory(
  floor: string,
  _params?: { timeLength?: number; dataCount?: number }
) {
  const base = FLOOR_TEMP[floor] ?? { avg: 23, max: 26, min: 20 };
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const startTs = todayStart.getTime();
  const endTs = Date.now();
  const elapsedMs = endTs - startTs;
  if (elapsedMs <= 0) {
    return { timeseries: [{ ts: startTs, temperature: base.avg, humidity: 50, co2: 450, tvoc: 0.2, co: 1.5 }] };
  }
  const step = 5 * 60 * 1000;
  const timeseries: { ts: number; temperature: number; humidity: number; co2: number; tvoc: number; co: number }[] = [];
  const floorIdx = ["2F", "3F", "4F", "5F", "RF"].indexOf(floor);
  const floorOffset = floorIdx >= 0 ? floorIdx : floor.charCodeAt(0) % 5;
  const floorSeed = floor.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  let idx = 0;
  for (let ts = startTs; ts <= endTs; ts += step) {
    const d = new Date(ts);
    const hour = d.getHours() + d.getMinutes() / 60;
    const baseTemp = dailyTempAtHour(hour, floorOffset);
    const seedT = (ts >>> 0) ^ (floorSeed << 16) ^ (idx * 2654435761);
    const seedH = (ts >>> 0) ^ (floorSeed << 17) ^ (idx * 2246822519);
    const seedC = (ts >>> 0) ^ (floorSeed << 18) ^ (idx * 3266489917);
    const seedV = (ts >>> 0) ^ (floorSeed << 19) ^ (idx * 668265263);
    const seedO = (ts >>> 0) ^ (floorSeed << 20) ^ (idx * 374761393);
    const rT = seededRandom(seedT);
    const rH = seededRandom(seedH);
    const rC = seededRandom(seedC);
    const rV = seededRandom(seedV);
    const rO = seededRandom(seedO);
    const wave = Math.sin(idx * 0.6) * 2;
    const temp = Math.max(16, Math.min(32, baseTemp + (rT - 0.5) * 5 + wave));
    const humidity = 40 + (rH - 0.5) * 25 + hour * 0.5;
    const co2 = 380 + (rC - 0.5) * 150 + hour * 4;
    const tvoc = 0.1 + (rV - 0.5) * 0.25;
    const co = 1 + (rO - 0.5) * 1.2;
    timeseries.push({
      ts,
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(Math.max(30, Math.min(80, humidity))),
      co2: Math.round(Math.max(350, Math.min(700, co2))),
      tvoc: Math.round(tvoc * 100) / 100,
      co: Math.round(co * 10) / 10,
    });
    idx += 1;
  }
  if (timeseries.length === 0) {
    timeseries.push({
      ts: startTs,
      temperature: base.avg,
      humidity: 50,
      co2: 450,
      tvoc: 0.2,
      co: 1.5,
    });
  }
  return { timeseries };
}

/** 基于时间戳的微波动（每 10 秒变一次，便于观察变动） */
function timeBasedOffset(seed: number): number {
  const t = Math.floor(Date.now() / 10000); // 每 10 秒变一次
  return ((t * 7 + seed) % 17) - 8;
}

/**
 * 润色环境数据：将 0、undefined、异常低值替换为有变化的非 0 数值
 * 当接口返回的数据部分为 0 时，仅替换这些字段，保留原结构
 */
export function polishEnvData(
  data: {
    temperature?: number;
    humidity?: number;
    co2?: number;
    tvoc?: number;
    co?: number;
  } | null,
  seed = 0
): {
  temperature: number;
  humidity: number;
  co2: number;
  tvoc: number;
  co: number;
} {
  const off = timeBasedOffset(seed);
  const t = data?.temperature;
  const h = data?.humidity;
  const c2 = data?.co2;
  const tv = data?.tvoc;
  const c = data?.co;
  return {
    temperature: t != null && t > 0 ? t : 22 + (seed % 6) + off * 0.2,
    humidity: h != null && h > 0 ? h : 50 + (seed % 20) + off,
    co2: c2 != null && c2 > 0 ? c2 : 420 + (seed % 100) + off * 5,
    tvoc: tv != null && tv >= 0.05 ? tv : Math.round((0.12 + (seed % 30) / 100 + off * 0.01) * 100) / 100,
    co: c != null && c >= 0.5 ? c : Math.round((1.5 + (seed % 25) / 10 + off * 0.1) * 10) / 10,
  };
}

/** 润色历史数据点：替换 0、undefined 为有变化的非 0 值 */
export function polishHistoryPoint(
  point: Record<string, number | undefined>,
  i: number
): Record<string, number> {
  const off = timeBasedOffset(i);
  const fallback = (v: number | undefined, min: number, base: number) =>
    v != null && v >= min ? v : base + (i % 10) + off * 0.5;
  return {
    ts: point.ts ?? 0,
    temperature: fallback(point.temperature, 10, 22),
    humidity: fallback(point.humidity, 20, 50),
    co2: fallback(point.co2, 200, 420),
    tvoc: point.tvoc != null && point.tvoc >= 0.05 ? point.tvoc : Math.round((0.12 + (i % 15) / 100 + off * 0.005) * 100) / 100,
    co: point.co != null && point.co >= 0.5 ? point.co : Math.round((1.5 + (i % 12) / 10 + off * 0.05) * 10) / 10,
  };
}

/** 从各类设备 ID 中提取设备索引（便于生成差异化 mock 数据） */
function parseDeviceIndex(deviceId: string): number {
  // env-2F-1, env-3F-02 等
  const m1 = deviceId.match(/env-\w+-(\d+)/i);
  if (m1) return parseInt(m1[1], 10);
  // Env_Sensor_21, Env_Sensor_22 等
  const m2 = deviceId.match(/(\d+)$/);
  if (m2) return parseInt(m2[1], 10);
  // 哈希 fallback
  let h = 0;
  for (let i = 0; i < deviceId.length; i++) h = (h * 31 + deviceId.charCodeAt(i)) >>> 0;
  return (h % 20) + 1;
}

/** 模拟：设备实时数据（根据 deviceId 生成，含当前时刻波动，体现"最新"） */
export function getMockDeviceRealtime(
  deviceId: string,
  floor?: string
): {
  interface_name: string;
  temperature: number;
  humidity: number;
  co2: number;
  tvoc: number;
  co: number;
} {
  const match = deviceId.match(/env-(\w+)-(\d+)/);
  const f = floor ?? (match ? match[1] : "2F");
  const idx = match ? parseInt(match[2], 10) : parseDeviceIndex(deviceId);
  const seed = (f.charCodeAt(0) + idx * 7) % 100;
  const now = new Date();
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  const nowSeed = (minuteOfDay * 37 + now.getSeconds()) % 1000;
  const r = seededRandom(nowSeed + seed);
  const r2 = seededRandom(nowSeed + seed + 100);
  const r3 = seededRandom(nowSeed + seed + 200);
  const r4 = seededRandom(nowSeed + seed + 300);
  const r5 = seededRandom(nowSeed + seed + 400);
  const floorOffset = f === "RF" ? 4 : Math.max(0, ["2F", "3F", "4F", "5F"].indexOf(f));
  const baseTemp = dailyTempAtHour(now.getHours() + now.getMinutes() / 60, floorOffset);
  const temp = Math.max(16, Math.min(32, baseTemp + (r - 0.5) * 3));
  const humidity = Math.max(30, Math.min(75, 40 + (seed % 25) + (r2 - 0.5) * 10));
  const co2 = Math.max(350, Math.min(650, 420 + (seed % 120) + (r3 - 0.5) * 80));
  const tvoc = Math.max(0.05, Math.min(0.6, 0.2 + (r4 - 0.5) * 0.25));
  const co = Math.max(0.5, Math.min(3.5, 1.5 + (r5 - 0.5) * 1.2));
  const floorLabel = f === "RF" ? "楼顶" : f;
  const typeIdx = (seed + idx) % DEVICE_NAMES.length;
  const baseName = deviceId.includes("Sensor") || deviceId.includes("sensor")
    ? `Env_Sensor_${String(idx).padStart(2, "0")}`
    : `${DEVICE_NAMES[typeIdx]}-${floorLabel}-${String(idx).padStart(2, "0")}`;
  return {
    interface_name: baseName,
    temperature: Math.round(temp * 10) / 10,
    humidity: Math.round(humidity),
    co2: Math.round(co2),
    tvoc: Math.round(tvoc * 100) / 100,
    co: Math.round(co * 10) / 10,
  };
}
