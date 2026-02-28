/**
 * 电表设备卡片
 */

import { ElectricMeterDevice } from '../../types/device.types';

interface ElectricMeterCardProps {
  device: ElectricMeterDevice;
  headerImage: string;
  bottomImage: string;
}

export const ElectricMeterCard = ({
  device,
  headerImage,
  bottomImage,
}: ElectricMeterCardProps): JSX.Element => {
  const { parameters, interfaceName, online } = device;

  const dataItems = [
    { label: 'A相电压', value: `${(parameters.phase_a_voltage || 0).toFixed(1)} V` },
    { label: 'B相电压', value: `${(parameters.phase_b_voltage || 0).toFixed(1)} V` },
    { label: 'C相电压', value: `${(parameters.phase_c_voltage || 0).toFixed(1)} V` },
    { label: '电流', value: `${(parameters.current || 0).toFixed(2)} A` },
    { label: '功率', value: `${(parameters.power || 0).toFixed(2)} kW` },
    { label: '频率', value: `${(parameters.frequency || 0).toFixed(1)} Hz` },
    { label: '功率因数', value: (parameters.power_factor || 0).toFixed(2) },
    { label: '累积电能', value: `${(parameters.accumulated_energy || 0).toFixed(1)} kWh` },
  ];

  return (
    <article className="relative w-[570px] h-[407px] -translate-y-2 overflow-hidden">
      <div className="absolute top-0 left-0 w-[570px] h-[407px]">
        <div className="absolute top-0.5 left-0 w-[570px] h-[405px] bg-[#0000004a] border border-solid border-transparent [border-image:linear-gradient(180deg,rgba(255,255,255,0)_58%,rgba(0,255,255,0.55)_100%)_1]" />
        <img className="absolute top-0 left-0 w-[570px] h-10" alt="Header" src={headerImage} />
        <div className="absolute top-px left-[57px] w-auto max-w-[400px] h-[39px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[normal] whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {interfaceName}
        </div>
        <img className="absolute top-[396px] left-0 w-[570px] h-[11px]" alt="Bottom" src={bottomImage} />
      </div>

      <div className="absolute top-0 left-0 w-4 h-[11px] flex gap-[5.5px]">
        <div className="w-[3px] h-[11px] bg-white" />
        <div className="mt-[-5.5px] w-0.5 h-[13px] bg-white rotate-90" />
      </div>

      <div className="absolute top-0.5 left-[555px] w-[15px] h-[11px] flex gap-[4.7px] rotate-180">
        <div className="w-[3px] h-[11px] bg-white" />
        <div className="mt-[3.7px] w-[2.12px] h-[12.42px] bg-white rotate-90" />
      </div>

      <div className={`absolute top-[27px] left-[446px] w-[3px] h-[3px] rounded-[1.5px] ${online ? 'bg-[#3cda54]' : 'bg-[#ff4444]'}`} />
      <div className="absolute top-[18px] left-[454px] w-[91px] h-[18px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] whitespace-nowrap">
        在线状态&nbsp;&nbsp;{online ? '运行' : '离线'}
      </div>

      <div className="absolute top-[70px] left-[40px] w-[490px]">
        <div className="text-[#ffffffcc] text-base font-medium mb-4">电表参数</div>
        <div
          className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(24, 254, 254, 0.5) transparent',
          }}
        >
          {dataItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-[#ffffff0a] p-4 rounded">
              <span className="text-[#ffffffcc] text-sm">{item.label}</span>
              <span className="text-white text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
