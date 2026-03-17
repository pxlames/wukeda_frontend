import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ventilationService, VentilationDeviceApi } from "../../services/api.service";
import {
  USE_VENTILATION_MOCK_WHEN_EMPTY,
  getMockFloorDevices,
  getMockAllFloorsDevices,
} from "../../services/ventilationMockData";

/** 所有楼层的 API 码（用于总体视图并行请求） */
const ALL_FLOORS = ["2F", "3F", "4F", "5F", "RF"] as const;

/** API 楼层码 -> 展示用楼层名（如 "2楼"） */
const API_FLOOR_TO_DISPLAY: Record<string, string> = {
  RF: "楼顶",
  "5F": "5楼",
  "4F": "4楼",
  "3F": "3楼",
  "2F": "2楼",
};

interface DeviceCard {
  id: string | number;
  onlineTime: string;
  /** 在线时显示时长（如「2h30m」），离线时显示「已断开」 */
  onlineDurationOrStatus: string;
  status: string;
  brand: string;
  location: string;
  system: string;
  alarmStatus: string;
  exhaustSwitch: string;
  valveOpening: string;
  power: string;
  faceWindSpeed: string;
  exhaustSpeed: string;
  windowHeight: string;
  exhaustVolume: string;
}

/** 在线时长展示（与排风页一致） */
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

/** 数值格式化，避免浮点显示为 0.21000000000000002 导致重叠 */
const fmtNum = (v: number | undefined, decimals: number) =>
  (v ?? 0).toFixed(decimals).replace(/\.?0+$/, "") || "0";

/** 所属系统展示：仅展示接口名，过长时截断，避免与其它字段混排 */
const formatSystemDisplay = (name: string): string => {
  if (!name) return "—";
  return name.trim();
};

const mapApiToDeviceCard = (d: VentilationDeviceApi): DeviceCard => {
  const params = d.parameters ?? {};
  const floorDisplay = API_FLOOR_TO_DISPLAY[d.floor] ?? d.floor;
  const location = d.room ? `${floorDisplay}-${d.room}` : floorDisplay;
  const windowHeightMm = params.window_height ?? 0;
  const windowHeightCm = (windowHeightMm / 10).toFixed(1);
  const isOnline = d.online ?? true;

  return {
    id: d.device_id,
    onlineTime: isOnline ? "在线" : "离线",
    onlineDurationOrStatus: isOnline ? formatOnlineDuration(d.last_update) : "已断开",
    status: d.status?.device_on_off ?? "停机",
    brand: "新天普",
    location,
    system: formatSystemDisplay(d.interface_name || "—"),
    alarmStatus: "正常",
    exhaustSwitch: (params.forced_exhaust_switch ?? 0) === 1 ? "开启" : "关闭",
    valveOpening: `${Number(params.valve_opening ?? 0).toFixed(0)}%`,
    power: "-",
    faceWindSpeed: `${fmtNum(params.face_wind_speed, 2)}m/s`,
    exhaustSpeed: `${fmtNum(params.exhaust_air_speed, 2)}m/s`,
    windowHeight: `${windowHeightCm}cm`,
    exhaustVolume: `${fmtNum(params.exhaust_air_volume, 0)} m³/h`,
  };
};

export const Tongfeng = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState<string>("总体");
  const [deviceCards, setDeviceCards] = useState<DeviceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("21:00:03");
  const [currentDate, setCurrentDate] = useState("2025年11月30日 周一");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const weekday = weekdays[now.getDay()];
      setCurrentDate(`${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, "0")}月${String(now.getDate()).padStart(2, "0")}日 ${weekday}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchFloorDevices = useCallback(async (floor: string) => {
    setLoading(true);
    setError(null);
    try {
      if (floor === "总体") {
        const results = await Promise.all(
          ALL_FLOORS.map((f) =>
            ventilationService
              .getFloorDevices(f)
              .then((r) => r.list ?? [])
              .catch(() => [] as VentilationDeviceApi[])
          )
        );
        let allList = results.flat();
        if (USE_VENTILATION_MOCK_WHEN_EMPTY && allList.length === 0) {
          allList = getMockAllFloorsDevices();
        }
        setDeviceCards(allList.map((d) => mapApiToDeviceCard(d)));
      } else {
        const { list } = await ventilationService.getFloorDevices(floor).catch(() => ({ list: [] as VentilationDeviceApi[] }));
        let raw = list ?? [];
        if (USE_VENTILATION_MOCK_WHEN_EMPTY && raw.length === 0) {
          raw = getMockFloorDevices(floor).list;
        }
        setDeviceCards(raw.map((d) => mapApiToDeviceCard(d)));
      }
    } catch (e) {
      setError((e as Error).message);
      if (USE_VENTILATION_MOCK_WHEN_EMPTY) {
        const mockList = floor === "总体" ? getMockAllFloorsDevices() : getMockFloorDevices(floor).list;
        setDeviceCards(mockList.map((d) => mapApiToDeviceCard(d)));
      } else {
        setDeviceCards([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFloorDevices(selectedFloor);
  }, [selectedFloor, fetchFloorDevices]);

  const navigationTabs = [
    { label: "环境", active: false, route: "/screen" },
    { label: "排风", active: false, route: "/paifeng" },
    { label: "通风", active: true, route: "/tongfeng" },
    { label: "气路", active: false },
    { label: "废水", active: false },
    { label: "能耗", active: false, route: "/nenghao" },
  ];

  const floorNavigation: Array<{ label: string; image: string; route?: string; floor?: string }> = [
    { label: "首页", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1.png" },
    { label: "总体", image: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-2-1.png", floor: "总体" },
    { label: "楼顶", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1-1.png", floor: "RF" },
    { label: "5F", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1-2.png", floor: "5F" },
    { label: "4F", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1-3.png", floor: "4F" },
    { label: "3F", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1-4.png", floor: "3F" },
    { label: "2F", image: "https://c.animaapp.com/mlfe27xf2S2o4u/img/5-1-1-5.png", floor: "2F" },
  ];

  const handleFloorClick = (item: { route?: string; floor?: string }) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.floor) {
      setSelectedFloor(item.floor);
    }
  };

  const displayCards = deviceCards.length > 0 ? deviceCards : [];

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Group"
        src="https://c.animaapp.com/mlfe27xf2S2o4u/img/group-1321314752.png"
      />

      <div className="top-0 left-0 w-[1920px] h-[1080px] gap-[664px] absolute flex">
        <div className="w-[551px] h-[1080px]" />
        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <header className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Element"
          src="https://c.animaapp.com/mlfe27xf2S2o4u/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </header>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => tab.route && navigate(tab.route)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              tab.active ? "text-white" : "text-[#ffffff94]"
            } ${tab.route ? "cursor-pointer hover:text-white transition-colors" : ""}`}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="inline-flex items-center gap-4 absolute top-9 left-[63px]">
        <img
          className="relative w-[43px] h-8"
          alt="Header cloud"
          src="https://c.animaapp.com/mlfe27xf2S2o4u/img/header-cloud.png"
        />
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          晴转多云
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          17-18℃
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          东南风
        </div>
      </div>

      <div className="w-[243px] items-center top-[39px] left-[1601px] absolute flex">
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
        {floorNavigation.map((floor, index) => {
          const isActive = floor.floor ? floor.floor === selectedFloor : false;
          const isClickable = !!(floor.route || floor.floor);
          return (
            <button
              key={index}
              onClick={() => handleFloorClick(floor)}
              className={`relative w-[59px] h-[54px] mr-[-2.00px] ${isClickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <img
                className="absolute top-0 left-0 w-[57px] h-[54px]"
                alt=""
                src={floor.image}
              />
              <span
                className={`absolute top-[17px] left-[3px] w-[52px] text-sm text-center tracking-[0] [font-family:'Poppins',Helvetica] font-medium leading-[normal] ${
                  isActive ? "text-white" : "text-[#ffffffcc]"
                }`}
              >
                {floor.label}
              </span>
            </button>
          );
        })}
      </nav>

      <img
        className="absolute top-[78px] left-[231px] w-[1423px] h-[974px] object-cover"
        alt="Element"
        src="https://c.animaapp.com/mlfe27xf2S2o4u/img/-----2025-12-15-092917-963.png"
      />

      {/* Device cards container - 可左右滚动，自定义滚动条 */}
      <div
        className="tongfeng-scroll-container absolute bottom-[90px] left-[231px] right-[231px] overflow-x-auto overflow-y-hidden scroll-smooth pb-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(24, 254, 254, 0.6) rgba(10, 47, 71, 0.4)',
        }}
      >
        <div className="flex items-center justify-start gap-4 flex-nowrap min-h-[144px]">
          {error && (
            <div className="w-full flex justify-center py-4">
              <span className="text-red-400 text-sm">加载失败：{error}</span>
            </div>
          )}
          {loading && displayCards.length === 0 && (
            <div className="w-full flex justify-center py-4">
              <span className="text-[#95e2ff] text-sm">加载中...</span>
            </div>
          )}
          {!loading && !error && displayCards.length === 0 && (
            <div className="w-full flex justify-center py-4">
              <span className="text-[#95e2ff] text-sm">
                {selectedFloor === "总体" ? "暂无通风设备" : `${API_FLOOR_TO_DISPLAY[selectedFloor] ?? selectedFloor} 暂无通风设备`}
              </span>
            </div>
          )}
          {displayCards.map((card) => (
          <article
            key={card.id}
            className="relative w-[360px] min-h-[140px] flex-shrink-0 bg-[#0a2f4799] border border-[#18fefe40] rounded-lg shadow-[inset_0_0_0_1px_rgba(24,254,254,0.08)]"
            style={{
              background: "linear-gradient(180deg, rgba(10, 47, 71, 0.6) 0%, rgba(10, 47, 71, 0.92) 100%)",
            }}
          >
            {/* 四角装饰 */}
            <div className="absolute top-0 left-0 w-3 h-3"><div className="absolute top-0 left-0 w-3 h-[2px] bg-[#18fefe]" /><div className="absolute top-0 left-0 w-[2px] h-3 bg-[#18fefe]" /></div>
            <div className="absolute top-0 right-0 w-3 h-3"><div className="absolute top-0 right-0 w-3 h-[2px] bg-[#18fefe]" /><div className="absolute top-0 right-0 w-[2px] h-3 bg-[#18fefe]" /></div>
            <div className="absolute bottom-0 left-0 w-3 h-3"><div className="absolute bottom-0 left-0 w-3 h-[2px] bg-[#18fefe]" /><div className="absolute bottom-0 left-0 w-[2px] h-3 bg-[#18fefe]" /></div>
            <div className="absolute bottom-0 right-0 w-3 h-3"><div className="absolute bottom-0 right-0 w-3 h-[2px] bg-[#18fefe]" /><div className="absolute bottom-0 right-0 w-[2px] h-3 bg-[#18fefe]" /></div>

            <div className="absolute inset-0 flex items-center pl-3 pr-3 py-2 gap-0">
              {/* 左侧：设备图 + 在线时长 */}
              <div className="w-[80px] flex-shrink-0 flex flex-col items-center justify-center">
                <img
                  className="w-[64px] h-[76px] object-contain flex-shrink-0"
                  alt="通风设备"
                  src="https://c.animaapp.com/mlfe27xf2S2o4u/img/jimeng-2025-11-12-7622-------------------------------------------4.png"
                />
                <div className="mt-1 text-center min-w-0 w-full">
                  <div className="[font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-bold text-white text-base leading-tight truncate" title={card.onlineDurationOrStatus}>
                    {card.onlineDurationOrStatus}
                  </div>
                  <div className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-white/90 text-[9px] mt-0.5">在线时长</div>
                </div>
              </div>

              {/* 中间：设备信息 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden border-r border-[#18fefe25] pr-2 pl-1 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-[10px] text-white space-y-0.5">
                <div className="flex items-center gap-1 min-h-[14px]">
                  <span className="flex-shrink-0 text-white/90">设备运行状态：</span>
                  <img className="w-3.5 h-2 flex-shrink-0" alt="" src="https://c.animaapp.com/mlfe27xf2S2o4u/img/frame.svg" />
                  <span className="text-[#18fefe] font-medium">{card.status}</span>
                </div>
                <div className="flex items-center gap-1 min-h-[14px] min-w-0">
                  <span className="flex-shrink-0 text-white/90">品牌：</span>
                  <span className="text-white/95 truncate">{card.brand}</span>
                </div>
                <div className="flex items-center gap-1 min-h-[14px] min-w-0">
                  <span className="flex-shrink-0 text-white/90">位置：</span>
                  <span className="text-white/95 truncate">{card.location}</span>
                </div>
                <div className="flex items-start gap-1 min-h-[14px] min-w-0">
                  <span className="flex-shrink-0 text-white/90">所属系统：</span>
                  <span className="text-white/95 break-words">{card.system}</span>
                </div>
                <div className="flex items-center gap-1 min-h-[14px] min-w-0">
                  <span className="flex-shrink-0 text-white/90">设备异常告警状态：</span>
                  <span className="text-white">{card.alarmStatus}</span>
                </div>
              </div>

              {/* 右侧：参数行内标签+数值紧贴（gap-1），不撑满宽度 */}
              <div className="flex-shrink-0 flex flex-col justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-[10px]">
                <div className="flex flex-col gap-y-0.5">
                  <div className="flex items-center gap-1"><span className="text-white/90">强排开关</span><img className="w-3.5 h-2 flex-shrink-0" alt={card.exhaustSwitch} src="https://c.animaapp.com/mlfe27xf2S2o4u/img/frame.svg" /></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">阀门开度</span><span className="text-[#18fefe] tabular-nums">{card.valveOpening}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">实时功率</span><span className={`tabular-nums ${card.power !== '-' ? 'text-[#18fefe]' : 'text-white/70'}`}>{card.power}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">面风速</span><span className="text-[#18fefe] tabular-nums">{card.faceWindSpeed}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">排风速度</span><span className="text-[#18fefe] tabular-nums">{card.exhaustSpeed}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">视窗高度</span><span className="text-[#18fefe] tabular-nums">{card.windowHeight}</span></div>
                  <div className="flex items-center gap-1"><span className="text-white/90">排风量</span><span className="text-[#18fefe] tabular-nums">{card.exhaustVolume}</span></div>
                </div>
              </div>
            </div>
          </article>
          ))}
        </div>
      </div>
    </div>
  );
};
