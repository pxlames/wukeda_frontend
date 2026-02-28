import { useState, useEffect, useMemo } from 'react';
import { DeviceType } from '../../../types/device.types';
import { Device } from '../../../types/device.types';
import { deviceService } from '../../../services/api.service';
import { DEVICE_HISTORY_PARAMETERS, DEVICE_TYPE_TO_API_PATH } from '../../../config/historyParams.config';
import { DEVICE_TYPE_CN_NAMES } from '../../../utils/deviceNameMapper';

interface FilterSectionProps {
  onQuery: (params: {
    deviceType: DeviceType;
    deviceId: string;
    deviceName: string;
    timeLength: number;
    dataCount: number;
    parameters: string[];
  }) => void;
  /** 与左下角设备分类联动：受控的设备类型 */
  selectedDeviceType?: DeviceType | '';
  onDeviceTypeChange?: (type: DeviceType | '') => void;
}

export const FilterSection = ({ onQuery, selectedDeviceType: controlledDeviceType, onDeviceTypeChange }: FilterSectionProps): JSX.Element => {
  // 所有设备列表
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 表单数据（设备类型可受控：与左下角分类按钮联动）
  const [internalDeviceType, setInternalDeviceType] = useState<DeviceType | ''>('');
  const isControlled = controlledDeviceType !== undefined;
  const selectedDeviceType = isControlled ? controlledDeviceType : internalDeviceType;
  const setSelectedDeviceType = (type: DeviceType | '') => {
    if (onDeviceTypeChange) onDeviceTypeChange(type);
    if (!isControlled) setInternalDeviceType(type);
  };
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'query' | 'export'>('query');

  // 初始化时间（默认最近24小时）
  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    setEndTime(formatDateTimeLocal(now));
    setStartTime(formatDateTimeLocal(yesterday));
  }, []);

  // 加载所有设备
  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      try {
        const devices = await deviceService.getAllDevices();
        setAllDevices(devices);
      } catch (error) {
        console.error('加载设备列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, []);

  // 格式化日期时间为 datetime-local 格式
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // 获取所有设备类型（写死6种）
  const deviceTypes: DeviceType[] = [
    DeviceType.FrequencyConverter, // 排风机
    DeviceType.WaterImmersion,     // 漏水检测
    DeviceType.Environment,         // 空气质量
    DeviceType.WaterMeter,          // 智能水表
    DeviceType.ElectricMeter,       // 智能电表
    DeviceType.FumeHood,            // 通风柜
  ];

  // 计算每种设备类型的数量
  const deviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    deviceTypes.forEach(type => {
      counts[type] = allDevices.filter(d => d.deviceType === type).length;
    });
    return counts;
  }, [allDevices]);

  // 根据选中的设备类型筛选设备
  const filteredDevices = useMemo(() => {
    if (!selectedDeviceType) return [];
    return allDevices.filter(d => d.deviceType === selectedDeviceType);
  }, [allDevices, selectedDeviceType]);

  // 设备编号默认选中第一个
  useEffect(() => {
    if (filteredDevices.length === 0) {
      setSelectedDeviceId('');
      return;
    }
    if (!selectedDeviceId || !filteredDevices.some(d => d.deviceId === selectedDeviceId)) {
      setSelectedDeviceId(filteredDevices[0].deviceId);
    }
  }, [filteredDevices, selectedDeviceId]);

  // 获取当前设备类型的参数选项
  const parameterOptions = useMemo(() => {
    if (!selectedDeviceType) return [];
    return DEVICE_HISTORY_PARAMETERS[selectedDeviceType] || [];
  }, [selectedDeviceType]);

  // 默认全选参数
  useEffect(() => {
    setSelectedParameters(parameterOptions.map((param) => param.id));
  }, [parameterOptions]);

  // 处理设备类型变化（同步到父组件，便于与分类按钮高亮一致）
  const handleDeviceTypeChange = (type: string) => {
    const value = type as DeviceType | '';
    setSelectedDeviceType(value);
    setSelectedDeviceId(''); // 清空设备选择
    setSelectedParameters([]); // 清空参数选择
  };

  // 处理参数选择
  const handleParameterToggle = (parameterId: string) => {
    setSelectedParameters(prev =>
      prev.includes(parameterId)
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
    );
  };

  // 处理查询
  const handleQuery = () => {
    if (!selectedDeviceType || !selectedDeviceId) {
      alert('请选择设备类型和设备编号');
      return;
    }

    if (!startTime || !endTime) {
      alert('请选择开始时间和结束时间');
      return;
    }

    if (selectedParameters.length === 0) {
      alert('请至少选择一个数据参数');
      return;
    }

    // 计算时间长度（毫秒）
    const startTs = new Date(startTime).getTime();
    const endTs = new Date(endTime).getTime();
    const timeLength = endTs - startTs;

    if (timeLength <= 0) {
      alert('结束时间必须大于开始时间');
      return;
    }

    // 获取选中设备的名称
    const selectedDevice = filteredDevices.find(d => d.deviceId === selectedDeviceId);
    const deviceName = selectedDevice?.interfaceName || selectedDevice?.deviceName || '';

    onQuery({
      deviceType: selectedDeviceType,
      deviceId: selectedDeviceId,
      deviceName,
      timeLength,
      dataCount: 100, // 默认100个数据点
      parameters: selectedParameters,
    });
  };

  // 处理重新加载
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <section className="absolute top-[62px] left-[64px] w-[413px] h-[541px]" role="search" aria-label="查询条件">
      <div className="absolute top-0.5 left-0 w-[413px] h-[539px] bg-[#0000004a] border border-solid border-transparent [border-image:linear-gradient(180deg,rgba(255,255,255,0)_58%,rgba(0,255,255,0.55)_100%)_1]" />
      
      <button 
        className="absolute top-[53px] left-[335px] w-[70px] h-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleReload}
        aria-label="重新加载"
      >
        <img
          className="absolute w-[22.86%] h-full top-0 left-0"
          alt=""
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame.svg"
        />
        <span className="absolute top-px left-5 w-12 h-[15px] flex items-center justify-center [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#18fefe] text-xs text-center tracking-[0] leading-[48px] whitespace-nowrap">
          重新加载
        </span>
      </button>

      <div className="absolute top-[498px] left-0 w-[403px] h-[34px] flex overflow-hidden">
        <button 
          className="w-[91.44px] h-[35.52px] ml-[313.6px] relative cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleQuery}
          aria-label="查询数据"
        >
          <img
            className="absolute w-[97.81%] top-0 left-0 h-[34px] object-cover"
            alt=""
            src="https://c.animaapp.com/mlfetkekTcDg2Q/img/7-2-1.png"
          />
          <span className="absolute w-[92.06%] h-[95.72%] top-0 left-[3.45%] flex items-center justify-center [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#18fefe] text-xs text-center tracking-[0] leading-[48px] whitespace-nowrap">
            查询数据
          </span>
        </button>
      </div>

      <img
        className="h-10 absolute top-0 left-0 w-[413px]"
        alt=""
        src="https://c.animaapp.com/mlfetkekTcDg2Q/img/----3-1-1.png"
      />

      {/* 标题行：查询条件 + 标签（查询数据 | 导出历史数据）*/}
      <div className="absolute top-0 left-0 right-0 flex items-center h-10 pl-[41px] pr-2">
        <img className="w-4 h-4 flex-shrink-0" alt="" src="https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-6.svg" />
        <h2 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base leading-[48px] whitespace-nowrap mr-4">
          查询条件
        </h2>
        <div className="flex gap-0 border-l border-[#61afc2]/40 pl-3">
          <button
            type="button"
            onClick={() => setActiveTab('query')}
            className={`px-2 py-1 text-sm [font-family:'Source_Han_Sans_CN-Regular',Helvetica] transition-colors ${
              activeTab === 'query' ? 'text-[#18fefe]' : 'text-[#ffffff99] hover:text-white'
            }`}
          >
            查询数据
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-2 py-1 text-sm [font-family:'Source_Han_Sans_CN-Regular',Helvetica] transition-colors ${
              activeTab === 'export' ? 'text-[#18fefe]' : 'text-[#ffffff99] hover:text-white'
            }`}
          >
            导出历史数据
          </button>
        </div>
      </div>

      {activeTab === 'query' ? (
      <form className="absolute top-[82px] left-[5px] w-[403px] h-[400px] flex flex-col gap-2.5" onSubmit={(e) => { e.preventDefault(); handleQuery(); }}>
        {/* 设备类型 */}
        <div className="h-[59px] relative">
          <label 
            htmlFor="deviceType"
            className="w-[14.39%] h-[35.59%] top-0 text-[#58cbc4] absolute left-[2.48%] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[48px] whitespace-nowrap"
          >
            设备类型
          </label>
          <div className="absolute w-full h-[47.46%] top-[52.54%] left-0">
            <img
              className="absolute w-full h-full top-0 left-0 object-cover"
              alt=""
              src="https://c.animaapp.com/mlfetkekTcDg2Q/img/7-6-1-1.png"
            />
            <select
              id="deviceType"
              value={selectedDeviceType}
              onChange={(e) => handleDeviceTypeChange(e.target.value)}
              className="absolute w-full h-full top-0 left-0 cursor-pointer px-[2.48%] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0] leading-[48px] bg-transparent border-none outline-none appearance-none"
              aria-label="设备类型"
              disabled={loading}
            >
              <option value="">请选择设备类型</option>
              {deviceTypes.map(type => (
                <option key={type} value={type} className="bg-[#0a2f47] text-white">
                  {DEVICE_TYPE_CN_NAMES[type]} ({deviceCounts[type] || 0}台设备)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 设备编号 */}
        <div className="h-[59px] relative">
          <label 
            htmlFor="deviceNumber"
            className="w-[14.39%] h-[35.59%] top-0 text-[#58cbc4] absolute left-[2.48%] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[48px] whitespace-nowrap"
          >
            设备编号
          </label>
          <div className="absolute w-full h-[47.46%] top-[52.54%] left-0">
            <img
              className="absolute w-full h-full top-0 left-0 object-cover"
              alt=""
              src="https://c.animaapp.com/mlfetkekTcDg2Q/img/7-6-1-1.png"
            />
            <select
              id="deviceNumber"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="absolute w-full h-full top-0 left-0 cursor-pointer px-[2.48%] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0] leading-[48px] bg-transparent border-none outline-none appearance-none"
              aria-label="设备编号"
              disabled={!selectedDeviceType || filteredDevices.length === 0}
            >
              <option value="">请选择设备</option>
              {filteredDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-[#0a2f47] text-white">
                  {device.interfaceName || device.deviceName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 开始时间 */}
        <div className="h-[59px] relative">
          <label 
            htmlFor="startDate"
            className="w-[14.39%] h-[35.59%] top-0 text-[#58cbc4] absolute left-[2.48%] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[48px] whitespace-nowrap"
          >
            开始时间
          </label>
          <div className="absolute w-full top-[31px] left-0 h-7">
            <img
              className="absolute w-full h-full top-0 left-0 object-cover"
              alt=""
              src="https://c.animaapp.com/mlfetkekTcDg2Q/img/7-5-1-1.png"
            />
            <input
              type="datetime-local"
              id="startDate"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="absolute w-full h-full top-0 left-0 px-[2.48%] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-xs tracking-[0] cursor-pointer bg-transparent border-none outline-none"
              aria-label="开始时间"
            />
          </div>
        </div>

        {/* 结束时间 */}
        <div className="h-[59px] relative">
          <label 
            htmlFor="endDate"
            className="w-[14.39%] h-[35.59%] top-0 text-[#58cbc4] absolute left-[2.48%] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[48px] whitespace-nowrap"
          >
            结束时间
          </label>
          <div className="absolute w-full top-[31px] left-0 h-7">
            <img
              className="absolute w-full h-full top-0 left-0 object-cover"
              alt=""
              src="https://c.animaapp.com/mlfetkekTcDg2Q/img/7-5-1-1.png"
            />
            <input
              type="datetime-local"
              id="endDate"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="absolute w-full h-full top-0 left-0 px-[2.48%] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-xs tracking-[0] cursor-pointer bg-transparent border-none outline-none"
              aria-label="结束时间"
            />
          </div>
        </div>

        {/* 数据参数 */}
        <fieldset className="ml-[10.5px] w-96 min-h-[100px] relative">
          <legend className="absolute top-0 left-0 w-[156px] h-[21px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#58cbc4] text-sm tracking-[0] leading-[48px] whitespace-nowrap">
            数据参数（可多选）
          </legend>
          <div className="absolute top-[31px] left-0 w-full grid grid-cols-2 gap-y-2 gap-x-4">
            {parameterOptions.length === 0 && (
              <div className="col-span-2 text-[#ffffffcc] text-sm">
                请先选择设备类型
              </div>
            )}
            {parameterOptions.map((param) => (
              <label 
                key={param.id}
                className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <input
                  type="checkbox"
                  checked={selectedParameters.includes(param.id)}
                  onChange={() => handleParameterToggle(param.id)}
                  className="sr-only"
                  aria-label={param.label}
                />
                <img
                  className="relative w-5 h-5"
                  alt=""
                  src={selectedParameters.includes(param.id) 
                    ? "https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-1.svg"
                    : "https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-1.svg"
                  }
                  style={{ opacity: selectedParameters.includes(param.id) ? 1 : 0.5 }}
                />
                <span className="relative flex items-center justify-start h-[18px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[48px] whitespace-nowrap">
                  {param.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>
      ) : (
      <div className="absolute top-[82px] left-[24px] w-[365px] flex flex-col gap-4 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] text-[#ffffffcc] text-sm">
        <p>选择设备并查询后，可在此导出历史数据。</p>
        <p className="text-[#ffffff99] text-xs">导出功能开发中</p>
      </div>
      )}

      <img
        className="absolute top-[535px] left-0 w-[413px] h-[5px]"
        alt=""
        src="https://c.animaapp.com/mlfetkekTcDg2Q/img/group-1321314852.png"
      />
    </section>
  );
};
