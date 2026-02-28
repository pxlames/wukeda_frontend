import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceType } from "../../types/device.types";
import { deviceService } from "../../services/api.service";
import { useHistoryData } from "../../hooks/useHistoryData";
import { DEVICE_TYPE_CN_NAMES } from "../../utils/deviceNameMapper";
import { DEVICE_HISTORY_PARAMETERS } from "../../config/historyParams.config";
import type { TimeSeriesPoint } from "../../types/history.types";

const DEVICE_TYPE_ORDER: DeviceType[] = [
  DeviceType.FrequencyConverter,
  DeviceType.WaterImmersion,
  DeviceType.Environment,
  DeviceType.WaterMeter,
  DeviceType.ElectricMeter,
  DeviceType.FumeHood,
];

const DEVICE_TYPE_ICONS: Record<DeviceType, string> = {
  [DeviceType.FrequencyConverter]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-3.png",
  [DeviceType.WaterImmersion]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-4.png",
  [DeviceType.Environment]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-5.png",
  [DeviceType.WaterMeter]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
  [DeviceType.ElectricMeter]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-7.png",
  [DeviceType.FumeHood]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
  [DeviceType.GasPathHost]: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
};

function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

export const HistoricalDataFullscreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: historyData, loading, fetchHistoryData } = useHistoryData();
  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | "">("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<{
    deviceType: DeviceType;
    deviceId: string;
    deviceName: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setEndTime(formatDateTimeLocal(now));
    setStartTime(formatDateTimeLocal(yesterday));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await deviceService.getAllDevices();
        setAllDevices(list);
        if (!selectedDeviceType && list.length > 0) {
          const firstType = DEVICE_TYPE_ORDER.find((t) => list.some((d: any) => d.deviceType === t));
          if (firstType) setSelectedDeviceType(firstType);
        }
      } catch (e) {
        console.error("加载设备列表失败:", e);
      }
    };
    load();
  }, []);

  const deviceCategories = useMemo(() => {
    return DEVICE_TYPE_ORDER.map((type) => ({
      type,
      name: DEVICE_TYPE_CN_NAMES[type],
      count: allDevices.filter((d: any) => d.deviceType === type).length,
      icon: DEVICE_TYPE_ICONS[type],
      highlighted: selectedDeviceType === type,
    }));
  }, [allDevices, selectedDeviceType]);

  const filteredDevices = useMemo(() => {
    if (!selectedDeviceType) return [];
    return allDevices.filter((d: any) => d.deviceType === selectedDeviceType);
  }, [allDevices, selectedDeviceType]);

  // 设备编号默认选中第一个
  useEffect(() => {
    if (filteredDevices.length === 0) {
      setSelectedDeviceId("");
      return;
    }
    if (!selectedDeviceId || !filteredDevices.some((d: any) => d.deviceId === selectedDeviceId)) {
      setSelectedDeviceId(filteredDevices[0].deviceId);
    }
  }, [filteredDevices, selectedDeviceId]);

  const parameterOptions = useMemo(() => {
    if (!selectedDeviceType) return [];
    return DEVICE_HISTORY_PARAMETERS[selectedDeviceType] || [];
  }, [selectedDeviceType]);

  // 默认全选参数
  useEffect(() => {
    setSelectedParameters(parameterOptions.map((param) => param.id));
  }, [parameterOptions]);

  const deviceInfoDisplay = useMemo(() => {
    if (!queryParams) return null;
    const name = queryParams.deviceName || DEVICE_TYPE_CN_NAMES[queryParams.deviceType];
    const floorMatch = (name || "").match(/[2-5]F|RF|B\d/i);
    if (floorMatch) return `${floorMatch[0]}房间${DEVICE_TYPE_CN_NAMES[queryParams.deviceType]}`;
    return name;
  }, [queryParams]);

  const handleDeviceTypeChange = (type: string) => {
    const v = type as DeviceType | "";
    setSelectedDeviceType(v);
    setSelectedDeviceId("");
    setSelectedParameters([]);
  };

  const handleParameterToggle = (parameterId: string) => {
    setSelectedParameters((prev) =>
      prev.includes(parameterId) ? prev.filter((id) => id !== parameterId) : [...prev, parameterId]
    );
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleQuery = async () => {
    if (!selectedDeviceType || !selectedDeviceId) {
      alert("请选择设备类型和设备编号");
      return;
    }
    if (!startTime || !endTime) {
      alert("请选择开始时间和结束时间");
      return;
    }
    if (selectedParameters.length === 0) {
      alert("请至少选择一个数据参数");
      return;
    }
    const startTs = new Date(startTime).getTime();
    const endTs = new Date(endTime).getTime();
    const timeLength = endTs - startTs;
    if (timeLength <= 0) {
      alert("结束时间必须大于开始时间");
      return;
    }
    const device = filteredDevices.find((d: any) => d.deviceId === selectedDeviceId);
    const deviceName = device?.interfaceName || device?.deviceName || "";
    setQueryParams({ deviceType: selectedDeviceType, deviceId: selectedDeviceId, deviceName });
    await fetchHistoryData(
      selectedDeviceType,
      selectedDeviceId,
      timeLength,
      100,
      deviceName
    );
  };

  const CHART_COLORS = ["#4682B4", "#5D9CEC", "#32CD32", "#FFD700", "#ff6b6b", "#9b59b6"];

  const getParamLabel = useCallback((paramId: string) => {
    if (!queryParams) return paramId;
    const opts = DEVICE_HISTORY_PARAMETERS[queryParams.deviceType] || [];
    return opts.find((p) => p.id === paramId)?.label ?? paramId;
  }, [queryParams]);

  const statisticsData = useMemo(() => {
    if (!historyData?.statistics || !queryParams) {
      return [
        { title: "运行状态", average: "-", min: "-", max: "-" },
        { title: "运行转速", average: "-", min: "-", max: "-" },
        { title: "运行频率", average: "-", min: "-", max: "-" },
        { title: "管道压力", average: "-", min: "-", max: "-" },
        { title: "压力设定值", average: "-", min: "-", max: "-" },
      ];
    }
    const stats = historyData.statistics;
    const paramIds = Object.keys(stats);
    return paramIds.map((paramId) => {
      const s = stats[paramId];
      const title = getParamLabel(paramId);
      return {
        title,
        average: typeof s.avg === "number" ? String(s.avg) : "-",
        min: typeof s.min === "number" ? String(s.min) : "-",
        max: typeof s.max === "number" ? String(s.max) : "-",
      };
    });
  }, [historyData?.statistics, queryParams, getParamLabel]);

  const tableData = useMemo(() => {
    if (!historyData?.timeseries || Object.keys(historyData.timeseries).length === 0) {
      return [];
    }
    const tsMap: Record<number, Record<string, string | number>> = {};
    const allTs = new Set<number>();
    Object.entries(historyData.timeseries).forEach(([paramId, points]) => {
      (points as TimeSeriesPoint[]).forEach((p) => {
        allTs.add(p.ts);
        if (!tsMap[p.ts]) tsMap[p.ts] = {};
        tsMap[p.ts][paramId] = p.value;
      });
    });
    const sortedTs = Array.from(allTs).sort((a, b) => a - b);
    const paramIds = Object.keys(historyData.timeseries);
    return sortedTs.map((ts) => {
      const row: Record<string, string> = {
        time: new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      };
      paramIds.forEach((id) => {
        const v = tsMap[ts]?.[id];
        row[id] = v !== undefined ? String(v) : "-";
      });
      return row;
    });
  }, [historyData?.timeseries]);

  const chartSeries = useMemo(() => {
    if (!historyData?.timeseries || !queryParams) return [];
    const paramIds = Object.keys(historyData.timeseries);
    const allPoints = paramIds.flatMap((id) => (historyData!.timeseries[id] as TimeSeriesPoint[]) || []);
    const minTs = allPoints.length ? Math.min(...allPoints.map((p) => p.ts)) : 0;
    const maxTs = allPoints.length ? Math.max(...allPoints.map((p) => p.ts)) : 1;
    const w = 560;
    const h = 200;
    return paramIds.map((paramId, i) => {
      const points = (historyData!.timeseries[paramId] as TimeSeriesPoint[]) || [];
      const numValues = points.map((p) => Number(p.value)).filter((n) => !Number.isNaN(n));
      const minV = numValues.length ? Math.min(...numValues) : 0;
      const maxV = numValues.length ? Math.max(...numValues) : 1;
      const rangeV = maxV - minV || 1;
      const pts = points
        .map((p) => {
          const x = ((p.ts - minTs) / (maxTs - minTs || 1)) * w;
          const v = Number(p.value);
          const y = Number.isNaN(v) ? h / 2 : h - ((v - minV) / rangeV) * h;
          return `${x},${y}`;
        })
        .join(" ");
      return {
        paramId,
        label: getParamLabel(paramId),
        color: CHART_COLORS[i % CHART_COLORS.length],
        points: pts,
      };
    });
  }, [historyData?.timeseries, queryParams, getParamLabel]);

  const timeLabels = useMemo(() => {
    if (!historyData?.timeseries) return ["14:11", "14:12", "14:13", "14:14", "14:15", "14:16", "14:17", "14:18"];
    const allTs = Object.values(historyData.timeseries).flat().map((p: TimeSeriesPoint) => p.ts);
    const uniq = [...new Set(allTs)].sort((a, b) => a - b);
    if (uniq.length === 0) return [];
    const step = Math.max(1, Math.floor(uniq.length / 8));
    return uniq.filter((_, i) => i % step === 0 || i === uniq.length - 1).map((ts) => new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }));
  }, [historyData?.timeseries]);

  const alertData = useMemo(() => {
    if (historyData?.alarms?.length) {
      return historyData.alarms.map((a) => ({ type: a.category || "告警", message: a.content }));
    }
    return [
      { type: "压力", message: "管道压力波动异常" },
      { type: "频率", message: "运行频率低于设定值" },
    ];
  }, [historyData?.alarms]);

  return (
    <div className="bg-[#0d2838] overflow-hidden w-full min-w-[1920px] h-[1080px] relative flex flex-col">
      {/* 关闭按钮：绝对定位，稍向下避免贴顶 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-8 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#18fefe20] hover:bg-[#18fefe40] transition-colors cursor-pointer"
        aria-label="关闭"
      >
        <img src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-2.svg" alt="关闭" className="w-6 h-6" />
      </button>

      {/* Main Content - 顶栏已去掉，内容从顶部开始 */}
      <div className="flex-1 flex gap-6 px-6 py-2 overflow-hidden">
        {/* Left Panel - Query Conditions */}
        <aside className="w-[520px] flex flex-col gap-6 flex-shrink-0">
          {/* Query Form */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 flex-shrink-0 shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg">
                查询条件
              </h2>
              <button
                type="button"
                onClick={handleReload}
                className="flex items-center gap-2 text-[#18fefe] text-sm hover:opacity-80"
              >
                <img src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame.svg" alt="" className="w-4 h-4" />
                重新加载
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleQuery(); }}>
              <div>
                <label className="block text-white text-sm mb-2">设备类型</label>
                <select
                  value={selectedDeviceType}
                  onChange={(e) => handleDeviceTypeChange(e.target.value)}
                  className="w-full h-10 px-4 bg-[#0a2f47cc] border border-[#18fefe40] rounded text-white text-sm"
                >
                  <option value="">请选择设备类型</option>
                  {deviceCategories.map((cat) => (
                    <option key={cat.type} value={cat.type}>
                      {cat.name} ({cat.count}台设备)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">设备编号</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  disabled={!selectedDeviceType || filteredDevices.length === 0}
                  className="w-full h-10 px-4 bg-[#0a2f47cc] border border-[#18fefe40] rounded text-white text-sm disabled:opacity-60"
                >
                  <option value="">请选择设备</option>
                  {filteredDevices.map((d: any) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.interfaceName || d.deviceName || d.deviceId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">开始时间</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-10 px-4 bg-[#0a2f47cc] border border-[#18fefe40] rounded text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">结束时间</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-10 px-4 bg-[#0a2f47cc] border border-[#18fefe40] rounded text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-3">数据参数（可多选）</label>
                <div className="grid grid-cols-2 gap-3">
                  {parameterOptions.length === 0 && (
                    <div className="col-span-2 text-[#ffffff99] text-sm">请先选择设备类型</div>
                  )}
                  {parameterOptions.map((param) => (
                    <label key={param.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedParameters.includes(param.id)}
                        onChange={() => handleParameterToggle(param.id)}
                        className="w-5 h-5 rounded border-[#18fefe] bg-transparent checked:bg-[#07a872]"
                      />
                      <span className="text-white text-sm">{param.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#0a2f47] hover:bg-[#0a2f4780] border border-[#18fefe] rounded text-[#18fefe] text-sm font-medium transition-colors mt-4 disabled:opacity-60"
              >
                {loading ? "查询中…" : "查询数据"}
              </button>
            </form>
          </section>

          {/* Device Categories */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 flex-1 overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg mb-4 flex-shrink-0">
              查询数据
            </h2>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
              {deviceCategories.map((device) => (
                <button
                  key={device.type}
                  type="button"
                  onClick={() => handleDeviceTypeChange(device.type)}
                  className={`h-20 rounded-lg p-3 flex items-center gap-3 transition-colors flex-shrink-0 border ${
                    device.highlighted
                      ? "bg-[#0f3a52] border-[#18fefe]"
                      : "bg-[#0a2f47cc] border-[#18fefe50] hover:bg-[#0f3a52] hover:border-[#18fefe70]"
                  }`}
                >
                  <img src={device.icon} alt="" className="w-12 h-12 object-contain" />
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm">{device.name}</span>
                    <span className="text-[#CCCCCC] text-xs">{device.count}台设备</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Center Panel - Chart and Statistics */}
        <main className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Data Trend Chart：限制高度但保证图表区域有最小可视空间 */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 min-h-[540px] max-h-[780px] flex flex-col overflow-hidden shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg">
                数据趋势图
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <img src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-6.svg" alt="" className="w-4 h-4" />
                <span className="text-[#18fefe]">{deviceInfoDisplay || "请选择设备并查询"}</span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs flex-shrink-0 flex-wrap">
              {chartSeries.length > 0
                ? chartSeries.map((s) => (
                    <div key={s.paramId} className="flex items-center gap-2">
                      <div className="w-3 h-3" style={{ backgroundColor: s.color }} />
                      <span className="text-[#ffffffcc]">{s.label}</span>
                    </div>
                  ))
                : (
                    <span className="text-[#ffffff99]">请选择设备并查询后显示曲线</span>
                  )}
            </div>

            {/* Chart Area：min-h-0 让 flex-1 在有限高度内正确分配空间 */}
            <div className="flex-1 min-h-[360px] bg-[#0a2f4750] rounded border border-[#18fefe40] p-4 relative overflow-hidden">
              {/* Y-axis labels */}
              <div className="absolute left-2 top-4 bottom-12 flex flex-col justify-between text-[#ffffffcc] text-xs">
                {["200", "150", "100", "50", "0"].map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>

              {/* Chart content area */}
              <div className="ml-10 h-[calc(100%-40px)] relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="w-full h-px bg-[#ffffff1a]" />
                    ))}
                </div>

                {/* Line chart SVG - 随查询结果动态渲染 */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 560 200">
                  {chartSeries.map((s) =>
                    s.points ? (
                      <polyline
                        key={s.paramId}
                        points={s.points}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null
                  )}
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-10 right-4 flex justify-between text-[#ffffffcc] text-xs">
                {timeLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Data Statistics */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 flex-1 flex flex-col min-h-0 overflow-hidden shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg mb-4 flex-shrink-0">
              数据统计
            </h2>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {statisticsData.map((stat, i) => (
                  <div key={i} className="bg-[#0a2f4760] border border-[#18fefe50] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#FFD700]" aria-hidden />
                      <span className="text-[#18fefe] text-xs">{stat.title}</span>
                    </div>
                    <div className="space-y-1 text-xs text-white">
                      <div className="flex gap-4">
                        <span>平均值：{stat.average}</span>
                        <span>最小值：{stat.min}</span>
                      </div>
                      <div>最大值：{stat.max}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Right Panel - Alerts and Details */}
        <aside className="w-[420px] flex flex-col gap-6 flex-shrink-0 overflow-hidden">
          {/* Historical Alerts */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 flex-1 flex flex-col min-h-0 overflow-hidden shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg mb-4 flex-shrink-0">
              历史告警信息
            </h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
              {alertData.map((alert, i) => (
                <div key={i} className="flex flex-col gap-1.5 flex-shrink-0">
                  <span
                    className={`text-xs font-medium ${
                      alert.type === "错误告警" || alert.type === "压力"
                        ? "text-[#FF8C00]"
                        : "text-[#FFD700]"
                    }`}
                  >
                    {alert.type}
                  </span>
                  <div className="bg-[#0a2f47aa] border border-[#18fefe40] rounded-lg px-3 py-2.5">
                    <p className="text-white/95 text-sm leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Information */}
          <section className="bg-[#0f3a52] border border-[#18fefe70] rounded-lg p-6 flex-1 flex flex-col min-h-0 overflow-hidden shadow-[inset_0_0_0_1px_rgba(24,254,254,0.15)]">
            <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#18fefe] text-lg mb-4 flex-shrink-0">
              详细信息
            </h2>
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="text-xs min-w-max w-full border-collapse">
                <thead className="bg-[#0b232d66] sticky top-0">
                  <tr className="text-[#18fefe]">
                    {tableData.length > 0
                      ? Object.keys(tableData[0]).map((key) => (
                          <th key={key} className="py-2 px-2 text-center whitespace-nowrap">
                            {key === "time" ? "时间" : getParamLabel(key)}
                          </th>
                        ))
                      : (
                          <>
                            <th className="py-2 px-2 text-center">时间</th>
                            <th className="py-2 px-2 text-center">参数</th>
                          </>
                        )}
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0
                    ? tableData.map((row, i) => (
                        <tr key={i} className="text-white text-center border-b border-[#18fefe20]">
                          {Object.keys(row).map((key) => (
                            <td key={key} className="py-2 px-2 whitespace-nowrap">{row[key]}</td>
                          ))}
                        </tr>
                      ))
                    : (
                        <tr className="text-white/60 text-center">
                          <td colSpan={2} className="py-4">请先查询设备历史数据</td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
