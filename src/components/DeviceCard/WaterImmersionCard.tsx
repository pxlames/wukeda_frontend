/**
 * 浸水检测器设备卡片
 */

import { WaterImmersionDevice } from '../../types/device.types';

interface StatusBadgeProps {
  label: string;
  value: string;
  isAlert: boolean;
}

const StatusBadge = ({ label, value, isAlert }: StatusBadgeProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal]">
        {label}
      </div>
      <div
        className="w-[113px] h-[55px] flex items-center justify-center bg-[100%_100%] bg-no-repeat"
        style={{ 
          backgroundImage: `url(${isAlert ? 'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1-3.png' : 'https://c.animaapp.com/mlf6o2v3f0K6fB/img/7-1-1.png'})` 
        }}
      >
        <div className={`[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-xl tracking-[0] leading-[normal] ${isAlert ? 'text-[#ff4444]' : 'text-white'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  index: number;
}

const DetailRow = ({ label, value, index }: DetailRowProps): JSX.Element => {
  const topPositions = [0, 49];
  const topPosition = topPositions[index];

  return (
    <>
      <div
        className="absolute left-[21px] w-[120px] h-[27px] flex items-center justify-start [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal]"
        style={{ top: `${topPosition}px` }}
      >
        {label}
      </div>
      <div
        className="absolute left-[368px] w-[120px] h-[27px] flex items-center justify-end [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal]"
        style={{ top: `${topPosition}px` }}
      >
        {value}
      </div>
    </>
  );
};

interface WaterImmersionCardProps {
  device: WaterImmersionDevice;
  headerImage: string;
  bottomImage: string;
}

export const WaterImmersionCard = ({
  device,
  headerImage,
  bottomImage,
}: WaterImmersionCardProps): JSX.Element => {
  const { status, interfaceName, online } = device;

  const statusItems = [
    { 
      label: '浸水状态', 
      value: status.immersion || '未知', 
      isAlert: status.immersion === '浸水' 
    },
    { 
      label: '报警状态', 
      value: status.alarm || '未知', 
      isAlert: status.alarm === '报警' 
    },
  ];

  const details = [
    { label: '浸水状态', value: status.immersion || '未知' },
    { label: '报警状态', value: status.alarm || '未知' },
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

        {/* Section title */}
        <div className="absolute top-[70px] left-[42px] w-[493px] h-[25px] flex justify-center">
          <div className="flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            浸水检测状态
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
      <div className="absolute top-[171px] left-[100px] flex gap-[80px]">
        {statusItems.map((item, index) => (
          <StatusBadge
            key={index}
            label={item.label}
            value={item.value}
            isAlert={item.isAlert}
          />
        ))}
      </div>

      {/* Details section */}
      <div
        className="absolute top-[294px] left-[41px] w-[504px] h-[95px] overflow-y-auto pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(24, 254, 254, 0.5) transparent',
        }}
      >
        <div className="absolute top-0.5 left-0 w-0.5 h-[93px] bg-[#d9d9d9cc]" />
        {details.map((detail, index) => (
          <DetailRow key={index} label={detail.label} value={detail.value} index={index} />
        ))}
      </div>
    </article>
  );
};
