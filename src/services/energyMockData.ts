/**
 * 能耗模块模拟数据
 * 当后端数据为空或全 0 时使用，便于开发调试和功能观测
 *
 * 接口定位：
 * - GET /api/energy/summary       -> getEnergySummary  整栋楼能耗总览
 * - GET /api/energy/trend         -> getEnergyTrend    能耗趋势曲线
 * - GET /api/energy/floors/:f/summary -> getFloorSummary 楼层能耗总览
 * - GET /api/energy/floors/:f/rooms   -> getFloorRooms   楼层房间能耗详情
 */

/// <reference types="vite/client" />
import type { EnergySummaryData, EnergyTrendData } from "./api.service";

/** 是否使用模拟数据（开发环境且未配置禁用时，数据为空则用 mock） */
export const USE_ENERGY_MOCK_WHEN_EMPTY =
  import.meta.env.DEV && import.meta.env.VITE_ENERGY_MOCK !== "false";

/** 生成有变化的非 0 趋势采样（每点递增/波动，便于观察曲线） */
function makeTrendSamples(startTs: number, count: number) {
  const samples = [];
  const step = 2 * 60 * 60 * 1000; // 2h
  let waterBase = 28;
  let elecBase = 45;
  for (let i = 0; i < count; i++) {
    const ts = startTs + i * step;
    waterBase += 3 + Math.round(Math.random() * 8);
    elecBase += 5 + Math.round(Math.random() * 12);
    samples.push({
      ts,
      water_consumption: Math.max(12, waterBase + Math.round((Math.random() - 0.5) * 10)),
      electricity_consumption: Math.max(18, elecBase + Math.round((Math.random() - 0.5) * 15)),
    });
  }
  return samples;
}

/** 模拟：整栋楼能耗总览（全部非 0，有变化） */
export function getMockEnergySummary(_startTs: number): EnergySummaryData {
  return {
    total: {
      water_consumption: 4286,
      electricity_consumption: 2158,
    },
    floors: [
      { floor: "RF", water_consumption: 68, electricity_consumption: 132 },
      { floor: "5F", water_consumption: 124, electricity_consumption: 298 },
      { floor: "4F", water_consumption: 96, electricity_consumption: 187 },
      { floor: "3F", water_consumption: 82, electricity_consumption: 156 },
      { floor: "2F", water_consumption: 58, electricity_consumption: 142 },
      { floor: "1F", water_consumption: 74, electricity_consumption: 221 },
    ],
  };
}

/** 模拟：能耗趋势（整栋楼或楼层） */
export function getMockEnergyTrend(
  scope: "building" | "floor",
  startTs: number,
  _endTs: number,
  floor?: string
): EnergyTrendData {
  const samples = makeTrendSamples(startTs, 6);
  return {
    scope,
    floor: scope === "floor" ? floor : undefined,
    interval: "2h",
    samples,
  };
}

/** 各楼层基准值（未知楼层时用哈希生成非 0 值） */
const FLOOR_BASE: Record<string, { water: number; electricity: number }> = {
  RF: { water: 68, electricity: 132 },
  "5F": { water: 124, electricity: 298 },
  "4F": { water: 96, electricity: 187 },
  "3F": { water: 82, electricity: 156 },
  "2F": { water: 58, electricity: 142 },
  "1F": { water: 74, electricity: 221 },
};

/** 模拟：楼层能耗总览（无 0 值兜底） */
export function getMockFloorSummary(floor: string) {
  const d = FLOOR_BASE[floor] ?? {
    water: 40 + (floor.charCodeAt(0) % 60),
    electricity: 80 + (floor.charCodeAt(0) % 120),
  };
  return {
    floor,
    waterConsumption: d.water,
    electricityConsumption: d.electricity,
  };
}

/** 模拟：楼层房间能耗详情（全部非 0） */
export function getMockFloorRooms(floor: string) {
  const rooms = ["房间A", "房间B", "房间C", "房间D", "房间E"];
  const base = FLOOR_BASE[floor] ?? { water: 50, electricity: 100 };
  return {
    floor,
    list: rooms.map((room, i) => ({
      room,
      water_consumption: Math.max(8, Math.round(base.water / 5) + i * 6 + (i + 1) * 3),
      electricity_consumption: Math.max(12, Math.round(base.electricity / 5) + i * 8 + (i + 1) * 5),
    })),
  };
}
