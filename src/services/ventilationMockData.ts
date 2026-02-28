/**
 * 通风模块模拟数据
 * 当后端数据为空时使用，便于开发调试和功能观测
 */

/// <reference types="vite/client" />
import type { VentilationDeviceApi } from "./api.service";

/** 与「全部开启 mock」一致：VITE_ENV_MOCK 或 VITE_VENTILATION_MOCK 为 true 时，数据为空则用 mock */
export const USE_VENTILATION_MOCK_WHEN_EMPTY =
  import.meta.env.VITE_VENTILATION_MOCK === "true" || import.meta.env.VITE_ENV_MOCK === "true";

const ALL_FLOORS = ["2F", "3F", "4F", "5F", "RF"] as const;

function makeFloorDevices(floor: string, baseOffset: number): VentilationDeviceApi[] {
  const count = 2 + (baseOffset % 3);
  const floorLabel = floor === "RF" ? "楼顶" : floor;
  return Array.from({ length: count }, (_, i) => {
    const seed = (floor.charCodeAt(0) + i + baseOffset) % 100;
    // 同一楼层内参数在小范围内变化，避免卡片间数量级差异（如排风量 85 vs 851）
    const valveBase = 78;
    const windowBase = 450; // mm -> 45.0cm
    const faceSpeedBase = 0.2;
    const exhaustSpeedBase = 0.8;
    const exhaustVolumeBase = 850; // m³/h，统一 800~950 量级
    const delta = (seed % 11) - 5; // -5..5 小幅偏移
    return {
      device_id: `vent-${floor}-${i + 1}`,
      interface_name: `FumeHood_${floorLabel}`,
      device_type: "FumeHood",
      floor,
      room: `${floor}-${String(i + 1).padStart(2, "0")}`,
      online: true,
      status: { device_on_off: "运行" },
      parameters: {
        valve_opening: Math.max(0, Math.min(100, valveBase + delta)),
        window_height: Math.max(300, Math.min(600, windowBase + delta * 10)),
        exhaust_air_speed: Math.max(0.3, Math.min(1, exhaustSpeedBase + delta * 0.01)),
        exhaust_air_volume: Math.max(800, Math.min(950, exhaustVolumeBase + delta * 10)),
        forced_exhaust_switch: 0,
        face_wind_speed: Math.max(0.15, Math.min(0.5, faceSpeedBase + delta * 0.01)),
      },
      last_update: Date.now() - (i * 20 + 10) * 1000, // 错开若干秒，便于展示不同“在线时长”
    };
  });
}

/** 模拟：指定楼层通风设备列表 */
export function getMockFloorDevices(floor: string): { list: VentilationDeviceApi[] } {
  const baseOffset = ALL_FLOORS.includes(floor as any) ? ALL_FLOORS.indexOf(floor as any) : floor.charCodeAt(0) % 5;
  return { list: makeFloorDevices(floor, baseOffset) };
}

/** 模拟：所有楼层通风设备（用于总体视图） */
export function getMockAllFloorsDevices(): VentilationDeviceApi[] {
  return ALL_FLOORS.flatMap((f, i) => makeFloorDevices(f, i));
}
