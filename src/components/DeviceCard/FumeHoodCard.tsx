/**
 * 通风柜设备卡片
 */

import { FumeHoodDevice } from '../../types/device.types';

interface StatusBadgeProps {
  label: string;
  backgroundImage: string;
}

const StatusBadge = ({ label, backgroundImage }: StatusBadgeProps): JSX.Element => {
  return (
    <div
      className="w-[113px] h-[55px] flex bg-[100%_100%] bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mt-1.5 w-[113px] h-[38.08px] flex items-center justify-center">
        <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          {label}
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps): JSX.Element => {
  return (
    <div className="flex justify-between items-center h-[24px] mb-[2px]">
      <div className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-[13px] tracking-[0] leading-[24px] whitespace-nowrap">
        {label}：
      </div>
      <div className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-[13px] tracking-[0] leading-[24px] text-right whitespace-nowrap ml-4">
        {value}
      </div>
    </div>
  );
};

interface FumeHoodCardProps {
  device: FumeHoodDevice;
  headerImage: string;
  bottomImage: string;
}

export const FumeHoodCard = ({
  device,
  headerImage,
  bottomImage,
}: FumeHoodCardProps): JSX.Element => {
  const { status, parameters, interfaceName, online } = device;

  // 状态徽章背景图（根据状态值动态选择）
  const getStatusBadgeImage = (index: number): string => {
    // 这里可以根据状态值返回不同的背景图
    // 暂时使用固定图片
    const baseImages = [
      'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1.png',
      'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1-1.png',
      'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1-2.png',
      'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1-3.png',
    ];
    return baseImages[index] || baseImages[0];
  };

  const statusBadges = [
    {
      label: status.device_on_off || '未知',
      backgroundImage: getStatusBadgeImage(0),
    },
    {
      label: status.air_shortage || '未知',
      backgroundImage: getStatusBadgeImage(1),
    },
    {
      label: status.area_sensor_enabled || '未知',
      backgroundImage: getStatusBadgeImage(2),
    },
    {
      label: status.window_motor || '未知',
      backgroundImage: getStatusBadgeImage(3),
    },
  ];

  // 格式化数值显示
  const formatValue = (value: number | undefined, unit: string, decimals: number = 2): string => {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(decimals)}${unit}`;
  };

  const details = [
    { label: '品牌', value: '新天普' }, // 暂时硬编码，后续可从设备信息获取
    { label: '位置', value: device.room || '未知' },
    { label: '所属系统', value: device.interfaceName || '未知' },
    { label: '设备异常告警状态', value: status.air_shortage || '正常' },
    { label: '强排开关', value: status.device_on_off || '未知' },
    { label: '阀门开度', value: parameters.valve_opening !== undefined ? `${parameters.valve_opening}%` : '-' },
    { label: '实时功率', value: '-' }, // 暂无此字段
    { label: '面风速', value: formatValue(parameters.face_wind_speed, 'm/s') },
    { label: '排风速度', value: formatValue(parameters.exhaust_air_speed, 'm/s') },
    { label: '视窗高度', value: parameters.window_height !== undefined ? `${(parameters.window_height / 10).toFixed(1)}cm` : '-' }, // 转换mm到cm
    { label: '排风量', value: parameters.exhaust_air_volume !== undefined ? `${parameters.exhaust_air_volume} m³/h` : '-' },
  ];

  return (
    <article className="relative w-[570px] h-[407px] overflow-hidden">
      {/* Main container */}
      <div className="absolute top-0 left-0 w-[570px] h-[407px]">
        {/* Background and border */}
        <div className="absolute top-0.5 left-0 w-[570px] h-[405px] bg-[#0000004a] border border-solid border-transparent [border-image:linear-gradient(180deg,rgba(255,255,255,0)_58%,rgba(0,255,255,0.55)_100%)_1]" />

        {/* Header */}
        <img
          className="absolute top-0 left-0 w-[570px] h-10"
          alt="Header decoration"
          src={headerImage}
        />

        {/* Room title */}
        <div className="absolute top-px left-[57px] w-auto max-w-[400px] h-[39px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[normal] whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {interfaceName}
        </div>

        {/* Column headers */}
        <div className="absolute top-16 left-[34px] w-[502px] h-[25px] flex justify-between items-center">
          <div className="flex items-center justify-center w-[113px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal] text-center">
            设备开停状态
          </div>
          <div className="flex items-center justify-center w-[113px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm text-center tracking-[0] leading-[normal]">
            缺风状态
          </div>
          <div className="flex items-center justify-center w-[113px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm text-center tracking-[0] leading-[normal]">
            区域传感器
          </div>
          <div className="flex items-center justify-center w-[113px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm text-center tracking-[0] leading-[normal]">
            视窗电机状态
          </div>
        </div>

        {/* Bottom decoration */}
        <img
          className="absolute top-[396px] left-0 w-[570px] h-[11px]"
          alt="Bottom decoration"
          src={bottomImage}
        />
      </div>

      {/* Top left corner decoration */}
      <div className="absolute top-0 left-0 w-4 h-[11px] flex gap-[5.5px]">
        <div className="w-[3px] h-[11px] bg-white" />
        <div className="mt-[-5.5px] w-0.5 h-[13px] bg-white rotate-90" />
      </div>

      {/* Top right corner decoration */}
      <div className="absolute top-0.5 left-[555px] w-[15px] h-[11px] flex gap-[4.7px] rotate-180">
        <div className="w-[3px] h-[11px] bg-white" />
        <div className="mt-[3.7px] w-[2.12px] h-[12.42px] bg-white rotate-90" />
      </div>

      {/* Online status indicator */}
      <div
        className={`absolute top-[27px] left-[446px] w-[3px] h-[3px] rounded-[1.5px] ${
          online ? 'bg-[#3cda54]' : 'bg-[#ff4444]'
        }`}
      />

      {/* Online status text */}
      <div className="absolute top-[18px] left-[454px] w-[91px] h-[18px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
        在线状态&nbsp;&nbsp;{online ? '运行' : '离线'}
      </div>

      {/* Status badges */}
      <div className="absolute top-[100px] left-[34px] w-[502px] flex justify-between">
        {statusBadges.map((badge, index) => (
          <div key={index}>
            <StatusBadge
              label={badge.label}
              backgroundImage={badge.backgroundImage}
            />
          </div>
        ))}
      </div>

      {/* Details section */}
      <div className="absolute top-[180px] left-[41px] w-[504px] h-[200px]">
        {/* 左侧分隔线 */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-[#d9d9d9cc]" />
        
        {/* 滚动内容区域 */}
        <div
          className="h-full overflow-y-auto pl-[20px] pr-[12px] pt-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(24, 254, 254, 0.5) transparent',
          }}
        >
          {details.map((detail, index) => (
            <DetailRow key={index} label={detail.label} value={detail.value} />
          ))}
        </div>
      </div>
    </article>
  );
};
