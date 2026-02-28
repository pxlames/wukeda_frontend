import { useState, useEffect, useMemo } from "react";
import { AlertInfoSection } from "./sections/AlertInfoSection";
import { DetailedDataTableSection } from "./sections/DetailedDataTableSection";
import { FilterSection } from "./sections/FilterSection";
import { HistoricalDataChartSection } from "./sections/HistoricalDataChartSection";
import { SummaryStatisticsSection } from "./sections/SummaryStatisticsSection";
import { DeviceType } from "../../types/device.types";
import { useHistoryData } from "../../hooks/useHistoryData";
import { deviceService } from "../../services/api.service";
import { DEVICE_TYPE_CN_NAMES } from "../../utils/deviceNameMapper";

interface HistoricalDataProps {
  onClose?: () => void; // 独立页面模式下使用 Link 返回，可选
}

export const HistoricalData = (_props: HistoricalDataProps): JSX.Element => {
  const { data: historyData, loading, error, fetchHistoryData } = useHistoryData();
  const [queryParams, setQueryParams] = useState<any>(null);
  const [allDevices, setAllDevices] = useState<any[]>([]);
  /** 与左下角设备分类按钮联动：点击分类时同步到查询表单 */
  const [selectedDeviceTypeForForm, setSelectedDeviceTypeForForm] = useState<DeviceType | ''>('');

  // 加载所有设备
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await deviceService.getAllDevices();
        setAllDevices(devices);
      } catch (error) {
        console.error('加载设备列表失败:', error);
      }
    };
    loadDevices();
  }, []);

  // 计算设备分类统计（6种设备类型）
  const deviceCategories = useMemo(() => {
    const categories = [
      {
        type: DeviceType.FrequencyConverter,
        name: "排风机",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-3.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-1.png",
      },
      {
        type: DeviceType.WaterImmersion,
        name: "漏水检测",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-4.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png",
      },
      {
        type: DeviceType.Environment,
        name: "空气质量",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-5.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png",
      },
      {
        type: DeviceType.WaterMeter,
        name: "智能水表",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png",
      },
      {
        type: DeviceType.ElectricMeter,
        name: "智能电表",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-7.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png",
      },
      {
        type: DeviceType.FumeHood,
        name: "通风柜",
        icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-6-1.png",
        image: "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png",
      },
    ];

    // 计算每种类型的设备数量；高亮：当前表单选中或已查询过的类型
    return categories.map(cat => ({
      ...cat,
      count: allDevices.filter(d => d.deviceType === cat.type).length,
      highlighted: queryParams?.deviceType === cat.type || selectedDeviceTypeForForm === cat.type,
    }));
  }, [allDevices, queryParams, selectedDeviceTypeForForm]);

  /** 从 queryParams 解析设备信息，格式为「XX房间XX传感器」 */
  const deviceInfoDisplay = useMemo(() => {
    if (!queryParams) return null;
    const { deviceName, deviceType } = queryParams;
    const sensorType = DEVICE_TYPE_CN_NAMES[deviceType] || deviceType;
    // 从设备名提取楼层：支持 2F、3F、4F、5F、RF、B1 等
    const floorMatch = (deviceName || '').match(/[2-5]F|RF|B\d/i);
    const room = floorMatch ? floorMatch[0] : null;
    if (room) return `${room}房间${sensorType}`;
    return deviceName || sensorType;
  }, [queryParams]);

  /**
   * 处理查询请求
   */
  const handleQuery = async (params: {
    deviceType: DeviceType;
    deviceId: string;
    deviceName: string;
    timeLength: number;
    dataCount: number;
    parameters: string[];
  }) => {
    console.log('查询参数:', params);
    setQueryParams(params);
    
    // 调用历史数据接口
    await fetchHistoryData(
      params.deviceType,
      params.deviceId,
      params.timeLength,
      params.dataCount,
      params.deviceName
    );
  };

  return (
    <div
      className="w-full h-full bg-[#0a2f47] relative overflow-hidden"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="absolute inset-0 bg-[#0a2f47]" style={{ margin: 0, padding: 0 }}>
        {/* 设备分类 - 左下角 */}
        <div className="absolute top-[615px] left-[64px] w-[412px] h-[255px]">
          {deviceCategories.map((device, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const top = row * 88;
            const left = col * 217;
            return (
              <button
                key={index}
                type="button"
                className={`absolute w-[199px] h-20 cursor-pointer hover:opacity-80 transition-opacity ${
                  device.highlighted ? "opacity-100" : "opacity-70"
                }`}
                style={{ top: `${top}px`, left: `${left}px` }}
                aria-label={`${device.name} ${device.count}台设备`}
                onClick={() => setSelectedDeviceTypeForForm(device.type)}
              >
                <img
                  className="absolute w-[195px] h-full top-0 left-[calc(50.00%_-_97.5px)] object-cover"
                  alt=""
                  src={device.highlighted ? device.image : "https://c.animaapp.com/mlfetkekTcDg2Q/img/6-2-4.png"}
                />
                <img
                  className={`absolute object-cover ${
                    index === 0 ? "top-[19px] left-[5px] w-[73px] h-10"
                      : index === 1 ? "top-[13px] left-[11px] w-[73px] h-[45px]"
                      : index === 2 ? "top-[13px] left-[5px] w-[73px] h-[45px]"
                      : index === 3 ? "top-5 left-[11px] w-[73px] h-[38px]"
                      : index === 4 ? "top-[19px] left-[5px] w-[73px] h-9"
                      : "top-5 left-[11px] w-[73px] h-[38px]"
                  }`}
                  alt=""
                  src={device.icon}
                />
                <div className="absolute top-[19px] left-[94px] w-[53px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                  {device.name}
                </div>
                <div className="absolute top-[37px] left-[94px] w-[60px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                  {device.count}台设备
                </div>
              </button>
            );
          })}
        </div>

        <FilterSection
          onQuery={handleQuery}
          selectedDeviceType={selectedDeviceTypeForForm}
          onDeviceTypeChange={setSelectedDeviceTypeForForm}
        />
        <HistoricalDataChartSection
          historyData={historyData}
          queryParams={queryParams}
          loading={loading}
          error={error}
        />
        <div className="inline-flex items-end gap-0.5 absolute top-[115px] left-[1118px]">
          <img className="relative w-4 h-4" alt="" src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-6.svg" />
          <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#18fefe] text-xs leading-[48px] truncate max-w-[180px]" title={deviceInfoDisplay || undefined}>
            {deviceInfoDisplay || "请选择设备并查询"}
          </div>
        </div>
        <SummaryStatisticsSection historyData={historyData} queryParams={queryParams} />
        <DetailedDataTableSection />
        <AlertInfoSection />
      </div>
    </div>
  );
};
