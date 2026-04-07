import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEVICE_HISTORY_PARAMETERS, type ParameterOption } from "../../config/historyParams.config";
import { useHistoryData } from "../../hooks/useHistoryData";
import type { TimeSeriesPoint } from "../../types/history.types";
import { type Device, DeviceType } from "../../types/device.types";
import { deviceService } from "../../services/api.service";
import { DEVICE_TYPE_CN_NAMES, getDeviceDisplayName } from "../../utils/deviceNameMapper";

const DEVICE_TYPE_ORDER: DeviceType[] = [
  DeviceType.FrequencyConverter,
  DeviceType.WaterImmersion,
  DeviceType.Environment,
  DeviceType.WaterMeter,
  DeviceType.ElectricMeter,
  DeviceType.FumeHood,
];

const DEVICE_CARD_META: Record<
  DeviceType,
  {
    icon: string;
    activeBg: string;
    inactiveBg: string;
    iconClassName: string;
  }
> = {
  [DeviceType.FrequencyConverter]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-3@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-[19px] left-[5px] w-[73px] h-10",
  },
  [DeviceType.WaterImmersion]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-4@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-[13px] left-[11px] w-[73px] h-[45px]",
  },
  [DeviceType.Environment]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-5@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-[13px] left-[5px] w-[73px] h-[45px]",
  },
  [DeviceType.WaterMeter]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-6-1@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-5 left-[11px] w-[74px] h-[38px]",
  },
  [DeviceType.ElectricMeter]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-7@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-[19px] left-[5px] w-[73px] h-9",
  },
  [DeviceType.FumeHood]: {
    icon: "https://c.animaapp.com/4u8Y8R7D/img/6-6-1@2x.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-5 left-[11px] w-[74px] h-[38px]",
  },
  [DeviceType.GasPathHost]: {
    icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
    activeBg: "https://c.animaapp.com/4u8Y8R7D/img/6-1@2x.png",
    inactiveBg: "https://c.animaapp.com/4u8Y8R7D/img/6-2-4@2x.png",
    iconClassName: "top-5 left-[11px] w-[74px] h-[38px]",
  },
};

const CHART_COLORS = ["#1f8fff", "#31b8ff", "#1bd78f", "#ffc447", "#ff7d65", "#9e8fff"];
const WEEK_DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const WEATHER_INFO = {
  weather: "晴转多云",
  temperature: "17-18℃",
  wind: "东南风",
};

const BOTTOM_NAV_ITEMS: Array<{ label: string; route: string | null }> = [
  { label: "环境", route: "/screen" },
  { label: "排风", route: "/paifeng" },
  { label: "通风", route: null },
  { label: "气路", route: null },
  { label: "废水", route: null },
  { label: "能耗", route: "/nenghao" },
];

interface QueryState {
  deviceType: DeviceType;
  deviceId: string;
  deviceName: string;
  timeLength: number;
  dataCount: number;
  parameters: string[];
}

interface DeviceCategory {
  type: DeviceType;
  name: string;
  count: number;
  highlighted: boolean;
  icon: string;
  activeBg: string;
  inactiveBg: string;
  iconClassName: string;
}

interface PanelHeaderProps {
  title: string;
  width: number;
  background: string;
}

interface PanelFrameProps {
  className: string;
  width: number;
  height: number;
  headerWidth: number;
  headerBackground: string;
  title: string;
  children: JSX.Element | JSX.Element[];
}

function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateLabel(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEK_DAYS[date.getDay()]}`;
}

function formatTimeLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatNumericValue(value: number): string {
  if (Math.abs(value) >= 100 || Number.isInteger(value)) {
    return value.toFixed(0);
  }
  if (Math.abs(value) >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(2).replace(/\.?0+$/, "");
}

function formatStatValue(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return formatNumericValue(value);
}

function getPanelCornerClass(position: "tl" | "tr" | "bl" | "br"): string {
  const classes: Record<typeof position, string> = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return classes[position];
}

function parseTimestamp(value: string | number): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return null;
    }
    return value < 1e12 ? value * 1000 : value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric)) {
    return numeric < 1e12 ? numeric * 1000 : numeric;
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatHistoryTime(value: string | number, withSeconds = false): string {
  const timestamp = parseTimestamp(value);
  if (timestamp === null) {
    return String(value);
  }

  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hour12: false,
  });
}

function computeSeriesStats(points: TimeSeriesPoint[]): { avg: number; min: number; max: number } | null {
  const values = points
    .map((point) => Number(point.value))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return {
    avg: sum / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function getSeriesBounds(timeseries: Record<string, TimeSeriesPoint[]>): {
  minValue: number;
  maxValue: number;
  labels: string[];
} {
  const values = Object.values(timeseries)
    .flat()
    .map((point) => Number(point.value))
    .filter((value) => !Number.isNaN(value));

  if (values.length === 0) {
    return {
      minValue: 0,
      maxValue: 100,
      labels: ["100", "75", "50", "25", "0"],
    };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const range = rawMax - rawMin || Math.max(Math.abs(rawMax), 1);
  const padding = range * 0.1;
  const minValue = rawMin >= 0 ? Math.max(0, rawMin - padding) : rawMin - padding;
  const maxValue = rawMax + padding;
  const step = (maxValue - minValue) / 4;

  return {
    minValue,
    maxValue,
    labels: Array.from({ length: 5 }, (_, index) =>
      formatNumericValue(maxValue - step * index)
    ),
  };
}

function buildPolylinePoints(
  points: TimeSeriesPoint[],
  minTs: number,
  maxTs: number,
  minValue: number,
  maxValue: number,
  width: number,
  height: number
): string {
  const timeRange = maxTs - minTs || 1;
  const valueRange = maxValue - minValue || 1;

  return points
    .map((point) => {
      const numericValue = Number(point.value);
      if (Number.isNaN(numericValue)) {
        return null;
      }

      const x = ((point.ts - minTs) / timeRange) * width;
      const y = height - ((numericValue - minValue) / valueRange) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .filter((value): value is string => Boolean(value))
    .join(" ");
}

function PanelHeader({ title, width, background }: PanelHeaderProps): JSX.Element {
  return (
    <div className="absolute top-0 left-0 h-[39px]" style={{ width }}>
      <img
        className="absolute top-0 left-0 h-[38px] object-fill"
        style={{ width }}
        alt=""
        src={background}
      />
      <div className="absolute top-px left-[42px] h-[37px] flex items-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[48px] whitespace-nowrap">
        {title}
      </div>
    </div>
  );
}

function PanelFrame({
  className,
  width,
  height,
  headerWidth,
  headerBackground,
  title,
  children,
}: PanelFrameProps): JSX.Element {
  return (
    <section className={`absolute ${className}`} style={{ width, height }}>
      <div className="absolute inset-0 bg-[#0000004a]" />
      <div className={`absolute w-[12px] h-[12px] border-white/80 ${getPanelCornerClass("tl")}`} />
      <div className={`absolute w-[12px] h-[12px] border-white/80 ${getPanelCornerClass("tr")}`} />
      <div className={`absolute w-[12px] h-[12px] border-white/80 ${getPanelCornerClass("bl")}`} />
      <div className={`absolute w-[12px] h-[12px] border-white/80 ${getPanelCornerClass("br")}`} />
      <PanelHeader title={title} width={headerWidth} background={headerBackground} />
      {children}
    </section>
  );
}

export const HistoricalDataFullscreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: historyData, loading, error, fetchHistoryData } = useHistoryData();

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | "">("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activeTab, setActiveTab] = useState<"query" | "export">("query");
  const [queryParams, setQueryParams] = useState<QueryState | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const current = new Date();
    const yesterday = new Date(current.getTime() - 24 * 60 * 60 * 1000);
    setEndTime(formatDateTimeLocal(current));
    setStartTime(formatDateTimeLocal(yesterday));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDevices = async () => {
      try {
        const devices = await deviceService.getAllDevices(undefined, {
          suppressAuthRedirect: true,
        });
        if (cancelled) return;
        setAllDevices(devices);

        if (!selectedDeviceType) {
          const firstType = DEVICE_TYPE_ORDER.find((type) =>
            devices.some((device) => device.deviceType === type)
          );
          if (firstType) {
            setSelectedDeviceType(firstType);
          }
        }
      } catch (loadError) {
        console.error("加载设备列表失败:", loadError);
      }
    };

    loadDevices();

    return () => {
      cancelled = true;
    };
  }, []);

  const deviceCategories = useMemo<DeviceCategory[]>(() => {
    return DEVICE_TYPE_ORDER.map((type) => ({
      type,
      name: DEVICE_TYPE_CN_NAMES[type],
      count: allDevices.filter((device) => device.deviceType === type).length,
      highlighted: selectedDeviceType === type,
      ...DEVICE_CARD_META[type],
    }));
  }, [allDevices, selectedDeviceType]);

  const filteredDevices = useMemo(() => {
    if (!selectedDeviceType) {
      return [];
    }

    return allDevices.filter((device) => device.deviceType === selectedDeviceType);
  }, [allDevices, selectedDeviceType]);

  useEffect(() => {
    if (filteredDevices.length === 0) {
      setSelectedDeviceId("");
      return;
    }

    if (!selectedDeviceId || !filteredDevices.some((device) => device.deviceId === selectedDeviceId)) {
      setSelectedDeviceId(filteredDevices[0].deviceId);
    }
  }, [filteredDevices, selectedDeviceId]);

  const parameterOptions = useMemo<ParameterOption[]>(() => {
    if (!selectedDeviceType) {
      return [];
    }

    return DEVICE_HISTORY_PARAMETERS[selectedDeviceType] || [];
  }, [selectedDeviceType]);

  useEffect(() => {
    setSelectedParameters(parameterOptions.map((parameter) => parameter.id));
  }, [parameterOptions]);

  const handleDeviceTypeChange = (type: string) => {
    const deviceType = type as DeviceType | "";
    setSelectedDeviceType(deviceType);
    setSelectedDeviceId("");
    setSelectedParameters([]);
  };

  const handleParameterToggle = (parameterId: string) => {
    setSelectedParameters((current) =>
      current.includes(parameterId)
        ? current.filter((id) => id !== parameterId)
        : [...current, parameterId]
    );
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

    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();
    const timeLength = endTimestamp - startTimestamp;

    if (timeLength <= 0) {
      alert("结束时间必须大于开始时间");
      return;
    }

    const selectedDevice = filteredDevices.find((device) => device.deviceId === selectedDeviceId);
    const rawDeviceName = selectedDevice?.interfaceName || selectedDevice?.deviceId || selectedDeviceId;
    const deviceName = getDeviceDisplayName(selectedDeviceType, rawDeviceName);

    setQueryParams({
      deviceType: selectedDeviceType,
      deviceId: selectedDeviceId,
      deviceName,
      timeLength,
      dataCount: 100,
      parameters: selectedParameters,
    });

    await fetchHistoryData(selectedDeviceType, selectedDeviceId, timeLength, 100, rawDeviceName);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getParameterLabel = useCallback(
    (parameterId: string, deviceType?: DeviceType) => {
      const currentType = deviceType || queryParams?.deviceType || selectedDeviceType || DeviceType.FrequencyConverter;
      const option = (DEVICE_HISTORY_PARAMETERS[currentType] || []).find(
        (parameter) => parameter.id === parameterId
      );
      return option?.unit ? `${option.label}(${option.unit})` : option?.label || parameterId;
    },
    [queryParams?.deviceType, selectedDeviceType]
  );

  const selectedTimeseries = useMemo<Record<string, TimeSeriesPoint[]>>(() => {
    if (!historyData?.timeseries || !queryParams) {
      return {};
    }

    const parameterIds = queryParams.parameters.filter((parameterId) => historyData.timeseries[parameterId]);

    return parameterIds.reduce<Record<string, TimeSeriesPoint[]>>((result, parameterId) => {
      result[parameterId] = historyData.timeseries[parameterId];
      return result;
    }, {});
  }, [historyData?.timeseries, queryParams]);

  const chartBounds = useMemo(() => getSeriesBounds(selectedTimeseries), [selectedTimeseries]);

  const chartSeries = useMemo(() => {
    const entries = Object.entries(selectedTimeseries);
    if (entries.length === 0) {
      return [];
    }

    const allPoints = entries.flatMap(([, points]) => points);
    const timestamps = allPoints
      .map((point) => parseTimestamp(point.ts))
      .filter((timestamp): timestamp is number => timestamp !== null);

    if (timestamps.length === 0) {
      return [];
    }

    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    return entries.map(([parameterId, points], index) => ({
      parameterId,
      label: getParameterLabel(parameterId, queryParams?.deviceType),
      color: CHART_COLORS[index % CHART_COLORS.length],
      points: buildPolylinePoints(
        points
          .map((point) => {
            const ts = parseTimestamp(point.ts);
            return ts === null ? null : { ...point, ts };
          })
          .filter((point): point is TimeSeriesPoint => point !== null),
        minTimestamp,
        maxTimestamp,
        chartBounds.minValue,
        chartBounds.maxValue,
        780,
        220
      ),
    }));
  }, [chartBounds.maxValue, chartBounds.minValue, getParameterLabel, queryParams?.deviceType, selectedTimeseries]);

  const timeLabels = useMemo(() => {
    const uniqueTimestamps = [
      ...new Set(
        Object.values(selectedTimeseries)
          .flat()
          .map((point) => parseTimestamp(point.ts))
          .filter((timestamp): timestamp is number => timestamp !== null)
      ),
    ].sort((left, right) => left - right);

    if (uniqueTimestamps.length === 0) {
      return ["14:11", "14:12", "14:13", "14:14", "14:15", "14:16", "14:17", "14:18"];
    }

    const step = Math.max(1, Math.floor(uniqueTimestamps.length / 7));
    return uniqueTimestamps
      .filter((_, index) => index % step === 0 || index === uniqueTimestamps.length - 1)
      .slice(0, 8)
      .map((timestamp) => formatHistoryTime(timestamp));
  }, [selectedTimeseries]);

  const deviceInfoDisplay = useMemo(() => {
    if (!queryParams) {
      return null;
    }

    const floorMatch = queryParams.deviceName.match(/[1-5]F|RF|B\d/i);
    if (floorMatch) {
      return `${floorMatch[0]}房间${DEVICE_TYPE_CN_NAMES[queryParams.deviceType]}`;
    }

    return queryParams.deviceName;
  }, [queryParams]);

  const statisticsCards = useMemo(() => {
    if (!historyData || !queryParams) {
      return [];
    }

    const activeType = queryParams.deviceType;
    const parameterIds = queryParams.parameters.slice(0, 6);

    return parameterIds.map((parameterId) => {
      const apiStat = historyData.statistics?.[parameterId];
      const fallbackStat = computeSeriesStats(historyData.timeseries?.[parameterId] || []);
      const stat = apiStat && [apiStat.avg, apiStat.min, apiStat.max].every((value) => Number.isFinite(value))
        ? apiStat
        : fallbackStat;

      return {
        parameterId,
        title: getParameterLabel(parameterId, activeType),
        average: formatStatValue(stat?.avg),
        min: formatStatValue(stat?.min),
        max: formatStatValue(stat?.max),
      };
    });
  }, [getParameterLabel, historyData, queryParams]);

  const tableColumns = useMemo(() => {
    if (queryParams?.parameters.length) {
      return queryParams.parameters;
    }

    return [];
  }, [queryParams?.parameters]);

  const tableRows = useMemo(() => {
    if (!historyData || !queryParams || queryParams.parameters.length === 0) {
      return [];
    }

    const firstParameter = queryParams.parameters[0];
    const timePoints = historyData.timeseries[firstParameter] || [];

    return timePoints.slice(0, 12).map((point) => {
      const row: Record<string, string> = {
        time: formatHistoryTime(point.ts),
      };

      queryParams.parameters.forEach((parameterId) => {
        const parameterData = historyData.timeseries[parameterId] || [];
        const matchedPoint = parameterData.find((item) => item.ts === point.ts);
        row[parameterId] = matchedPoint ? String(matchedPoint.value) : "";
      });

      return row;
    });
  }, [historyData, queryParams]);

  const alertData = useMemo(() => {
    if (historyData?.alarms?.length) {
      return historyData.alarms.map((alarm) => ({
        type: alarm.category || "系统告警",
        message: alarm.content,
      }));
    }

    if ((queryParams?.deviceType || selectedDeviceType) === DeviceType.Environment) {
      return [
        { type: "空气质量", message: "CO₂ 浓度超出设定阈值，请及时检查新风状态。" },
        { type: "温度", message: "当前空间温度波动偏大，建议核查空调运行情况。" },
      ];
    }

    return [
      { type: "压力", message: "管道压力波动异常" },
      { type: "频率", message: "运行频率低于设定值" },
    ];
  }, [historyData?.alarms, queryParams?.deviceType, selectedDeviceType]);

  const handleBottomNavClick = (route: string | null) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="relative w-full h-full min-w-[1920px] min-h-[1080px] overflow-hidden bg-[linear-gradient(180deg,#082231_0%,#183545_57%,#0d2838_100%)]">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px]" />
        <div className="absolute top-0 right-0 w-[543px] h-[1080px] backdrop-blur-[8.25px]" />
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover opacity-95"
          alt=""
          src="https://c.animaapp.com/4u8Y8R7D/img/11-1-1.png"
        />
      </div>

      <div className="absolute top-[5px] left-[673px] w-[531px] text-center [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl tracking-[5.04px] leading-[48px] whitespace-nowrap">
        新天普智慧实验室可视化平台
      </div>

      <div className="absolute top-9 left-[63px] inline-flex items-center gap-4">
        <img
          className="w-[43px] h-8"
          alt=""
          src="https://c.animaapp.com/4u8Y8R7D/img/header-cloud@2x.png"
        />
        <div className="[font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base">
          {WEATHER_INFO.weather}
        </div>
        <div className="[font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base">
          {WEATHER_INFO.temperature}
        </div>
        <div className="[font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base">
          {WEATHER_INFO.wind}
        </div>
      </div>

      <div className="absolute top-[39px] left-[1601px] flex items-center gap-2">
        <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base leading-[10px]">
          {formatDateLabel(now)}
        </div>
        <div className="[font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2px] leading-5 whitespace-nowrap">
          {formatClock(now)}
        </div>
      </div>

      <PanelFrame
        className="left-[50px] top-[120px]"
        width={413}
        height={541}
        headerWidth={413}
        headerBackground="https://c.animaapp.com/4u8Y8R7D/img/----3-1-1-1@2x.png"
        title="查询条件"
      >
        <>
          <button
            type="button"
            onClick={handleReload}
            className="absolute left-[335px] top-[53px] flex h-4 items-center gap-1 text-xs text-[#18fefe] transition-opacity hover:opacity-80"
          >
            <img
              className="h-4 w-4"
              alt=""
              src="https://c.animaapp.com/4u8Y8R7D/img/frame-8.svg"
            />
            重新加载
          </button>

          <div className="absolute left-[13px] top-[52px] h-[18px] w-[157px]">
            <button
              type="button"
              onClick={() => setActiveTab("query")}
              className={`absolute left-0 top-0 flex h-3.5 w-[66px] items-center justify-center [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-base leading-[48px] ${
                activeTab === "query" ? "text-[#18fefe]" : "text-[#00e2db8c]"
              }`}
            >
              查询数据
            </button>
            <div className="absolute left-[5px] top-px flex h-[17px] w-[152px] gap-4">
              <img
                className={`${activeTab === "query" ? "opacity-100" : "opacity-0"} mt-[15px] h-0.5 w-14 transition-opacity`}
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/rectangle-1345.svg"
              />
              <button
                type="button"
                onClick={() => setActiveTab("export")}
                className={`flex h-3.5 w-[78px] items-center justify-center [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-sm leading-[14px] ${
                  activeTab === "export" ? "text-[#18fefe]" : "text-[#00e2db8c]"
                }`}
              >
                导出历史数据
              </button>
            </div>
          </div>

          <form
            className="absolute left-[5px] top-[82px] flex h-[357px] w-[403px] flex-col gap-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              handleQuery();
            }}
          >
            <div className="relative ml-[10px] h-[59px] w-[383px]">
              <label className="absolute left-0 top-0 flex h-[21px] items-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#58cbc4]">
                设备类型
              </label>
              <img
                className="absolute left-0 top-[31px] h-7 w-full object-cover"
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/7-6-1-6@2x.png"
              />
              <select
                value={selectedDeviceType}
                onChange={(event) => handleDeviceTypeChange(event.target.value)}
                className="absolute left-0 top-[31px] h-7 w-full appearance-none bg-transparent px-[10px] pr-12 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#ffffffcc] outline-none"
              >
                <option value="">请选择设备类型</option>
                {deviceCategories.map((category) => (
                  <option key={category.type} value={category.type}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative ml-[10px] h-[59px] w-[383px]">
              <label className="absolute left-0 top-0 flex h-[21px] items-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#58cbc4]">
                设备编号
              </label>
              <img
                className="absolute left-0 top-[31px] h-7 w-full object-cover"
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/7-6-1-6@2x.png"
              />
              <select
                value={selectedDeviceId}
                onChange={(event) => setSelectedDeviceId(event.target.value)}
                disabled={!selectedDeviceType || filteredDevices.length === 0}
                className="absolute left-0 top-[31px] h-7 w-full appearance-none bg-transparent px-[10px] pr-12 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#ffffffcc] outline-none disabled:opacity-60"
              >
                <option value="">请选择设备</option>
                {filteredDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {getDeviceDisplayName(device.deviceType, device.interfaceName || device.deviceId)}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative ml-[10px] h-[59px] w-[383px]">
              <label className="absolute left-0 top-0 flex h-[21px] items-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#58cbc4]">
                开始时间
              </label>
              <img
                className="absolute left-0 top-[31px] h-7 w-full object-cover"
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/7-5-1-5@2x.png"
              />
              <input
                type="datetime-local"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="absolute left-0 top-[31px] h-7 w-full bg-transparent px-[10px] pr-12 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#ffffffcc] outline-none [color-scheme:dark]"
              />
            </div>

            <div className="relative ml-[10px] h-[59px] w-[383px]">
              <label className="absolute left-0 top-0 flex h-[21px] items-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#58cbc4]">
                结束时间
              </label>
              <img
                className="absolute left-0 top-[31px] h-7 w-full object-cover"
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/7-5-1-5@2x.png"
              />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="absolute left-0 top-[31px] h-7 w-full bg-transparent px-[10px] pr-12 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#ffffffcc] outline-none [color-scheme:dark]"
              />
            </div>

            <div className="relative ml-[10px] h-[92px] w-96">
              <label className="absolute left-0 top-0 flex h-[21px] items-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-[#58cbc4]">
                数据参数（可多选）
              </label>
              <div className="absolute left-0 top-[31px] max-h-[58px] w-full overflow-y-auto pr-2">
                <div className="grid grid-cols-3 gap-y-3">
                  {parameterOptions.length === 0 ? (
                    <div className="col-span-3 text-sm text-white/55">请先选择设备类型</div>
                  ) : (
                    parameterOptions.map((parameter) => (
                      <label key={parameter.id} className="flex cursor-pointer items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={selectedParameters.includes(parameter.id)}
                          onChange={() => handleParameterToggle(parameter.id)}
                          className="peer sr-only"
                        />
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border border-[#66d8d2] bg-transparent transition-colors peer-checked:bg-[#66d8d2]">
                          <svg
                            className="h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="truncate [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-sm text-white">
                          {parameter.label}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </form>

          <div className="absolute left-0 top-[498px] flex h-[34px] w-[403px] overflow-hidden">
            <button
              type="button"
              onClick={handleQuery}
              disabled={loading}
              className="relative ml-[313px] h-[35px] w-[91px] flex-1 disabled:opacity-60"
            >
              <img
                className="absolute left-0 top-0 h-[34px] w-full object-cover"
                alt=""
                src="https://c.animaapp.com/4u8Y8R7D/img/7-2-1-1@2x.png"
              />
              <span className="absolute left-[3px] top-0 flex h-[34px] w-[84px] items-center justify-center [font-family:'Source_Han_Sans_CN-Regular',Helvetica] text-xs text-[#18fefe]">
                {loading ? "查询中..." : "查询数据"}
              </span>
            </button>
          </div>

          <img
            className="absolute bottom-0 left-0 h-[5px] w-[413px]"
            alt=""
            src="https://c.animaapp.com/4u8Y8R7D/img/group-1321314852-1@2x.png"
          />
        </>
      </PanelFrame>

      <PanelFrame
        className="left-[493px] top-[120px]"
        width={936}
        height={469}
        headerWidth={485}
        headerBackground="https://c.animaapp.com/4u8Y8R7D/img/----3-1-5@2x.png"
        title="数据趋势图"
      >
        <>
          <div className="absolute top-[18px] right-[22px] inline-flex items-center gap-1.5">
            <img
              className="w-4 h-4"
              alt=""
              src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-6.svg"
            />
            <div
              className="max-w-[220px] truncate text-xs text-[#18fefe]"
              title={deviceInfoDisplay || undefined}
            >
              {deviceInfoDisplay || "请选择设备并查询"}
            </div>
          </div>

          <div className="absolute left-[23px] top-14 flex h-[400px] w-[889px] flex-col px-8 py-8">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/80">
              {chartSeries.length > 0 ? (
                chartSeries.map((series) => (
                  <div key={series.parameterId} className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: series.color }} />
                    <span>{series.label}</span>
                  </div>
                ))
              ) : null}
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex w-[44px] flex-col justify-between text-right text-xs text-white/65">
                {chartBounds.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div className="absolute left-[72px] right-0 top-0 bottom-[30px]">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-px w-full bg-white/10" />
                  ))}
                </div>

                {chartSeries.length > 0 ? (
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 780 220" preserveAspectRatio="none">
                    {chartSeries.map((series) => (
                      <polyline
                        key={series.parameterId}
                        points={series.points}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-white/45">
                    {error ? `查询失败：${error}` : loading ? "正在加载数据..." : "暂无数据"}
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-[72px] right-0 flex justify-between text-xs text-white/65">
                {timeLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </>
      </PanelFrame>

      <PanelFrame
        className="left-[1459px] top-[120px]"
        width={413}
        height={349}
        headerWidth={413}
        headerBackground="https://c.animaapp.com/4u8Y8R7D/img/----3-1-3-1@2x.png"
        title="历史告警信息"
      >
        <div className="absolute left-[41px] top-[62px] right-[41px] bottom-[22px] overflow-y-auto pr-1">
          <div className="space-y-5">
            {alertData.map((alert, index) => (
              <div key={`${alert.type}-${index}`}>
                <div className="mb-2 text-base font-medium text-white">{alert.type}</div>
                <div
                  className="flex min-h-[44px] items-center bg-cover bg-center px-5 text-sm text-white"
                  style={{ backgroundImage: "url('https://c.animaapp.com/4u8Y8R7D/img/2-6-1@2x.png')" }}
                >
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelFrame>

      <PanelFrame
        className="left-[493px] top-[607px]"
        width={936}
        height={385}
        headerWidth={483}
        headerBackground="https://c.animaapp.com/4u8Y8R7D/img/----3-1-5-1@2x.png"
        title="数据统计"
      >
        <div className="absolute left-[14px] top-[87px] right-[24px] bottom-[26px] overflow-y-auto">
          <div className="grid grid-cols-3 gap-x-2.5 gap-y-5">
            {statisticsCards.map((statistic) => (
              <div
                key={statistic.parameterId}
                className="relative h-[88px] rounded border border-[#18c1fe21] bg-[#0c2029]/40 px-4 py-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <img
                    className="h-2 w-2.5"
                    alt=""
                    src="https://c.animaapp.com/4u8Y8R7D/img/5-3-1-4@2x.png"
                  />
                  <span className="text-xs text-[#22bdd9]">{statistic.title}</span>
                </div>
                <div className="text-xs leading-[14.5px] text-white/55">
                  平均值：{statistic.average}&nbsp;&nbsp;&nbsp;&nbsp;最小值：{statistic.min}
                  <br />
                  最大值：{statistic.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelFrame>

      <div className="absolute left-[50px] top-[685px] h-[307px] w-[413px]">
        {deviceCategories.map((device, index) => {
          const row = Math.floor(index / 2);
          const column = index % 2;
          const left = column === 0 ? 0 : 218;
          const top = row * 113.5;

          return (
            <button
              key={device.type}
              type="button"
              onClick={() => handleDeviceTypeChange(device.type)}
              className="absolute h-20 w-[199px] transition-opacity hover:opacity-85"
              style={{ top, left }}
              aria-label={`${device.name}，${device.count}台设备`}
            >
              <img
                className="absolute left-[2px] top-0 h-full w-[195px] object-cover"
                alt=""
                src={device.highlighted ? device.activeBg : device.inactiveBg}
              />
              <img className={`absolute object-cover ${device.iconClassName}`} alt="" src={device.icon} />
              <div className="absolute left-[94px] top-[19px] text-xs text-white">{device.name}</div>
              <div className="absolute left-[94px] top-[37px] text-xs text-white">{device.count}台设备</div>
            </button>
          );
        })}
      </div>

      <PanelFrame
        className="left-[1459px] top-[493px]"
        width={413}
        height={499}
        headerWidth={413}
        headerBackground="https://c.animaapp.com/4u8Y8R7D/img/----3-1-3-1@2x.png"
        title="详细信息"
      >
        <div className="absolute left-6 top-[55px] h-[420px] w-[365px] overflow-auto">
          <table className="min-w-full border-collapse text-xs text-white">
            <thead className="sticky top-0 bg-[#0b232d66]">
              <tr className="text-[#0db8db]">
                <th className="px-3 py-3 text-left font-normal">时间</th>
                {tableColumns.map((column) => (
                  <th key={column} className="px-3 py-3 text-center font-normal whitespace-nowrap">
                    {getParameterLabel(column, queryParams?.deviceType)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.length > 0 ? (
                tableRows.map((row, index) => (
                  <tr key={`${row.time}-${index}`} className="border-b border-white/10">
                    <td className="px-3 py-2 whitespace-nowrap">{row.time}</td>
                    {tableColumns.map((column) => (
                      <td key={`${row.time}-${column}`} className="px-3 py-2 text-center whitespace-nowrap">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center text-white/55" colSpan={Math.max(1, tableColumns.length + 1)}>
                    {loading ? "正在加载历史数据..." : "请先查询设备历史数据"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelFrame>

      <nav className="inline-flex items-start gap-[26px] absolute left-[748px] top-[1032px]" aria-label="底部导航">
        {BOTTOM_NAV_ITEMS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleBottomNavClick(item.route)}
            className={`relative flex items-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              index === 0 ? "opacity-[0.58] text-white" : "text-[#ffffff94]"
            } ${item.route ? "cursor-pointer hover:text-white transition-colors" : "cursor-default"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
