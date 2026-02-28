/**
 * 排风模块模拟数据
 * 当后端数据为空时使用，便于开发调试和功能观测
 */

/// <reference types="vite/client" />
import type { ExhaustDeviceApi } from "./api.service";

/** 与「全部开启 mock」一致：VITE_ENV_MOCK 或 VITE_EXHAUST_MOCK 为 true 时，数据为空则用 mock */
export const USE_EXHAUST_MOCK_WHEN_EMPTY =
  import.meta.env.VITE_EXHAUST_MOCK === "true" || import.meta.env.VITE_ENV_MOCK === "true";

const ALL_FLOORS = ["2F", "3F", "4F", "5F", "RF"] as const;

function makeFloorDevices(floor: string, baseOffset: number): ExhaustDeviceApi[] {
  const count = 2 + (baseOffset % 3);
  const floorLabel = floor === "RF" ? "楼顶" : floor;
  return Array.from({ length: count }, (_, i) => {
    const seed = (floor.charCodeAt(0) + i + baseOffset) % 100;
    return {
      device_id: `exhaust-${floor}-${i + 1}`,
      interface_name: `FrequencyConverter_${floorLabel}_${i + 1}`,
      device_type: "FrequencyConverter",
      floor,
      room: `${floor}-${String(i + 1).padStart(2, "0")}`,
      online: i % 4 !== 3,
      status: { operating: i % 4 !== 3 ? "正常运行" : "停止" },
      parameters: {
        duct_pressure_setting: 80 + (seed % 40),
        exhaust_frequency: 35 + (seed % 25),
        exhaust_speed: 1200 + (seed % 800),
        duct_pressure: 75 + (seed % 30),
      },
      last_update: Date.now() - (i % 3) * 60_000,
    };
  });
}

/** 模拟：指定楼层排风设备列表 */
export function getMockFloorDevices(floor: string): { list: ExhaustDeviceApi[] } {
  const baseOffset = ALL_FLOORS.includes(floor as any) ? ALL_FLOORS.indexOf(floor as any) : floor.charCodeAt(0) % 5;
  return { list: makeFloorDevices(floor, baseOffset) };
}

/** 模拟：所有楼层排风设备（用于总体视图） */
export function getMockAllFloorsDevices(): ExhaustDeviceApi[] {
  return ALL_FLOORS.flatMap((f, i) => makeFloorDevices(f, i));
}
