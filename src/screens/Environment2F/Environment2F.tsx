import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Device, DeviceType } from "../../types/device.types";
import { getDeviceDisplayName } from "../../utils/deviceNameMapper";
import { useDevices } from "../../hooks/useDevices";
import { appConfig } from "../../config/app.config";

const BOTTOM_NAV_ITEMS: Array<{ label: string; route: string | null }> = [
  { label: "环境", route: "/screen" },
  { label: "排风", route: "/paifeng" },
  { label: "通风", route: "/tongfeng" },
  { label: "气路", route: null },
  { label: "废水", route: null },
  { label: "能耗", route: "/nenghao" },
];

const FLOOR_NAV_ITEMS: Array<{
  label: string;
  floor?: string;
  route?: string | null;
  image: string;
  topClassName: string;
  fontClassName: string;
}> = [
  {
    label: "首页",
    route: "/screen",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1.png",
    topClassName: "top-[17px]",
    fontClassName: "[font-family:'Poppins',Helvetica] font-medium",
  },
  {
    label: "楼顶",
    floor: "RF",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1-1.png",
    topClassName: "top-[19px]",
    fontClassName: "[font-family:'Poppins',Helvetica] font-medium",
  },
  {
    label: "5F",
    floor: "5F",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1-2.png",
    topClassName: "top-[18px]",
    fontClassName: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal",
  },
  {
    label: "4F",
    floor: "4F",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1-3.png",
    topClassName: "top-[18px]",
    fontClassName: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal",
  },
  {
    label: "3F",
    floor: "3F",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1-4.png",
    topClassName: "top-[18px]",
    fontClassName: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal",
  },
  {
    label: "2F",
    floor: "2F",
    image: "https://c.animaapp.com/mnltqd91x3CwB7/img/5-1-1-4.png",
    topClassName: "top-[19px]",
    fontClassName: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal",
  },
];

const ACTIVE_FLOOR_IMAGE = "https://c.animaapp.com/mnltqd91x3CwB7/img/5-2-1.png";

const DEVICE_TYPE_ORDER: DeviceType[] = [
  DeviceType.Environment,
  DeviceType.WaterImmersion,
  DeviceType.ElectricMeter,
  DeviceType.WaterMeter,
  DeviceType.FumeHood,
  DeviceType.FrequencyConverter,
  DeviceType.GasPathHost,
];

const HEADER_IMAGES = [
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-1.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-2.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-3.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-4.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-5.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-6.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-7.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-8.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/----3-1-1-9.png",
];

const BOTTOM_IMAGES = [
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-1.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-2.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-3.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-4.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-5.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-6.png",
  "https://c.animaapp.com/mnltqd91x3CwB7/img/group-1321314852-7.png",
];

const DEVICE_IMAGES: Record<DeviceType, string> = {
  [DeviceType.Environment]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-1.png",
  [DeviceType.WaterImmersion]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-2.png",
  [DeviceType.WaterMeter]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-3.png",
  [DeviceType.ElectricMeter]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-4.png",
  [DeviceType.FumeHood]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-5.png",
  [DeviceType.FrequencyConverter]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-5.png",
  [DeviceType.GasPathHost]:
    "https://c.animaapp.com/mnltqd91x3CwB7/img/26a7df3b-1575-4699-a5d5-904cfcebe8e2-5.png",
};

type Metric = { label: string; value: string };

function formatValue(value: unknown, unit = ""): string {
  if (value === undefined || value === null || value === "") {
    return "--";
  }

  if (typeof value === "number") {
    return `${value}${unit}`;
  }

  return `${String(value)}${unit}`;
}

function formatStatusLabel(device: Device): string {
  if (!device.online) {
    return "离线";
  }

  if (device.deviceType === DeviceType.WaterImmersion) {
    const immersion = (device as any).parameters?.immersion_status;
    return Number(immersion) === 1 ? "报警" : "运行";
  }

  return "运行";
}

function buildMetrics(device: Device): Metric[] {
  const params = (device as any).parameters ?? {};

  switch (device.deviceType) {
    case DeviceType.Environment:
      return [
        { label: "温度", value: formatValue(params.temperature, "℃") },
        { label: "湿度", value: formatValue(params.humidity, "%") },
        { label: "TVOC", value: formatValue(params.tvoc, " mg/m³") },
        { label: "CO2", value: formatValue(params.co2, " ppm") },
        { label: "CO", value: formatValue(params.co, " ppm") },
      ];
    case DeviceType.WaterImmersion:
      return [
        { label: "浸水状态", value: Number(params.immersion_status) === 1 ? "浸水" : "正常" },
        { label: "报警状态", value: Number(params.alarm_status) === 1 ? "已报警" : "未报警" },
      ];
    case DeviceType.ElectricMeter:
      return [
        { label: "A相电压", value: formatValue(params.phase_a_voltage ?? params.phaseAVoltage, "V") },
        { label: "B相电压", value: formatValue(params.phase_b_voltage ?? params.phaseBVoltage, "V") },
        { label: "C相电压", value: formatValue(params.phase_c_voltage ?? params.phaseCVoltage, "V") },
        { label: "电流", value: formatValue(params.current, "A") },
        { label: "功率", value: formatValue(params.power, "kW") },
        { label: "频率", value: formatValue(params.frequency, "Hz") },
      ];
    case DeviceType.WaterMeter:
      return [
        { label: "总用水量", value: formatValue(params.water_consumption ?? params.totalWaterConsumption, "m³") },
        { label: "瞬时流量", value: formatValue(params.instantaneous_flow ?? params.instantaneousFlow, "m³/h") },
        { label: "阀门状态", value: Number(params.valve_status ?? params.valveStatus) === 0 ? "关闭" : "开启" },
      ];
    case DeviceType.FumeHood:
      return [
        { label: "视窗高度", value: formatValue(params.window_height ?? params.windowHeight, "mm") },
        { label: "阀门开度", value: formatValue(params.valve_opening ?? params.valveOpening, "%") },
        { label: "排风速度", value: formatValue(params.exhaust_air_speed ?? params.exhaustAirSpeed, "m/s") },
        { label: "排风量", value: formatValue(params.exhaust_air_volume ?? params.exhaustAirVolume, "m³/h") },
        { label: "面风速", value: formatValue(params.face_wind_speed ?? params.faceWindSpeed, "m/s") },
      ];
    case DeviceType.FrequencyConverter:
    case DeviceType.GasPathHost:
      return [
        { label: "运行频率", value: formatValue(params.exhaust_frequency ?? params.operatingFrequency, "Hz") },
        { label: "运行转速", value: formatValue(params.exhaust_speed ?? params.operatingSpeed, "r/min") },
        { label: "管道压力", value: formatValue(params.duct_pressure ?? params.ductPressure, "Pa") },
        { label: "设定压力", value: formatValue(params.duct_pressure_setting ?? params.ductPressureSetting, "Pa") },
        { label: "运行电流", value: formatValue(params.operating_current ?? params.operatingCurrent, "A") },
      ];
    default:
      return [];
  }
}

function buildCardTitle(device: Device): string {
  const name = getDeviceDisplayName(device.deviceType, device.interfaceName || device.deviceId);
  const match = name.match(/(\d+)[-_]/);
  if (match) {
    return `${match[1]}-${name.replace(/^.*?[-_]/, "")}`;
  }
  return name;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function MetricGrid({ metrics }: { metrics: Metric[] }): JSX.Element {
  const rows = chunk(metrics, 2);

  return (
    <div className="absolute left-5 top-[182px] w-[388px]">
      <div className="flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[18px]">
            {row.map((metric) => (
              <div
                key={metric.label}
                className="flex h-[27px] w-[185px] items-center gap-[18px] overflow-hidden rounded-sm bg-[#2c3940] px-[18px]"
              >
                <div className="min-w-[54px] text-xs text-[#ffffff99]">{metric.label}</div>
                <div className="truncate text-base text-white">{metric.value}</div>
              </div>
            ))}
            {row.length === 1 ? <div className="w-[185px]" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceCard({
  device,
  index,
}: {
  device: Device;
  index: number;
}): JSX.Element {
  const headerImage = HEADER_IMAGES[index % HEADER_IMAGES.length];
  const bottomImage = BOTTOM_IMAGES[index % BOTTOM_IMAGES.length];
  const title = buildCardTitle(device);
  const metrics = buildMetrics(device);
  const statusLabel = formatStatusLabel(device);
  const enabledLabel = device.online ? "正常" : "异常";
  const deviceImage = DEVICE_IMAGES[device.deviceType];

  return (
    <div className="relative h-[319px] w-[428px] overflow-hidden">
      <div className="absolute left-0 top-0 h-[319px] w-[428px]">
        <div className="absolute left-px top-px h-[318px] w-[425px] border border-solid border-transparent bg-[#0000004a] [border-image:linear-gradient(180deg,rgba(255,255,255,0)_58%,rgba(0,255,255,0.55)_100%)_1]" />
        <img className="absolute left-0 top-0 h-10 w-[428px]" alt="" src={headerImage} />
      </div>
      <div className="absolute left-0 top-0 flex h-[11px] w-4 gap-[5.5px]">
        <div className="h-[11px] w-[3px] bg-white" />
        <div className="mt-[-5.5px] h-[13px] w-0.5 rotate-90 bg-white" />
      </div>
      <div className="absolute right-0 top-0 flex h-[11px] w-[15px] rotate-180 gap-[4.7px]">
        <div className="h-[11px] w-[3px] bg-white" />
        <div className="mt-[3.7px] h-[12.42px] w-[2.12px] rotate-90 bg-white" />
      </div>
      <div className="absolute left-[214px] top-[-38px] h-[396px] w-px rotate-90 bg-[#ffffff4f]" />
      <img className="absolute left-[3px] top-[308px] h-[11px] w-[425px]" alt="" src={bottomImage} />

      <img className="absolute left-[35px] top-14 h-[64px] w-[67px]" alt="" src={deviceImage} />
      <div className="absolute left-[122px] top-14 h-[39px] w-[230px] truncate text-xl font-medium text-[#0db8db]">
        {title}
      </div>

      <div className="absolute left-[122px] top-[105px] flex h-[31px] w-[290px] gap-3">
        <div className="flex w-[140px] items-center gap-2">
          <div className="w-[75px] text-center text-xs text-white">设备开停状态</div>
          <div className="flex h-[31px] w-[55px] items-center justify-center rounded bg-[#224e68] text-xs text-white">
            {statusLabel}
          </div>
        </div>
        <div className="flex w-[140px] items-center gap-2">
          <div className="w-[75px] text-center text-xs text-white">设备使能</div>
          <div className="flex h-[31px] w-[55px] items-center justify-center rounded bg-[#224e68] text-xs text-white">
            {enabledLabel}
          </div>
        </div>
      </div>

      <div className="absolute left-7 top-[134px] inline-flex h-[21px] items-center gap-1 rounded px-1">
        <div className={`h-[5px] w-[5px] rounded-full ${device.online ? "bg-[#3cda54]" : "bg-[#ff6b6b]"}`} />
        <div className="text-[10px] text-white">在线状态:{device.online ? "运行" : "离线"}</div>
      </div>

      <MetricGrid metrics={metrics} />
    </div>
  );
}

export const Environment2F = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState<string | undefined>(appConfig.defaultFloor);
  const [activeFloorLabel, setActiveFloorLabel] = useState(() => {
    const defaultItem = FLOOR_NAV_ITEMS.find((item) => item.floor === appConfig.defaultFloor);
    return defaultItem?.label || "2F";
  });
  const [now, setNow] = useState(() => new Date());
  const { devices, loading, error } = useDevices({
    floor: selectedFloor,
    autoRefresh: appConfig.autoRefresh,
    refreshInterval: appConfig.deviceDashboardRefreshInterval,
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sortedDevices = useMemo(() => {
    return [...devices].sort((left, right) => {
      const typeDelta =
        DEVICE_TYPE_ORDER.indexOf(left.deviceType) - DEVICE_TYPE_ORDER.indexOf(right.deviceType);
      if (typeDelta !== 0) return typeDelta;
      return String(left.interfaceName).localeCompare(String(right.interfaceName), "zh-CN");
    });
  }, [devices]);

  const rows = useMemo(() => chunk(sortedDevices, 4), [sortedDevices]);

  return (
    <div className="relative min-h-[1080px] min-w-[1920px] overflow-hidden bg-[linear-gradient(180deg,rgba(8,34,49,1)_0%,rgba(24,53,69,1)_57%)]">
      <div className="absolute left-0 top-0 flex h-[1080px] w-[1920px] gap-[664px]">
        <div className="h-[1080px] w-[551px]" />
        <div className="h-[1080px] w-[705px] rotate-180" />
      </div>

      <div className="absolute left-0 top-px h-[1082px] w-[1924px]">
        <img
          className="absolute left-0 top-0 h-[1079px] w-[1920px] object-cover"
          alt=""
          src="https://c.animaapp.com/mnltqd91x3CwB7/img/11-1-1.png"
        />
        <div className="absolute left-[673px] top-[5px] w-[531px] text-center text-4xl tracking-[5.04px] text-[#f4f8ff] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica]">
          新天普智慧实验室可视化平台
        </div>
      </div>

      <div className="absolute left-[63px] top-9 inline-flex items-center gap-4">
        <img
          className="h-8 w-[43px]"
          alt=""
          src="https://c.animaapp.com/mnltqd91x3CwB7/img/header-cloud.png"
        />
        <div className="text-base text-[#95e2ff]">晴转多云</div>
        <div className="text-base text-[#95e2ff]">17-18℃</div>
        <div className="text-base text-[#95e2ff]">东南风</div>
      </div>

      <div className="absolute left-[1601px] top-[39px] flex w-[243px] items-center">
        <div className="w-[172px] text-base text-[#95e2ff]">
          {now.getFullYear()}年{now.getMonth() + 1}月{now.getDate()}日 周{"日一二三四五六"[now.getDay()]}
        </div>
        <div className="-ml-1.5 text-base font-bold tracking-[2px] text-[#95e2ff]">
          {now.toLocaleTimeString("zh-CN", { hour12: false })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/screen")}
        className="absolute left-[1805px] top-[78px] h-5 w-20"
      >
        <div className="absolute left-[30%] top-0 h-full w-[70%] text-center text-sm text-[#95e2ff]">
          回到首页
        </div>
        <img
          className="absolute left-0 top-0 h-5 w-5"
          alt=""
          src="https://c.animaapp.com/mnltqd91x3CwB7/img/frame.svg"
        />
      </button>

      <div className="absolute left-11 top-[86px] inline-flex flex-col items-start gap-[26px]">
        {FLOOR_NAV_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.route) {
                navigate(item.route);
                return;
              }
              setActiveFloorLabel(item.label);
              setSelectedFloor(item.floor);
            }}
            className="relative h-[54px] w-[59px]"
          >
            {(() => {
              const isActive = item.label === activeFloorLabel;
              return (
                <>
            <img
              className="absolute left-0 top-0 h-[54px] w-[57px]"
              alt=""
              src={isActive ? ACTIVE_FLOOR_IMAGE : item.image}
            />
            <div
              className={`absolute left-[3px] w-[52px] text-center text-sm tracking-[0] ${item.topClassName} ${item.fontClassName} ${
                isActive ? "text-white" : "text-[#ffffffcc]"
              } ${index > 0 ? "leading-[16.9px] whitespace-nowrap" : "leading-[normal]"}`}
            >
              {item.label}
            </div>
                </>
              );
            })()}
          </button>
        ))}
      </div>

      <style>{`
        .device-scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .device-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .device-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(149, 226, 255, 0.3);
          border-radius: 4px;
        }
        .device-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(149, 226, 255, 0.5);
        }
      `}</style>

      <section
        className="device-scroll-container absolute left-36 top-[108px] z-10 h-[892px] w-[1742px] overflow-y-auto overflow-x-hidden"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(149, 226, 255, 0.3) transparent",
        }}
      >
        <div className="flex w-full flex-col gap-4 pb-16">
        {loading ? (
          <div className="flex h-[320px] items-center justify-center text-lg text-white/70">
            {selectedFloor || "全部"} 设备加载中...
          </div>
        ) : error ? (
          <div className="flex h-[320px] items-center justify-center text-lg text-[#ff8f8f]">
            加载失败: {error}
          </div>
        ) : rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-[1742px] items-start gap-4">
              {row.map((device, index) => (
                <DeviceCard key={device.deviceId} device={device} index={rowIndex * 4 + index} />
              ))}
            </div>
          ))
        ) : (
          <div className="flex h-[320px] items-center justify-center text-lg text-white/70">
            暂无 {selectedFloor || "全部"} 设备数据
          </div>
        )}
        </div>
      </section>

      <nav className="absolute left-[748px] top-[1032px] z-40 inline-flex items-start gap-[26px]">
        {BOTTOM_NAV_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => item.route && navigate(item.route)}
            className={`relative mt-[-1px] flex items-center text-[26px] tracking-[0.52px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] ${
              index === 0 ? "text-white opacity-[0.58]" : "text-[#ffffff94]"
            } ${item.route ? "cursor-pointer hover:text-white" : "cursor-default"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
