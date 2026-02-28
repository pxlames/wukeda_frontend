import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  environmentService,
  EnvironmentDeviceApi,
} from "../../services/api.service";
import {
  USE_ENV_MOCK_WHEN_EMPTY,
  getMockAllFloorsDevices,
  getMockFloorDevices,
  getMockFloorTemperatureToday,
  getMockFloorHistory,
  getMockDeviceRealtime,
} from "../../services/environmentMockData";

interface EnvironmentMetric {
  icon: string;
  value: string;
  label: string;
}

interface DeviceStatus {
  id: string;
  name: string;
  online: boolean;
  stopped: boolean;
  selected: boolean;
}

interface FloorDevices {
  floor: string;
  count: number;
  devices: DeviceStatus[];
}

interface NavigationItem {
  icon: string;
  label: string;
  active: boolean;
  route?: string;
  floor?: string;
}

const METRIC_ICONS = {
  temperature: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame-7.svg",
  humidity: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame.svg",
  co2: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame-9.svg",
  co: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame-3.svg",
  tvoc: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame-5.svg",
};

const formatMetricValue = (v: number | undefined): string =>
  v !== undefined && v !== null ? String(v) : "--";

export const Screen = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState("总体");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [floorTemperatureToday, setFloorTemperatureToday] = useState<{
    temperature_avg: number;
    temperature_max: number;
    temperature_min: number;
  } | null>(null);
  const [floorHistory, setFloorHistory] = useState<
    { ts: number; temperature?: number; humidity?: number; co2?: number; tvoc?: number; co?: number }[] | null
  >(null);
  const [deviceRealtime, setDeviceRealtime] = useState<{
    interface_name: string;
    temperature?: number;
    humidity?: number;
    co2?: number;
    tvoc?: number;
    co?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 楼层与 nav 的映射：楼顶=RF, 5F, 4F, 3F, 2F
  const floorMap: Record<string, string> = {
    楼顶: "RF",
    "5F": "5F",
    "4F": "4F",
    "3F": "3F",
    "2F": "2F",
  };

  // API 楼层码 -> 展示名（RF->楼顶）
  const apiFloorToDisplay: Record<string, string> = {
    RF: "楼顶",
    "5F": "5F",
    "4F": "4F",
    "3F": "3F",
    "2F": "2F",
  };

  // 所有楼层的 API 码，按建筑顺序 2F->楼顶
  const ALL_FLOORS = ["2F", "3F", "4F", "5F", "RF"] as const;

  // 各楼层设备：{ "2F": [...], "3F": [...] }
  const [allFloorsDevices, setAllFloorsDevices] = useState<
    Record<string, EnvironmentDeviceApi[]>
  >({});

  // 请求：所有楼层的设备列表（并行）
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const results = await Promise.all(
          ALL_FLOORS.map((apiFloor) =>
            environmentService
              .getFloorDevices(apiFloor)
              .then((r) => ({ apiFloor, list: r.list ?? [] }))
              .catch(() => ({ apiFloor, list: [] as EnvironmentDeviceApi[] }))
          )
        );
        if (cancelled) return;
        const map: Record<string, EnvironmentDeviceApi[]> = {};
        results.forEach(({ apiFloor, list }) => {
          map[apiFloor] = Array.isArray(list) ? list : [];
        });
        const hasAny = ALL_FLOORS.some((f) => (map[f] ?? []).length > 0);
        if (!hasAny && USE_ENV_MOCK_WHEN_EMPTY) {
          const mockMap = getMockAllFloorsDevices();
          ALL_FLOORS.forEach((f) => {
            map[f] = mockMap[f] ?? getMockFloorDevices(f).list;
          });
        }
        setAllFloorsDevices(map);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          if (USE_ENV_MOCK_WHEN_EMPTY) {
            const mockMap = getMockAllFloorsDevices();
            setAllFloorsDevices(mockMap);
          } else {
            setAllFloorsDevices({});
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  // 设备 ID -> 所在楼层（用于右侧详情展示）
  const deviceIdToFloor = useMemo(() => {
    const map: Record<string, string> = {};
    ALL_FLOORS.forEach((apiFloor) => {
      const list = allFloorsDevices[apiFloor] ?? [];
      list.forEach((d) => {
        map[d.device_id] = apiFloorToDisplay[apiFloor] ?? apiFloor;
      });
    });
    return map;
  }, [allFloorsDevices]);

  // 当前可视设备列表（总体=全部，具体楼层=该楼层）
  const currentFloorDevicesRaw = useMemo(() => {
    if (activeFloor === "总体") {
      return ALL_FLOORS.flatMap((apiFloor) => allFloorsDevices[apiFloor] ?? []);
    }
    const apiFloor = floorMap[activeFloor] || activeFloor;
    return allFloorsDevices[apiFloor] ?? [];
  }, [allFloorsDevices, activeFloor]);

  // 切换楼层/总体后：若当前选中设备不在可视列表中，则自动选中第一个设备
  useEffect(() => {
    const list = currentFloorDevicesRaw;
    const first = list[0];
    if (!first) {
      setSelectedDeviceId(null);
      return;
    }
    const isSelectedInList = list.some((d) => d.device_id === selectedDeviceId);
    if (!selectedDeviceId || !isSelectedInList) {
      setSelectedDeviceId(first.device_id);
    }
  }, [currentFloorDevicesRaw, selectedDeviceId]);

  // 设备列表（含选中态）- 总体：展示所有楼层；具体楼层：仅展示该楼层
  const floorDevicesList: FloorDevices[] = useMemo(() => {
    if (activeFloor === "总体") {
      return ALL_FLOORS.filter(
        (apiFloor) => (allFloorsDevices[apiFloor] ?? []).length > 0
      ).map((apiFloor) => {
        const raw = allFloorsDevices[apiFloor] ?? [];
        const devices: DeviceStatus[] = raw.map((d) => ({
          id: d.device_id,
          name: d.interface_name,
          online: d.online ?? true,
          stopped: !(d.online ?? true),
          selected: selectedDeviceId === d.device_id,
        }));
        const displayName = apiFloorToDisplay[apiFloor] ?? apiFloor;
        return { floor: displayName, count: devices.length, devices };
      });
    }
    const apiFloor = floorMap[activeFloor] || activeFloor;
    const raw = allFloorsDevices[apiFloor] ?? [];
    const devices: DeviceStatus[] = raw.map((d) => ({
      id: d.device_id,
      name: d.interface_name,
      online: d.online ?? true,
      stopped: !(d.online ?? true),
      selected: selectedDeviceId === d.device_id,
    }));
    const displayName = apiFloorToDisplay[apiFloor] ?? activeFloor;
    if (devices.length === 0) return [];
    return [{ floor: displayName, count: devices.length, devices }];
  }, [allFloorsDevices, selectedDeviceId, activeFloor]);

  // 请求：楼层今日温度、楼层历史（总体时用 2F 请求，避免 /api/floors/总体 404）
  useEffect(() => {
    const apiFloor = activeFloor === "总体" ? "2F" : (floorMap[activeFloor] || activeFloor);
    let cancelled = false;

    const fetch = async () => {
      try {
        const [todayRes, historyRes] = await Promise.all([
          environmentService.getFloorTemperatureToday(apiFloor),
          environmentService.getFloorHistory(apiFloor, {
            timeLength: 24 * 60 * 60 * 1000,
            dataCount: 24,
          }),
        ]);
        if (cancelled) return;
        setFloorTemperatureToday({
          temperature_avg: todayRes.temperature_avg ?? 23,
          temperature_max: todayRes.temperature_max ?? 26,
          temperature_min: todayRes.temperature_min ?? 20,
        });
        setFloorHistory(historyRes.timeseries || []);
      } catch {
        if (!cancelled) {
          if (USE_ENV_MOCK_WHEN_EMPTY) {
            const todayMock = getMockFloorTemperatureToday(apiFloor);
            const historyMock = getMockFloorHistory(apiFloor, { dataCount: 24 });
            setFloorTemperatureToday({
              temperature_avg: todayMock.temperature_avg ?? 23,
              temperature_max: todayMock.temperature_max ?? 26,
              temperature_min: todayMock.temperature_min ?? 20,
            });
            setFloorHistory(historyMock.timeseries || []);
          } else {
            setFloorTemperatureToday(null);
            setFloorHistory(null);
          }
        }
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [activeFloor]);

  // 请求：选中设备的实时数据
  useEffect(() => {
    if (!selectedDeviceId) {
      setDeviceRealtime(null);
      return;
    }
    let cancelled = false;

    const fetch = async () => {
      try {
        const data = await environmentService.getDeviceRealtime(selectedDeviceId);
        if (!cancelled) {
          setDeviceRealtime(
            data && (data.interface_name != null || data.temperature != null)
              ? { interface_name: data.interface_name ?? "", temperature: data.temperature, humidity: data.humidity, co2: data.co2, tvoc: data.tvoc, co: data.co }
              : null
          );
        }
      } catch {
        if (!cancelled) {
          if (USE_ENV_MOCK_WHEN_EMPTY) {
            const mock = getMockDeviceRealtime(selectedDeviceId);
            setDeviceRealtime({
              interface_name: mock.interface_name,
              temperature: mock.temperature,
              humidity: mock.humidity,
              co2: mock.co2,
              tvoc: mock.tvoc,
              co: mock.co,
            });
          } else {
            setDeviceRealtime(null);
          }
        }
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [selectedDeviceId]);

  // 环境监测区域：优先用选中设备实时数据，否则用楼层历史最新点
  const environmentMetrics: EnvironmentMetric[] = useMemo(() => {
    const d = deviceRealtime;
    const latest = floorHistory && floorHistory.length > 0 ? floorHistory[floorHistory.length - 1] : null;
    const t = d?.temperature ?? latest?.temperature;
    const h = d?.humidity ?? latest?.humidity;
    const c2 = d?.co2 ?? latest?.co2;
    const c = d?.co ?? latest?.co;
    const tv = d?.tvoc ?? latest?.tvoc;
    return [
      { icon: METRIC_ICONS.temperature, value: formatMetricValue(t), label: "温度(℃)" },
      { icon: METRIC_ICONS.humidity, value: formatMetricValue(h), label: "湿度(%)" },
      { icon: METRIC_ICONS.co2, value: formatMetricValue(c2), label: "CO₂(ppm)" },
      { icon: METRIC_ICONS.co, value: formatMetricValue(c), label: "CO(ppm)" },
      { icon: METRIC_ICONS.tvoc, value: formatMetricValue(tv), label: "TVOC(mg/m³)" },
    ];
  }, [deviceRealtime, floorHistory]);

  // 设备详情区域：选中设备的实时数据，无选中时显示占位
  const detailMetrics: EnvironmentMetric[] = useMemo(() => {
    const d = deviceRealtime;
    return [
      { icon: METRIC_ICONS.temperature, value: formatMetricValue(d?.temperature), label: "温度(℃)" },
      { icon: METRIC_ICONS.humidity, value: formatMetricValue(d?.humidity), label: "湿度(%)" },
      { icon: METRIC_ICONS.co2, value: formatMetricValue(d?.co2), label: "CO₂(ppm)" },
      { icon: METRIC_ICONS.co, value: formatMetricValue(d?.co), label: "CO(ppm)" },
      { icon: METRIC_ICONS.tvoc, value: formatMetricValue(d?.tvoc), label: "TVOC(mg/m³)" },
    ];
  }, [deviceRealtime]);

  const navigationItems: NavigationItem[] = [
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1.png", label: "首页", active: false, route: "/" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-2-1.png", label: "总体", active: activeFloor === "总体", floor: "总体" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1-1.png", label: "楼顶", active: activeFloor === "楼顶", floor: "楼顶" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1-2.png", label: "5F", active: activeFloor === "5F", floor: "5F" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1-3.png", label: "4F", active: activeFloor === "4F", floor: "4F" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1-4.png", label: "3F", active: activeFloor === "3F", floor: "3F" },
    { icon: "https://c.animaapp.com/mlfd2as9F7Vwy4/img/5-1-1-5.png", label: "2F", active: activeFloor === "2F", floor: "2F" },
  ];

  const bottomNavItems: Array<{ label: string; route?: string }> = [
    { label: "环境", route: "/screen" },
    { label: "排风", route: "/paifeng" },
    { label: "通风", route: "/tongfeng" },
    { label: "气路" },
    { label: "废水" },
    { label: "能耗", route: "/nenghao" },
  ];

  const timeLabels: string[] = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ];

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Group"
        src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/group-1321314752.png"
      />

      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] flex gap-[664px]">
        <div className="w-[551px] h-[1080px]" />

        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Element"
          src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </div>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {bottomNavItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.route && navigate(item.route)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              index === 0 ? "text-white" : "text-[#ffffff94]"
            } ${item.route ? "cursor-pointer hover:text-white transition-colors" : ""}`}
            aria-current={index === 0 ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="inline-flex items-center gap-4 absolute top-9 left-[63px]">
        <img
          className="relative w-[43px] h-8"
          alt="Header cloud"
          src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/header-cloud.png"
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

      <div className="flex w-[243px] items-center absolute top-[39px] left-[1601px]">
        <time className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          2025年11月30日 周一
        </time>

        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          21:00:03
        </time>
      </div>

      <img
        className="absolute top-[287px] left-[1380px] w-[61px] h-3"
        alt="Rectangle"
        src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/rectangle-1357.svg"
      />

      <nav
        className="flex flex-col w-[57px] items-start gap-[26px] absolute top-[86px] left-[1817px]"
        role="navigation"
        aria-label="Floor navigation"
      >
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item.route) navigate(item.route);
              if (item.floor) setActiveFloor(item.floor);
            }}
            className={`relative w-[59px] h-[54px] mr-[-2.00px] ${item.route || item.floor ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            <img
              className="absolute top-0 left-0 w-[57px] h-[54px]"
              alt=""
              src={item.icon}
            />

            <div
              className={`absolute left-[3px] w-[52px] text-sm text-center tracking-[0] [font-family:'Poppins',Helvetica] font-medium leading-[normal] ${
                item.active
                  ? "text-white top-[19px]"
                  : "text-[#ffffffcc] top-[17px]"
              } ${index >= 3 ? "[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal leading-[16.9px] whitespace-nowrap top-[18px]" : ""}`}
            >
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <img
        className="absolute top-[164px] left-[538px] w-[967px] h-[851px]"
        alt="R c"
        src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/r-c-1.png"
      />

      <section
        className="absolute w-[25.99%] h-[35.28%] top-[11.02%] left-0"
        aria-labelledby="environment-monitoring-title"
      >
        <div className="absolute w-[99.20%] h-[98.43%] top-[9.97%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.44)_100%)]" />

        <img
          className="absolute w-[99.41%] h-[8.89%] top-0 left-0"
          alt=""
          src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/1-3-1.png"
        />

        <h2
          id="environment-monitoring-title"
          className="absolute w-[29.23%] h-[6.71%] top-[2.11%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
        >
          环境监测
        </h2>
        {loading && !error && (
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[#95e2ff] text-sm">
            加载中...
          </div>
        )}
        {error && (
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex w-[461px] h-[89px] items-start gap-[51px] pt-2.5 pb-0 px-2.5 absolute top-[calc(50.00%_-_140px)] left-[calc(50.00%_-_230px)]">
          {environmentMetrics.map((metric, index) => (
            <div
              key={index}
              className="inline-flex flex-col items-center justify-center gap-2 relative flex-[0_0_auto]"
            >
              <img className="relative w-4 h-4" alt="" src={metric.icon} />

              <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-base font-normal text-white tracking-[0] leading-[normal]">
                {metric.value}
              </div>

              <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-[10px] text-center tracking-[0] leading-[normal]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-[153px] left-[19px] w-[470px] h-[249px] flex bg-[url(https://c.animaapp.com/mlfd2as9F7Vwy4/img/union.svg)] bg-[100%_100%]">
          <div className="mt-[17.8px] w-[460px] h-[219.78px] relative">
            <div className="absolute top-[35px] left-0 w-[458px] h-[185px]">
              <img
                className="absolute top-9 left-[38px] w-[420px] h-[121px]"
                alt=""
                src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---57.png"
              />

              <img
                className="absolute top-[25px] left-[261px] w-px h-px"
                alt=""
              />

              {timeLabels.map((label, index) => (
                <div
                  key={index}
                  className="absolute top-[calc(50.00%_+_74px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]"
                  style={{
                    left: `calc(50.00% + ${-183 + index * 33}px)`,
                  }}
                >
                  {label}
                </div>
              ))}

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[12.81%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[27.03%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[41.26%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[55.48%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[69.70%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[19.92%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[34.15%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[48.37%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[62.59%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[76.82%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[91.04%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[83.93%] bg-white opacity-50" />

              <div className="absolute w-[6.56%] top-[calc(50.00%_-_70px)] left-0 opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-6">
                50
                <br />
                40
                <br />
                30
                <br />
                20
                <br />
                10
                <br />0
              </div>

              <div className="absolute w-[78.81%] h-[83.88%] top-0 left-[13.29%]">
                <img
                  className="absolute top-[76px] left-0 w-[361px] h-20"
                  alt=""
                  src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---15.png"
                />

                <img
                  className="absolute w-0 h-[99.92%] top-0 left-[26.71%]"
                  alt=""
                  src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---3.svg"
                />

                <div className="absolute w-[2.31%] h-[5.16%] top-[64.18%] left-[26.02%] rounded-[4.17px/4px] border border-solid border-white shadow-[0px_0px_10px_1px_#ffffff] [background:radial-gradient(50%_50%_at_50%_65%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,rgba(0,139,255,1)_0%,rgba(0,139,255,1)_100%)]" />

                <div className="absolute w-[10.40%] top-[calc(50.00%_-_7px)] left-[26.71%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] text-xl text-center font-normal text-white tracking-[0] leading-[normal]">
                  {deviceRealtime?.temperature ?? floorTemperatureToday?.temperature_avg ?? "--"}
                </div>
              </div>
            </div>

            <h3 className="absolute top-0 left-5 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              今日温度(℃)
            </h3>

            <button className="absolute top-0 left-[413px] w-[45px] h-[23px] bg-[#18fefe3d] rounded overflow-hidden">
              <span className="absolute top-[3px] left-[5px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                今日
              </span>

              <img
                className="absolute w-[12.50%] h-[17.39%] top-[47.83%] left-[75.56%]"
                alt=""
                src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/vector.svg"
              />
            </button>
          </div>
        </div>
      </section>

      <section
        className="absolute w-[25.99%] h-[43.89%] top-[50.37%] left-0 overflow-hidden min-w-0"
        aria-labelledby="device-list-title"
      >
        <div className="absolute w-[99.20%] h-[91.14%] top-[8.86%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.44)_100%)]" />

        <img
          className="absolute w-[99.41%] h-[7.93%] top-0 left-0"
          alt=""
          src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/1-3-1-1.png"
        />

        <h2
          id="device-list-title"
          className="absolute w-[29.23%] h-[5.99%] top-0 left-[5.13%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
        >
          设备列表
        </h2>

        <div className="absolute top-[10%] left-[3.61%] right-[3.61%] bottom-[2%] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-[#18fefe]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
        {floorDevicesList.map((floor) => (
          <div
            key={floor.floor}
            className="flex flex-col gap-3 p-3 bg-[#ffffff14] rounded-xl border border-solid border-white"
          >
            <h3 className="shrink-0 flex items-center [font-family:'ABeeZee',Helvetica] font-normal text-white text-base tracking-[0] leading-4">
              {floor.floor}设备({floor.count}台)
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-1 min-w-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-[#18fefe]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
              {floor.devices.map((device) => (
                <article
                  key={device.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={device.selected}
                  onClick={() => setSelectedDeviceId(device.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedDeviceId(device.id)}
                  className={`relative flex-shrink-0 w-[140px] min-w-[140px] h-[73px] rounded-lg overflow-hidden border-[none] cursor-pointer hover:opacity-90 transition-opacity before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none ${
                    device.selected ? "bg-[#18fefe2e] before:[background:linear-gradient(163deg,rgba(24,254,254,1)_0%,rgba(0,255,255,0)_100%)] before:shadow-[0_0_8px_rgba(24,254,254,0.6)]" : "bg-[#18fefe1a] before:[background:linear-gradient(163deg,rgba(24,254,254,1)_0%,rgba(0,255,255,0)_100%)]"
                  }`}
                >
                  <img
                    className="absolute top-2.5 left-1.5 w-4 h-4"
                    alt=""
                    src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/frame-2.svg"
                  />

                  <h4 className="absolute top-3 left-[26px] right-8 h-3 flex items-center [font-family:'ABeeZee',Helvetica] font-normal text-white text-xs tracking-[0] leading-3 truncate" title={device.name}>
                    {device.name}
                  </h4>

                  <div className="absolute top-[45px] left-1.5 w-[68px] h-[18px] flex gap-1">
                    <div className="w-[33px] h-[18px] relative">
                      <div className="absolute top-0 left-0 w-[31px] h-[18px] bg-[#18fefe21] rounded border border-solid border-[#18fefe]" />

                      <span className="absolute top-1 left-[5px] h-2.5 flex items-center justify-center [font-family:'ABeeZee',Helvetica] font-normal text-[#18fefe] text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                        在线
                      </span>
                    </div>

                    <div className="w-[33px] h-[18px] relative">
                      <div className="absolute top-0 left-0 w-[31px] h-[18px] bg-[#ffffff21] rounded border border-solid border-[#ffffff3d]" />

                      <span className="absolute top-1 left-[5px] h-2.5 flex items-center justify-center [font-family:'ABeeZee',Helvetica] font-normal text-[#979797] text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                        停止
                      </span>
                    </div>
                  </div>

                  <button
                    className="absolute top-11 right-1.5 w-[19px] h-[19px] flex bg-[#00000021] rounded-sm border border-solid border-white"
                    aria-label="Select device"
                  >
                    <div className="mt-[5.9px] w-[6.67px] h-[6.21px] ml-[6.3px] flex rounded-[3.33px/3.1px] border border-solid border-white">
                      <div className="mt-[2.1px] w-[2.22px] h-[2.07px] ml-[2.2px] bg-[#18fefe] rounded-[1.11px/1.03px] border border-solid border-white" />
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        ))}
        </div>
      </section>

      <aside
        className="absolute top-[656px] left-[1327px] w-[531px] h-[164px]"
        aria-label="Device detail"
      >
        <img
          className="absolute top-[18px] left-0 w-12 h-12"
          alt=""
          src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/group-1321314894.png"
        />

        <div className="absolute top-0 left-7 w-[505px] h-[164px]">
          <img
            className="absolute top-0 left-[99px] w-[404px] h-[35px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---5.svg"
          />

          <img
            className="absolute top-0 left-[99px] w-[289px] h-[35px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---8.svg"
          />

          <img
            className="absolute top-0 left-[99px] w-44 h-[35px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---2.svg"
          />

          <img
            className="absolute top-0.5 left-[99px] w-[404px] h-[162px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---1.svg"
          />

          <img
            className="absolute w-[2.97%] h-[9.15%] top-[6.71%] left-[22.77%]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/group-1321314749.svg"
          />

          <h3 className="absolute w-[38.02%] h-[11.59%] top-[4.88%] left-[27.33%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
            {deviceRealtime && selectedDeviceId
              ? `${deviceIdToFloor[selectedDeviceId] ?? activeFloor} ${deviceRealtime.interface_name}`
              : "请选择设备"}
          </h3>

          <img
            className="absolute top-[154px] left-[104px] w-[113px] h-2.5"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---4.svg"
          />

          <img
            className="absolute top-[154px] left-[386px] w-[113px] h-2.5"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---7.svg"
          />

          <img
            className="absolute top-[35px] left-[493px] w-2.5 h-[113px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/---6.svg"
          />

          <img
            className="absolute top-[35px] left-[99px] w-2.5 h-[113px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/--.svg"
          />

          <img
            className="absolute top-[45px] left-0 w-[98px] h-[76px]"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/group-1321314916.png"
          />

          <div className="flex w-[76.04%] h-[62.80%] items-start gap-9 pt-2.5 pb-0 px-2.5 absolute top-[31.71%] left-[21.58%]">
            {detailMetrics.map((metric, index) => (
              <div
                key={index}
                className={`inline-flex flex-col items-center justify-center gap-1 relative flex-[0_0_auto] ${index === 4 ? "mr-[-10.00px]" : ""}`}
              >
                <img className="relative w-4 h-4" alt="" src={metric.icon} />

                <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-base font-normal text-white tracking-[0] leading-[normal]">
                  {metric.value}
                </div>

                <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-[10px] text-center tracking-[0] leading-[normal]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
