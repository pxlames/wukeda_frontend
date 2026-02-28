/**
 * 排风机设备卡片
 */

import { FrequencyConverterDevice } from '../../types/device.types';

interface DetailRowProps {
  label: string;
  value: string;
  index: number;
}

const DetailRow = ({ label, value, index }: DetailRowProps): JSX.Element => {
  const topPositions = [0, 49, 95, 143, 189, 235, 281];
  const topPosition = topPositions[index];

  return (
    <>
      <div
        className="absolute left-[21px] w-[150px] h-[27px] flex items-center justify-start [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal]"
        style={{ top: `${topPosition}px` }}
      >
        {label}
      </div>
      <div
        className="absolute left-[338px] w-[150px] h-[27px] flex items-center justify-end [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-sm tracking-[0] leading-[normal]"
        style={{ top: `${topPosition}px` }}
      >
        {value}
      </div>
    </>
  );
};

interface FrequencyConverterCardProps {
  device: FrequencyConverterDevice;
  headerImage: string;
  bottomImage: string;
}

export const FrequencyConverterCard = ({
  device,
  headerImage,
  bottomImage,
}: FrequencyConverterCardProps): JSX.Element => {
  const { parameters, status, interfaceName, online } = device;

  const details = [
    { label: '管道压力设定', value: `${parameters.duct_pressure_setting || 0} Pa` },
    { label: '排风频率', value: `${(parameters.exhaust_frequency || 0).toFixed(1)} Hz` },
    { label: '排风转速', value: `${parameters.exhaust_speed || 0} r/min` },
    { label: '管道压力', value: `${parameters.duct_pressure || 0} Pa` },
    { label: '运行电流', value: `${(parameters.operating_current || 0).toFixed(1)} A` },
    { label: '输入电压', value: `${parameters.input_voltage || 0} V` },
    { label: '输出电压', value: `${parameters.output_voltage || 0} V` },
  ];

  // 获取运行状态颜色
  const getStatusColor = (statusValue?: string) => {
    if (statusValue === '正常运行') return 'text-[#3cda54]';
    if (statusValue === '故障') return 'text-[#ff4444]';
    return 'text-[#ffffffcc]';
  };

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
        <div className="absolute top-px left-[57px] w-auto max-w-[300px] h-[39px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[normal] whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {interfaceName}
        </div>

        {/* Section title with status */}
        <div className="absolute top-16 left-[42px] w-[493px] h-[25px] flex justify-between items-center">
          <div className="flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#ffffffcc] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            排风机运行参数
          </div>
          <div className={`flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-bold text-base tracking-[0] leading-[normal] whitespace-nowrap ${getStatusColor(status.operating)}`}>
            {status.operating || '未知'}
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

      {/* Details section */}
      <div
        className="absolute top-[85px] left-[41px] w-[504px] h-[305px] overflow-y-auto pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(24, 254, 254, 0.5) transparent',
        }}
      >
        <div className="absolute top-0.5 left-0 w-0.5 h-[303px] bg-[#d9d9d9cc]" />
        {details.map((detail, index) => (
          <DetailRow key={index} label={detail.label} value={detail.value} index={index} />
        ))}
      </div>
    </article>
  );
};
