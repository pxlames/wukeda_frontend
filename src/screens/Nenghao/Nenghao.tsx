import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import {
  getEnergySummary,
  getEnergyTrend,
  energyService,
} from "../../services/api.service";
import type { EnergyTrendSample } from "../../services/api.service";
import {
  USE_ENERGY_MOCK_WHEN_EMPTY,
  getMockEnergySummary,
  getMockEnergyTrend,
  getMockFloorSummary,
  getMockFloorRooms,
} from "../../services/energyMockData";

interface EnergyData {
  value: number;
  label: string;
  icon: string;
}

interface FloorData {
  floor: string;
  water: number;
  electricity: number;
}

interface RoomData {
  room: string;
  water: number;
  electricity: number;
}

interface NavigationItem {
  label: string;
  icon: string;
  active?: boolean;
  floor?: string;
  route?: string;
}

/** 展示名 -> API 楼层码 */
const DISPLAY_TO_API: Record<string, string> = {
  楼顶: "RF",
  "5F": "5F",
  "4F": "4F",
  "3F": "3F",
  "2F": "2F",
};

/** API 楼层码 -> 展示名 */
const API_TO_DISPLAY: Record<string, string> = {
  RF: "顶楼",
  "5F": "5F",
  "4F": "4F",
  "3F": "3F",
  "2F": "2F",
  "1F": "1F",
};

const ENERGY_ICONS = {
  water: "https://c.animaapp.com/mlfdklkod9pi8e/img/---41.png",
  electricity: "https://c.animaapp.com/mlfdklkod9pi8e/img/group-1321314913.png",
};

const NAV_ICONS = {
  home: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1.png",
  overall: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-2-1.png",
  rf: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1-1.png",
  f5: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1-2.png",
  f4: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1-3.png",
  f3: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1-4.png",
  f2: "https://c.animaapp.com/mlfdklkod9pi8e/img/5-1-1-5.png",
};

export const Screen = (): JSX.Element => {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const barChartInstance = useRef<echarts.ECharts | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string>("总体");
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [highlightedFloorRow, setHighlightedFloorRow] = useState<string | null>(null);

  const [energyData, setEnergyData] = useState<EnergyData[]>([
    { value: 0, label: "水能消耗（LM）", icon: ENERGY_ICONS.water },
    { value: 0, label: "电能消耗（KW）", icon: ENERGY_ICONS.electricity },
  ]);
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [trendSamples, setTrendSamples] = useState<EnergyTrendSample[]>([]);

  const apiFloor = selectedFloor === "总体" ? null : DISPLAY_TO_API[selectedFloor] ?? selectedFloor;

  useEffect(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const startTs = todayStart.getTime();
    const endTs = Date.now();
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSelectedRoom(null);
      setHighlightedFloorRow(null);
      const errors: string[] = [];

      const safeFetch = <T,>(p: Promise<T>): Promise<T | null> =>
        p.catch((e) => {
          if (!cancelled) errors.push(e?.message || "请求失败");
          return null;
        });

      try {
        if (selectedFloor === "总体") {
          const [summaryRes, trendRes] = await Promise.all([
            safeFetch(getEnergySummary({ startTs, endTs })),
            safeFetch(getEnergyTrend("building", { startTs, endTs, interval: "2h" })),
          ]);

          if (cancelled) return;
          let summary = summaryRes ?? {};
          let trend = trendRes ?? {};
          if (USE_ENERGY_MOCK_WHEN_EMPTY) {
            const total = summary.total ?? (summary as any).data?.total ?? {};
            const water = total.water_consumption ?? total.waterConsumption ?? 0;
            const electricity =
              total.electricity_consumption ?? total.electricityConsumption ?? 0;
            const rawFloors = summary.floors ?? (summary as any).data?.floors ?? [];
            const samples = trend.samples ?? (trend as any).data?.samples ?? [];
            const isEmpty =
              (Number(water) === 0 && Number(electricity) === 0) ||
              (Array.isArray(rawFloors) && rawFloors.length === 0) ||
              (Array.isArray(samples) && samples.length === 0);
            if (isEmpty) {
              summary = getMockEnergySummary(startTs);
              trend = getMockEnergyTrend("building", startTs, endTs);
            }
          }
          const total = summary.total ?? (summary as any).data?.total ?? {};
          const water = total.water_consumption ?? total.waterConsumption ?? 0;
          const electricity =
            total.electricity_consumption ?? total.electricityConsumption ?? 0;
          setEnergyData([
            {
              value: Math.round(Number(water)),
              label: "水能消耗（LM）",
              icon: ENERGY_ICONS.water,
            },
            {
              value: Math.round(Number(electricity)),
              label: "电能消耗（KW）",
              icon: ENERGY_ICONS.electricity,
            },
          ]);

          const rawFloors = summary.floors ?? (summary as any).data?.floors ?? [];
          const floors = Array.isArray(rawFloors) ? rawFloors : [];
          if (floors.length === 0) {
            const mockSummary = getMockEnergySummary(startTs);
            const mockFloors = mockSummary.floors ?? [];
            setFloorData(
              mockFloors.length > 0
                ? mockFloors.map((f: any) => ({
                    floor: API_TO_DISPLAY[f.floor] ?? f.floor ?? "—",
                    water: Math.round(Number(f.water_consumption ?? f.waterConsumption ?? 0)),
                    electricity: Math.round(
                      Number(f.electricity_consumption ?? f.electricityConsumption ?? 0)
                    ),
                  }))
                : [
                    { floor: "顶楼", water: 68, electricity: 132 },
                    { floor: "5F", water: 124, electricity: 298 },
                    { floor: "4F", water: 96, electricity: 187 },
                    { floor: "3F", water: 82, electricity: 156 },
                    { floor: "2F", water: 58, electricity: 142 },
                    { floor: "1F", water: 74, electricity: 221 },
                  ]
            );
          } else {
            setFloorData(
              floors.map((f: any) => ({
                floor: API_TO_DISPLAY[f.floor] ?? f.floor ?? "—",
                water: Math.round(Number(f.water_consumption ?? f.waterConsumption ?? 0)),
                electricity: Math.round(
                  Number(f.electricity_consumption ?? f.electricityConsumption ?? 0)
                ),
              }))
            );
          }
          const samples = trend.samples ?? (trend as any).data?.samples ?? [];
          setTrendSamples(
            samples.length > 0 ? samples : getMockEnergyTrend("building", startTs, endTs).samples ?? []
          );
          setRoomData([]);
        } else if (apiFloor) {
          const [summaryRes, trendRes, roomsRes] = await Promise.all([
            safeFetch(energyService.getFloorSummary(apiFloor, { startTs, endTs })),
            safeFetch(
              getEnergyTrend("floor", {
                floor: apiFloor,
                startTs,
                endTs,
                interval: "2h",
              })
            ),
            safeFetch(energyService.getFloorRooms(apiFloor, { startTs, endTs })),
          ]);

          if (cancelled) return;
          let s = summaryRes ?? {};
          let trend = trendRes ?? {};
          let rooms = roomsRes ?? {};
          if (USE_ENERGY_MOCK_WHEN_EMPTY) {
            const w = (s as any).water_consumption ?? (s as any).waterConsumption ?? 0;
            const e = (s as any).electricity_consumption ?? (s as any).electricityConsumption ?? 0;
            const list = rooms.list ?? (rooms as any).data?.list ?? [];
            const samples = trend.samples ?? (trend as any).data?.samples ?? [];
            if (
              (Number(w) === 0 && Number(e) === 0) ||
              (Array.isArray(list) && list.length === 0) ||
              (Array.isArray(samples) && samples.length === 0)
            ) {
              s = getMockFloorSummary(apiFloor);
              trend = getMockEnergyTrend("floor", startTs, endTs, apiFloor);
              rooms = getMockFloorRooms(apiFloor);
            }
          }
          const water = (s as any).water_consumption ?? (s as any).waterConsumption ?? 0;
          const electricity =
            (s as any).electricity_consumption ?? (s as any).electricityConsumption ?? 0;
          setEnergyData([
            {
              value: Math.round(Number(water)),
              label: "水能消耗（LM）",
              icon: ENERGY_ICONS.water,
            },
            {
              value: Math.round(Number(electricity)),
              label: "电能消耗（KW）",
              icon: ENERGY_ICONS.electricity,
            },
          ]);
          setFloorData([]);
          const trendSamp = trend.samples ?? (trend as any).data?.samples ?? [];
          setTrendSamples(
            trendSamp.length > 0
              ? trendSamp
              : getMockEnergyTrend("floor", startTs, endTs, apiFloor).samples ?? []
          );
          const list = rooms.list ?? (rooms as any).data?.list ?? [];
          setRoomData(
            (Array.isArray(list) ? list : []).map((r: any) => ({
              room: r.room ?? r.roomName ?? "房间",
              water: Math.round(Number(r.water_consumption ?? r.waterConsumption ?? 0)),
              electricity: Math.round(
                Number(r.electricity_consumption ?? r.electricityConsumption ?? 0)
              ),
            }))
          );
        }
        if (errors.length > 0) {
          setError(errors.join("；"));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "加载能耗数据失败");
          setEnergyData([
            { value: 0, label: "水能消耗（LM）", icon: ENERGY_ICONS.water },
            { value: 0, label: "电能消耗（KW）", icon: ENERGY_ICONS.electricity },
          ]);
          setFloorData([]);
          setRoomData([]);
          setTrendSamples([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [selectedFloor, apiFloor]);

  const navigationItems: NavigationItem[] = [
    { label: "首页", icon: NAV_ICONS.home, route: "/" },
    {
      label: "总体",
      icon: NAV_ICONS.overall,
      floor: "总体",
      active: selectedFloor === "总体",
    },
    {
      label: "楼顶",
      icon: NAV_ICONS.rf,
      floor: "楼顶",
      active: selectedFloor === "楼顶",
    },
    {
      label: "5F",
      icon: NAV_ICONS.f5,
      floor: "5F",
      active: selectedFloor === "5F",
    },
    {
      label: "4F",
      icon: NAV_ICONS.f4,
      floor: "4F",
      active: selectedFloor === "4F",
    },
    {
      label: "3F",
      icon: NAV_ICONS.f3,
      floor: "3F",
      active: selectedFloor === "3F",
    },
    {
      label: "2F",
      icon: NAV_ICONS.f2,
      floor: "2F",
      active: selectedFloor === "2F",
    },
  ];

  const bottomTabs: Array<{ label: string; route?: string }> = [
    { label: "环境", route: "/screen" },
    { label: "排风", route: "/paifeng" },
    { label: "通风", route: "/tongfeng" },
    { label: "气路" },
    { label: "废水" },
    { label: "能耗", route: "/nenghao" },
  ];

  const trendChartOption = useMemo(() => {
    if (!trendSamples.length)
      return { xData: [] as string[], waterData: [] as number[], elecData: [] as number[] };
    const xData = trendSamples.map((s) => {
      const d = new Date(s.ts);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    });
    const waterData = trendSamples.map(
      (s) => s.water_consumption ?? s.waterConsumption ?? 0
    );
    const elecData = trendSamples.map(
      (s) => s.electricity_consumption ?? s.electricityConsumption ?? 0
    );
    return { xData, waterData, elecData };
  }, [trendSamples]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    const chart = chartInstance.current;
    if (
      !trendChartOption.xData.length ||
      (trendChartOption.waterData.length === 0 &&
        trendChartOption.elecData.length === 0)
    ) {
      chart.setOption({
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      });
      return;
    }
    const maxVal = Math.max(
      100,
      ...trendChartOption.waterData,
      ...trendChartOption.elecData
    );
    const yMax = Math.ceil(maxVal / 20) * 20 || 100;

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,47,71,0.9)",
        borderColor: "#61afc2",
        textStyle: { color: "#fff", fontSize: 11 },
      },
      legend: {
        data: ["水", "电"],
        bottom: 0,
        textStyle: { color: "#c6d1db", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 8,
      },
      grid: {
        left: 36,
        right: 16,
        top: 8,
        bottom: 24,
      },
      xAxis: {
        type: "category",
        data: trendChartOption.xData,
        axisLine: { lineStyle: { color: "#ffffff40" } },
        axisLabel: { color: "#ffffffcc", fontSize: 10 },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        min: 0,
        max: yMax,
        interval: yMax / 5,
        splitLine: { lineStyle: { color: "#ffffff25", type: "dashed" } },
        axisLabel: { color: "#ffffffcc", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: "水",
          type: "line",
          data: trendChartOption.waterData,
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#18c1fe", width: 2 },
          itemStyle: { color: "#18c1fe" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(24,193,254,0.35)" },
              { offset: 1, color: "rgba(24,193,254,0.05)" },
            ]),
          },
        },
        {
          name: "电",
          type: "line",
          data: trendChartOption.elecData,
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { color: "#18fefe", width: 2 },
          itemStyle: { color: "#18fefe" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(24,254,254,0.35)" },
              { offset: 1, color: "rgba(24,254,254,0.05)" },
            ]),
          },
        },
      ],
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [trendChartOption, loading]);

  useEffect(() => {
    if (!barChartRef.current || selectedFloor === "总体") return;
    if (!barChartInstance.current) {
      barChartInstance.current = echarts.init(barChartRef.current);
    }
    const chart = barChartInstance.current;
    if (!roomData.length) {
      chart.setOption({
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      });
      return;
    }
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,47,71,0.9)",
        borderColor: "#61afc2",
        textStyle: { color: "#fff", fontSize: 11 },
      },
      legend: {
        data: ["水能", "电能"],
        top: 0,
        textStyle: { color: "#c6d1db", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 8,
      },
      grid: { left: 40, right: 20, top: 28, bottom: 28 },
      xAxis: {
        type: "category",
        data: roomData.map((r) => r.room),
        axisLabel: {
          color: "#ffffffcc",
          fontSize: 10,
          interval: 0,
          rotate: roomData.length > 5 ? 15 : 0,
        },
        axisLine: { lineStyle: { color: "#ffffff40" } },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#ffffff15", type: "dashed" } },
        axisLabel: { color: "#ffffffcc", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: "水能",
          type: "bar",
          data: roomData.map((r) => r.water),
          itemStyle: { color: "#18c1fe" },
          barMaxWidth: 24,
        },
        {
          name: "电能",
          type: "bar",
          data: roomData.map((r) => r.electricity),
          itemStyle: { color: "#18fefe" },
          barMaxWidth: 24,
        },
      ],
    });
    chart.off("click");
    chart.on("click", (params: any) => {
      const idx = params.dataIndex;
      if (roomData[idx])
        setSelectedRoom(roomData[idx]);
    });
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [roomData, selectedFloor]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
      barChartInstance.current?.dispose();
      barChartInstance.current = null;
    };
  }, []);

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Group"
        src="https://c.animaapp.com/mlfdklkod9pi8e/img/group-1321314752.png"
      />

      <img
        className="absolute top-[164px] left-[673px] w-[967px] h-[851px]"
        alt="3D Building"
        src="https://c.animaapp.com/mlfdklkod9pi8e/img/r-c-1.png"
      />

      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] flex gap-[664px]">
        <div className="w-[551px] h-[1080px]" />
        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Element"
          src="https://c.animaapp.com/mlfdklkod9pi8e/img/11-1-1.png"
        />
        <h1 className="top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] absolute font-normal whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </div>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {bottomTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => tab.route && navigate(tab.route)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              tab.label === "能耗" ? "text-white" : "text-[#ffffff94]"
            } ${tab.route ? "cursor-pointer hover:opacity-80" : ""}`}
            aria-current={tab.label === "能耗" ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="inline-flex items-center gap-4 absolute top-9 left-[63px]">
        <img
          className="relative w-[43px] h-8"
          alt="Header cloud"
          src="https://c.animaapp.com/mlfdklkod9pi8e/img/header-cloud.png"
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
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </time>
        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          {new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </time>
      </div>

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
              if (item.floor) setSelectedFloor(item.floor);
            }}
            className={`relative w-[59px] h-[54px] mr-[-2.00px] ${item.route || item.floor ? "cursor-pointer hover:opacity-80" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            <img
              className="absolute top-0 left-0 w-[57px] h-[54px]"
              alt=""
              src={item.icon}
            />
            <span
              className={`absolute top-[17px] left-[3px] w-[52px] [font-family:'Poppins',Helvetica] font-medium text-sm text-center tracking-[0] leading-[normal] ${
                item.active ? "text-white" : "text-[#ffffffcc]"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* 能耗总览 + 能耗曲线 */}
      <section
        className="absolute w-[25.99%] h-[50.65%] top-[11.02%] left-0"
        aria-labelledby="energy-overview-title"
      >
        <div className="absolute w-[99.20%] h-[93.60%] top-[6.40%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0.36)_100%)]" />

        <h2
          id="energy-curve-title"
          className="absolute w-[11.22%] h-[3.66%] top-[48.26%] left-[5.61%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap"
        >
          能耗曲线
        </h2>

        <header className="absolute w-[99.81%] h-[6.19%] top-0 left-0">
          <img
            className="absolute w-[99.60%] h-full top-0 left-0"
            alt=""
            src="https://c.animaapp.com/mlfdklkod9pi8e/img/1-3-1.png"
          />
          <h2
            id="energy-overview-title"
            className="absolute w-[29.29%] h-[75.47%] top-[12.64%] left-[4.94%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
          >
            能耗总览 {selectedFloor !== "总体" ? `- ${selectedFloor}` : ""}
          </h2>
        </header>

        {error && (
          <div className="absolute top-[20%] left-[5.61%] right-[5.61%] text-amber-400 text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="absolute top-[20%] left-[5.61%] text-[#95e2ff] text-sm">
            加载中...
          </div>
        )}
        <div className="flex w-[86.97%] items-center justify-between absolute top-[calc(50.00%_-_184px)] left-[5.61%]">
          {energyData.map((item, index) => (
            <article
              key={index}
              className="flex flex-col w-[139.74px] items-center justify-center gap-4 relative"
            >
              <div className="self-stretch w-full flex-[0_0_auto] flex flex-col items-center gap-1 relative">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Source_Han_Sans_SC-Bold',Helvetica] font-bold text-white text-2xl text-center tracking-[0] leading-10">
                  {item.value.toLocaleString()}
                </div>
                <img
                  className="relative w-[81.57px] h-[46.2px]"
                  alt=""
                  src={item.icon}
                />
                <div className="relative self-stretch [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-[normal]">
                  {item.label}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          ref={chartRef}
          className="absolute w-[91.78%] h-[39.12%] top-[55.94%] left-[5.21%]"
          style={{ minHeight: 120 }}
        />
      </section>

      {/* 能耗详情：总体=各楼层表，楼层=房间柱状图 */}
      <section
        className="absolute w-[25.99%] h-[30.83%] top-[63.52%] left-0 overflow-hidden"
        aria-labelledby="floor-monitoring-title"
      >
        <div className="absolute w-[99.20%] h-[91.29%] top-[7.81%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.44)_100%)]" />

        <header className="absolute w-[99.80%] h-[13.49%] top-0 left-0">
          <img
            className="absolute w-[99.60%] h-full top-0 left-0"
            alt=""
            src="https://c.animaapp.com/mlfdklkod9pi8e/img/1-3-1-1.png"
          />
          <h2
            id="floor-monitoring-title"
            className="absolute w-[29.29%] h-[62.34%] top-[10.44%] left-[4.94%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
          >
            {selectedFloor === "总体"
              ? "各楼层监测数据"
              : `${selectedFloor} 能耗详情`}
          </h2>
        </header>

        {selectedFloor === "总体" ? (
          <div className="absolute w-[94.99%] h-[77.30%] top-[19.08%] left-[2.61%] overflow-hidden">
            <table className="w-full border-collapse [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-white text-sm">
              <thead>
                <tr className="bg-[#22c1d936]">
                  <th className="py-2.5 px-3 text-left font-medium text-sm border-b border-[#ffffff20]">
                    楼层
                  </th>
                  <th className="py-2.5 px-3 text-left font-medium text-sm border-b border-[#ffffff20]">
                    用水量
                  </th>
                  <th className="py-2.5 px-3 text-left font-medium text-sm border-b border-[#ffffff20]">
                    用电量
                  </th>
                </tr>
              </thead>
              <tbody>
                {floorData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      setHighlightedFloorRow((prev) =>
                        prev === item.floor ? null : item.floor
                      )
                    }
                    className={`border-b border-[#ffffff12] cursor-pointer transition-colors ${
                      highlightedFloorRow === item.floor
                        ? "bg-[#18c1fe2e]"
                        : "hover:bg-[#ffffff0d]"
                    }`}
                  >
                    <td className="py-2 px-3 font-normal">{item.floor}</td>
                    <td className="py-2 px-3 font-normal">{item.water}</td>
                    <td className="py-2 px-3 font-normal">{item.electricity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {floorData.length === 0 && !loading && (
              <div className="text-[#ffffff99] text-sm py-6 text-center">
                暂无楼层数据
              </div>
            )}
          </div>
        ) : (
          <div
            ref={barChartRef}
            className="absolute w-[94.99%] h-[77.30%] top-[19.08%] left-[2.61%]"
            style={{ minHeight: 160 }}
          />
        )}
      </section>

      {/* 房间/设备能耗弹窗 */}
      {selectedRoom && selectedFloor !== "总体" && (
        <aside
          className="absolute top-[656px] left-[1327px] w-[531px] h-[164px] z-10"
          aria-label="Room energy detail"
        >
          <img
            className="absolute top-[18px] left-0 w-12 h-12"
            alt=""
            src="https://c.animaapp.com/mlfd2as9F7Vwy4/img/group-1321314894.png"
          />
          <div className="absolute top-0 left-7 w-[505px] h-[164px] bg-[#0a2f4780] rounded border border-[#5194a4] p-4">
            <h3 className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] mb-3">
              {selectedFloor} {selectedRoom.room}房间能耗
            </h3>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[#18c1fe] text-2xl font-bold">
                  {selectedRoom.water}
                </span>
                <span className="text-[#c6d1db] text-xs">今日用水(LM)</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#18fefe] text-2xl font-bold">
                  {selectedRoom.electricity}
                </span>
                <span className="text-[#c6d1db] text-xs">今日用电(KW)</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-2 right-2 w-6 h-6 text-[#ffffff99] hover:text-white text-lg leading-none"
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
