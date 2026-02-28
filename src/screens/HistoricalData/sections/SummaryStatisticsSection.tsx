import { useMemo } from 'react';
import { HistoryDataResponse } from '../../../types/history.types';
import { DEVICE_HISTORY_PARAMETERS } from '../../../config/historyParams.config';
import { DeviceType } from '../../../types/device.types';

interface SummaryStatisticsSectionProps {
  historyData: HistoryDataResponse | null;
  queryParams: {
    deviceType: DeviceType;
    deviceId: string;
    deviceName: string;
    timeLength: number;
    dataCount: number;
    parameters: string[];
  } | null;
}

export const SummaryStatisticsSection = ({
  historyData,
  queryParams,
}: SummaryStatisticsSectionProps): JSX.Element => {
  // 根据实际数据生成统计信息
  const statisticsData = useMemo(() => {
    if (!historyData || !queryParams) {
      return [];
    }

    const paramConfig = DEVICE_HISTORY_PARAMETERS[queryParams.deviceType] || [];
    const { statistics } = historyData;

    return queryParams.parameters.map((paramId, index) => {
      const config = paramConfig.find(p => p.id === paramId);
      const stat = statistics[paramId];

      return {
        id: index + 1,
        title: config?.label || paramId,
        average: stat ? stat.avg.toFixed(2) : '',
        min: stat ? stat.min.toFixed(2) : '',
        max: stat ? stat.max.toFixed(2) : '',
      };
    });
  }, [historyData, queryParams]);

  const topRowData = statisticsData.slice(0, 3);
  const bottomRowData = statisticsData.slice(3, 5);

  const StatCard = ({ title, average, min, max }: { title: string; average: string; min: string; max: string }) => (
    <article className="relative w-full h-full rounded overflow-hidden border border-solid border-[#18c1fe21] bg-[#0a2f4740]">
      {/* Title with icon */}
      <div className="absolute top-[16px] left-[16px] flex items-center gap-2">
        <img 
          className="w-2.5 h-2 object-cover" 
          alt="" 
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/5-3-1-4.png" 
        />
        <span className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#22bdd9] text-xs tracking-[0] leading-normal whitespace-nowrap">
          {title}
        </span>
      </div>
      
      {/* Statistics values */}
      <div className="absolute top-[44px] left-[16px] flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <span className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffff7d] text-xs tracking-[0] leading-normal whitespace-nowrap">
            平均值：{average}
          </span>
          <span className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffff7d] text-xs tracking-[0] leading-normal whitespace-nowrap">
            最小值：{min}
          </span>
        </div>
        <div className="flex items-center">
          <span className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffff7d] text-xs tracking-[0] leading-normal whitespace-nowrap">
            最大值：{max}
          </span>
        </div>
      </div>
    </article>
  );

  return (
    <section className="absolute top-[552px] left-[492px] w-[797px] h-[316px]">
      {/* Background */}
      <div className="absolute top-px left-0 w-[796px] h-[315px] bg-[#0000004a]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-[413px] h-[38px]">
        <img 
          className="absolute top-0 left-0 w-[411px] h-[38px]" 
          alt="" 
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/----3-1-5-1.png" 
        />
        <h2 className="absolute top-px left-[42px] w-[104px] h-[37px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[48px] whitespace-nowrap">
          数据统计
        </h2>
      </header>

      {/* Top row - 3 cards */}
      <div className="grid grid-cols-3 gap-[12px] absolute top-[56px] left-[12px] right-[12px] h-[88px]">
        {topRowData.map((stat) => (
          <StatCard 
            key={stat.id} 
            title={stat.title} 
            average={stat.average} 
            min={stat.min} 
            max={stat.max} 
          />
        ))}
      </div>

      {/* Bottom row - 2 cards */}
      <div className="grid grid-cols-2 gap-[12px] absolute top-[156px] left-[12px] right-[12px] h-[88px]">
        {bottomRowData.map((stat) => (
          <StatCard 
            key={stat.id} 
            title={stat.title} 
            average={stat.average} 
            min={stat.min} 
            max={stat.max} 
          />
        ))}
      </div>
    </section>
  );
};
