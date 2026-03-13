/**
 * 设备状态仪表板区域
 * 显示所有设备的实时状态卡片
 */

import { useDevices } from '../../../hooks/useDevices';
import { DeviceCard } from '../../../components/DeviceCard';
import { appConfig } from '../../../config/app.config';

interface DeviceStatusDashboardSectionProps {
  floor?: string;
}

export const DeviceStatusDashboardSection = ({
  floor,
}: DeviceStatusDashboardSectionProps): JSX.Element => {
  const { devices, loading, error } = useDevices({
    floor,
    autoRefresh: true,
    refreshInterval: appConfig.deviceDashboardRefreshInterval,
  });

  // 加载中状态
  if (loading && devices.length === 0) {
    return (
      <section className="flex flex-col w-[1742px] h-[944px] items-center justify-center absolute top-[108px] left-36">
        <div className="text-white text-xl">加载设备数据中...</div>
      </section>
    );
  }

  // 错误状态
  if (error) {
    return (
      <section className="flex flex-col w-[1742px] h-[944px] items-center justify-center absolute top-[108px] left-36">
        <div className="text-red-500 text-xl">加载失败: {error}</div>
      </section>
    );
  }

  // 无设备数据
  if (devices.length === 0) {
    return (
      <section className="flex flex-col w-[1742px] h-[944px] items-center justify-center absolute top-[108px] left-36">
        <div className="text-white text-xl">
          {floor ? `${floor} 楼层暂无设备` : '暂无设备数据'}
        </div>
      </section>
    );
  }

  // 将设备分组，每行 3 个
  const rows: typeof devices[] = [];
  for (let i = 0; i < devices.length; i += 3) {
    rows.push(devices.slice(i, i + 3));
  }

  return (
    <section 
      className="absolute top-[108px] left-36 w-[1742px] h-[944px] overflow-y-auto overflow-x-hidden z-10"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(149, 226, 255, 0.3) transparent',
      }}
    >
      <style>{`
        .device-scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .device-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .device-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(149, 226, 255, 0.3);
          border-radius: 4px;
        }
        .device-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(149, 226, 255, 0.5);
        }
      `}</style>
      <div className="flex flex-col gap-4 w-full pb-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex w-full items-center gap-4"
          >
            {row.map((device, cardIndex) => (
              <DeviceCard key={device.deviceId} device={device} index={rowIndex * 3 + cardIndex} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
