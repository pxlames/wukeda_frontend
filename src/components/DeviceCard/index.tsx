/**
 * 设备卡片统一导出
 */

import { Device, DeviceType } from '../../types/device.types';
import { getDeviceDisplayName } from '../../utils/deviceNameMapper';
import { FumeHoodCard } from './FumeHoodCard';
import { EnvironmentCard } from './EnvironmentCard';
import { ElectricMeterCard } from './ElectricMeterCard';
import { WaterMeterCard } from './WaterMeterCard';
import { WaterImmersionCard } from './WaterImmersionCard';
import { FrequencyConverterCard } from './FrequencyConverterCard';
import { GasPathHostCard } from './GasPathHostCard';

interface DeviceCardProps {
  device: Device;
  index: number;
}

/**
 * 根据设备类型渲染对应的卡片组件
 */
export const DeviceCard = ({ device, index }: DeviceCardProps): JSX.Element => {
  // 将设备名称中的英文类型替换为中文，保留编号
  const displayName = getDeviceDisplayName(device.deviceType, device.interfaceName);
  
  // 创建带有中文名称的设备对象
  const deviceWithCnName = {
    ...device,
    interfaceName: displayName,
  };

  // 卡片装饰图片（循环使用）
  const headerImages = [
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-1.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-2.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-3.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-4.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-5.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-6.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-7.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/----3-1-1-8.png',
  ];

  const bottomImages = [
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-1.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-2.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-3.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-4.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-5.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-6.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-7.png',
    'https://c.animaapp.com/mlf6o2v3f0K6fB/img/group-1321314852-8.png',
  ];

  const headerImage = headerImages[index % headerImages.length];
  const bottomImage = bottomImages[index % bottomImages.length];

  switch (device.deviceType) {
    case DeviceType.FumeHood:
      return <FumeHoodCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.Environment:
      return <EnvironmentCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.ElectricMeter:
      return <ElectricMeterCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.WaterMeter:
      return <WaterMeterCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.WaterImmersion:
      return <WaterImmersionCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.FrequencyConverter:
      return <FrequencyConverterCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    case DeviceType.GasPathHost:
      return <GasPathHostCard device={deviceWithCnName as any} headerImage={headerImage} bottomImage={bottomImage} />;
    
    default:
      return (
        <div className="relative w-[570px] h-[407px] bg-[#0000004a] border border-solid border-white flex items-center justify-center">
          <div className="text-white text-xl">未知设备类型: {device.deviceType}</div>
        </div>
      );
  }
};

export default DeviceCard;
