import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { exhaustService, ExhaustDeviceApi } from "../../services/api.service";
import {
  USE_EXHAUST_MOCK_WHEN_EMPTY,
  getMockFloorDevices,
  getMockAllFloorsDevices,
} from "../../services/exhaustMockData";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  floor?: string;
}

interface TabItem {
  id: string;
  label: string;
  active: boolean;
}

interface DeviceInfo {
  id: string;
  status: string;
  system: string;
  systemDisplay: string;
  power: string;
  brand: string;
  location: string;
  alarmStatus: string;
  onlineTime: string;
  /** 在线时显示时长（如「2小时30分」），离线时显示连接状态（如「已断开」） */
  onlineDurationOrStatus: string;
  isOnline: boolean;
  image: string;
  fillImage1: string;
  fillImage2: string;
  params?: { duct_pressure_setting?: number; exhaust_frequency?: number; exhaust_speed?: number; duct_pressure?: number };
}

const FILL_IMAGES = [
  { f1: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-83.svg", f2: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-71-1.svg" },
  { f1: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-83-1.svg", f2: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-71.svg" },
  { f1: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-83-3.svg", f2: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-71-2.svg" },
  { f1: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-83-2.svg", f2: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-71-4.svg" },
  { f1: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-83-4.svg", f2: "https://c.animaapp.com/mlfddelzcAsR8I/img/fill-71-3.svg" },
];

const DEVICE_IMAGES = [
  "https://c.animaapp.com/mlfddelzcAsR8I/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1.png",
  "https://c.animaapp.com/mlfddelzcAsR8I/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-1.png",
  "https://c.animaapp.com/mlfddelzcAsR8I/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-2.png",
  "https://c.animaapp.com/mlfddelzcAsR8I/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-3.png",
  "https://c.animaapp.com/mlfddelzcAsR8I/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-4.png",
];

const formatSystemName = (name: string): string => {
  if (!name) return "--";
  const m = name.match(/FrequencyConverter[_-](\w+)[_-](\d+)/i);
  if (m) return `排风机 ${m[1]}-${m[2]}`;
  return name.replace(/FrequencyConverter/gi, "排风机");
};

/** 右侧 UI 风格：在线时长展示（紧凑，如 12000h / 2h30m / 45分钟） */
function formatOnlineDuration(lastUpdate?: number): string {
  if (lastUpdate == null || lastUpdate <= 0) return "持续在线";
  const diffMs = Date.now() - lastUpdate;
  if (diffMs < 60_000) return "1分钟内";
  if (diffMs < 3600_000) return `${Math.floor(diffMs / 60_000)}分钟`;
  const hours = Math.floor(diffMs / 3600_000);
  const mins = Math.floor((diffMs % 3600_000) / 60_000);
  if (hours >= 24) return `${hours}h`;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

const mapExhaustToDeviceInfo = (d: ExhaustDeviceApi, index: number): DeviceInfo => {
  const status = d.status?.operating ?? (d.online ? "正常运行" : "停止");
  const fill = FILL_IMAGES[index % FILL_IMAGES.length];
  const floorDisplay = d.floor === "RF" ? "楼顶" : d.floor || "--";
  const isOnline = d.online ?? false;
  const onlineDurationOrStatus = isOnline
    ? formatOnlineDuration(d.last_update)
    : "已断开";
  return {
    id: d.device_id,
    status: status === "正常运行" ? "运行" : status,
    system: d.interface_name || "--",
    systemDisplay: formatSystemName(d.interface_name || ""),
    power: d.parameters?.operating_current != null ? `${d.parameters.operating_current}A` : "5.5KW",
    brand: "广陵丰",
    location: floorDisplay,
    alarmStatus: status === "故障" ? "异常" : isOnline ? "正常" : "离线",
    onlineTime: isOnline ? "在线" : "离线",
    onlineDurationOrStatus,
    isOnline,
    image: DEVICE_IMAGES[index % DEVICE_IMAGES.length],
    fillImage1: fill.f1,
    fillImage2: fill.f2,
    params: d.parameters,
  };
};

export const Paifeng = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("21:00:03");
  const [currentDate] = useState("2025年11月30日 周一");
  const [activeFloor, setActiveFloor] = useState("总体");
  const [devicesRaw, setDevicesRaw] = useState<ExhaustDeviceApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ALL_FLOORS = ["RF", "5F", "4F", "3F", "2F"] as const;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const fetchDevices = async () => {
      try {
        if (activeFloor === "总体") {
          const results = await Promise.all(
            ALL_FLOORS.map((floor) =>
              exhaustService
                .getFloorDevices(floor)
                .then((r) => r.list ?? [])
                .catch(() => [] as ExhaustDeviceApi[])
            )
          );
          if (!cancelled) {
            const list = results.flat();
            if (USE_EXHAUST_MOCK_WHEN_EMPTY && list.length === 0) {
              setDevicesRaw(getMockAllFloorsDevices());
            } else {
              setDevicesRaw(list);
            }
          }
        } else {
          const { list } = await exhaustService.getFloorDevices(activeFloor).catch(() => ({ list: [] as ExhaustDeviceApi[] }));
          if (!cancelled) {
            const raw = list ?? [];
            if (USE_EXHAUST_MOCK_WHEN_EMPTY && raw.length === 0) {
              setDevicesRaw(getMockFloorDevices(activeFloor).list);
            } else {
              setDevicesRaw(raw);
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          if (USE_EXHAUST_MOCK_WHEN_EMPTY) {
            setDevicesRaw(activeFloor === "总体" ? getMockAllFloorsDevices() : getMockFloorDevices(activeFloor).list);
          } else {
            setDevicesRaw([]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDevices();
    return () => {
      cancelled = true;
    };
  }, [activeFloor]);

  const deviceData: DeviceInfo[] = useMemo(
    () => devicesRaw.map((d, i) => mapExhaustToDeviceInfo(d, i)),
    [devicesRaw]
  );

  const navigationItems: NavigationItem[] = [
    { id: "home", label: "首页", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1.png" },
    { id: "all", label: "全部", icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-2-1.png", floor: "总体" },
    { id: "roof", label: "楼顶", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1-1.png", floor: "RF" },
    { id: "5f", label: "5F", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1-2.png", floor: "5F" },
    { id: "4f", label: "4F", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1-3.png", floor: "4F" },
    { id: "3f", label: "3F", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1-4.png", floor: "3F" },
    { id: "2f", label: "2F", icon: "https://c.animaapp.com/mlfddelzcAsR8I/img/5-1-1-5.png", floor: "2F" },
  ];

  const tabItems: TabItem[] = [
    { id: "environment", label: "环境", active: false },
    { id: "exhaust", label: "排风", active: true },
    { id: "ventilation", label: "通风", active: false },
    { id: "gas", label: "气路", active: false },
    { id: "wastewater", label: "废水", active: false },
    { id: "energy", label: "能耗", active: false },
  ];

  const bottomNavItems: Array<{ label: string; route?: string }> = [
    { label: "环境", route: "/screen" },
    { label: "排风", route: "/paifeng" },
    { label: "通风", route: "/tongfeng" },
    { label: "气路" },
    { label: "废水" },
    { label: "能耗", route: "/nenghao" },
  ];

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Background Group"
        src="https://c.animaapp.com/mlfddelzcAsR8I/img/group-1321314752.png"
      />

      <div className="top-0 left-0 w-[1920px] h-[1080px] gap-[664px] absolute flex">
        <div className="w-[551px] h-[1080px]" />
        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      {/* 移除 backdrop-blur 避免灰色雾霾与重影 */}

      {/* 移除 backdrop-blur 避免灰色雾霾与重影 */}

      <header className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Header Background"
          src="https://c.animaapp.com/mlfddelzcAsR8I/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap antialiased">
          新天普智慧实验室可视化平台
        </h1>
      </header>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {bottomNavItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.route && navigate(item.route)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal ${
              item.label === "排风" ? "text-white" : "text-[#95e2ff]"
            } text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${item.route ? "cursor-pointer hover:text-white transition-colors" : ""}`}
            aria-current={item.label === "排风" ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        className="inline-flex items-center gap-4 absolute top-9 left-[63px]"
        role="complementary"
        aria-label="Weather information"
      >
        <img
          className="relative w-[43px] h-8"
          alt="Weather icon"
          src="https://c.animaapp.com/mlfddelzcAsR8I/img/header-cloud.png"
        />
        <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          晴转多云
        </span>
        <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          17-18℃
        </span>
        <span className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          东南风
        </span>
      </div>

      <div
        className="w-[243px] items-center top-[39px] left-[1601px] absolute flex"
        role="complementary"
        aria-label="Date and time"
      >
        <time className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          {currentDate}
        </time>
        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          {currentTime}
        </time>
      </div>

      <nav
        className="flex flex-col w-[57px] items-start gap-[26px] absolute top-[108px] left-10"
        role="navigation"
        aria-label="Floor navigation"
      >
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.floor) setActiveFloor(item.floor);
            }}
            className={`relative w-[59px] h-[54px] mr-[-2.00px] ${item.id === "home" || item.floor ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            aria-label={`Navigate to ${item.label}`}
            aria-current={item.floor === activeFloor ? "page" : undefined}
          >
            <img
              className="absolute top-0 left-0 w-[57px] h-[54px]"
              alt=""
              src={item.icon}
            />
            <span
              className={`absolute top-[17px] left-[3px] w-[52px] text-sm text-center tracking-[0] ${
                item.floor === activeFloor
                  ? "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white leading-[16.9px] whitespace-nowrap"
                  : item.id === "home" || item.id === "roof"
                    ? "[font-family:'Poppins',Helvetica] font-medium text-[#b8e8ff] leading-[normal]"
                    : "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#b8e8ff] leading-[16.9px] whitespace-nowrap"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <img
        className="absolute top-16 left-[227px] w-[1370px] h-[973px] object-cover z-0"
        alt="3D Laboratory Visualization"
        src="https://c.animaapp.com/mlfddelzcAsR8I/img/-----2025-12-15-092926-496.png"
      />

      <div
        className="absolute bottom-[80px] left-[100px] right-[100px] z-10 overflow-x-auto overflow-y-hidden scroll-smooth flex items-center gap-[20px] flex-nowrap py-2 pb-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(24, 254, 254, 0.6) rgba(10, 47, 71, 0.4)',
        }}
      >
        {loading && !error && (
          <div className="text-[#95e2ff] text-base">加载中...</div>
        )}
        {error && <div className="text-red-400 text-base">{error}</div>}
        {!loading && !error && deviceData.length === 0 && (
          <div className="text-[#95e2ff] text-base">该楼层暂无排风机设备</div>
        )}
        {!loading &&
          !error &&
          deviceData.map((device, index) => (
            <article
              key={device.id}
              className="relative w-[380px] h-[188px] flex-shrink-0"
              aria-label={`Device ${index + 1} information`}
            >
              <div className="relative w-full h-full will-change-transform" style={{ transform: 'rotate(180deg) translateZ(0)', backfaceVisibility: 'hidden' } as React.CSSProperties}>
                <img
                  className="absolute w-[100px] h-[76px] top-0 left-0 -rotate-180"
                  alt=""
                  src="https://c.animaapp.com/mlfddelzcAsR8I/img/fill-70.svg"
                />

                <img
                  className="absolute w-full h-full top-0 left-0 -rotate-180 object-fill"
                  alt=""
                  src={device.fillImage1}
                />

                <img
                  className="absolute top-[65px] right-[30px] w-[66px] h-[86px] -rotate-180 object-contain"
                  alt="Device equipment"
                  src={device.image}
                />

                <img
                  className="absolute w-full h-full top-0 left-0 -rotate-180 object-fill"
                  alt=""
                  src={device.fillImage2}
                />

                <img
                  className="absolute w-[125px] h-0 top-[28px] right-[80px] -rotate-180"
                  alt=""
                  src="https://c.animaapp.com/mlfddelzcAsR8I/img/fill-75.svg"
                />
                <img
                  className="absolute w-[34px] h-0 top-[20px] right-[46px] -rotate-180"
                  alt=""
                  src="https://c.animaapp.com/mlfddelzcAsR8I/img/fill-75.svg"
                />
                <img
                  className="absolute w-[19px] h-0 top-[12px] right-[27px] -rotate-180"
                  alt=""
                  src="https://c.animaapp.com/mlfddelzcAsR8I/img/fill-75.svg"
                />

                <img
                  className="absolute w-[21px] h-[16px] top-0 left-0 -rotate-180"
                  alt=""
                  src="https://c.animaapp.com/mlfddelzcAsR8I/img/fill-82.svg"
                />

                {/* 状态：在线时长/连接状态 的数值 + 标签 */}
                <div
                  className={`absolute top-[52px] right-[35px] max-w-[100px] rotate-180 [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] antialiased truncate ${
                    device.isOnline ? "text-[#18fefe]" : "text-[#0eb8b8]"
                  }`}
                  title={device.onlineDurationOrStatus}
                >
                  {device.onlineDurationOrStatus}
                </div>
                <div className="absolute top-[33px] right-[45px] w-16 rotate-180 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[10px] tracking-[0] leading-[normal] text-white antialiased">
                  {device.isOnline ? "在线时长" : "连接状态"}
                </div>

                {/* 右侧 UI：标签与数值两列对齐，数值右对齐与参考图一致 */}
                <dl className="flex flex-col w-[140px] min-w-[140px] justify-center gap-1 absolute top-[20px] left-[58px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-[10px] tracking-[0] leading-[normal] antialiased">
                  <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                    <span className="text-white truncate flex-shrink">设备异常告警状态：</span>
                    <span className={`flex-shrink-0 ${device.alarmStatus === "正常" ? "text-green-400" : "text-white"}`}>{device.alarmStatus}</span>
                  </dd>
                  <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                    <span className="text-white truncate flex-shrink">位置：</span>
                    <span className="text-white flex-shrink-0">{device.location}</span>
                  </dd>
                  <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                    <span className="text-white truncate flex-shrink">品牌：</span>
                    <span className="text-white flex-shrink-0">{device.brand}</span>
                  </dd>
                  <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                    <span className="text-white truncate flex-shrink">功率：</span>
                    <span className="text-white flex-shrink-0">{device.power}</span>
                  </dd>
                  <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0" title={device.systemDisplay}>
                    <span className="text-white truncate flex-shrink">所属系统：</span>
                    <span className="text-white flex-shrink-0 truncate max-w-[88px]" title={device.systemDisplay}>{device.systemDisplay}</span>
                  </dd>
                  {device.params &&
                    (device.params.duct_pressure != null || device.params.exhaust_frequency != null) && (
                      <>
                        <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                          <span className="text-white truncate flex-shrink">排风频率：</span>
                          <span className="text-white flex-shrink-0">{device.params.exhaust_frequency ?? "--"}Hz</span>
                        </dd>
                        <dd className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                          <span className="text-white truncate flex-shrink">管道压力：</span>
                          <span className="text-white flex-shrink-0">{device.params.duct_pressure ?? "--"}Pa</span>
                        </dd>
                      </>
                    )}
                  <div className="relative w-full rotate-180 flex justify-between items-center gap-2 min-w-0">
                    <span className="text-white truncate flex-shrink flex items-center gap-1">
                      <img className="w-4 h-4 -rotate-180 flex-shrink-0" alt="" src="https://c.animaapp.com/mlfddelzcAsR8I/img/frame.svg" />
                      设备运行状态：
                    </span>
                    <span className="text-[#18fefe] flex-shrink-0">{device.status}</span>
                  </div>
                </dl>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
};
