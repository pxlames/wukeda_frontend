import { useMemo } from 'react';
import { HistoryDataResponse } from '../../../types/history.types';
import { DEVICE_HISTORY_PARAMETERS } from '../../../config/historyParams.config';
import { DeviceType } from '../../../types/device.types';

interface AlertInfoSectionProps {
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

export const AlertInfoSection = ({
  historyData,
  queryParams,
}: AlertInfoSectionProps): JSX.Element => {
  // 根据实际数据生成表格数据和表头
  const { tableHeaders, tableData } = useMemo(() => {
    if (!historyData || !queryParams || queryParams.parameters.length === 0) {
      return { tableHeaders: [], tableData: [] };
    }

    const paramConfig = DEVICE_HISTORY_PARAMETERS[queryParams.deviceType] || [];
    const { timeseries } = historyData;

    // 生成表头
    const headers = queryParams.parameters.map(paramId => {
      const config = paramConfig.find(p => p.id === paramId);
      return {
        id: paramId,
        label: config?.label || paramId,
        unit: config?.unit || '',
      };
    });

    // 获取第一个参数的时间序列作为基准
    const firstParam = queryParams.parameters[0];
    const timePoints = timeseries[firstParam] || [];

    // 生成表格数据（最多显示12行）
    const rows = timePoints.slice(0, 12).map(point => {
      const time = new Date(point.ts);
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      
      const rowData: Record<string, string> = {
        time: `${hours}:${minutes}`,
      };

      // 为每个参数获取对应时间点的值
      queryParams.parameters.forEach(paramId => {
        const paramData = timeseries[paramId] || [];
        const dataPoint = paramData.find(p => p.ts === point.ts);
        rowData[paramId] = dataPoint ? String(dataPoint.value) : '';
      });

      return rowData;
    });

    return { tableHeaders: headers, tableData: rows };
  }, [historyData, queryParams]);

  return (
    <section className="absolute top-[429px] left-[1306px] w-[413px] h-[438px]" aria-labelledby="alert-info-title">
      <div className="absolute top-0 left-0 w-[413px] h-[438px] bg-[#0000004a] overflow-hidden">
        <header className="absolute top-0 left-0 w-[415px] h-[39px]">
          <img className="absolute top-0 left-0 w-[413px] h-[38px]" alt="" src="https://c.animaapp.com/mlfetkekTcDg2Q/img/----3-1-3-1.png" />
          <h2 id="alert-info-title" className="absolute top-0.5 left-[42px] w-[105px] h-[37px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[48px] whitespace-nowrap">
            详细信息
          </h2>
        </header>

        <div className="absolute top-[39px] left-6 w-[365px] h-[399px] overflow-hidden">
          {/* 表头 */}
          <div className="flex w-[374px] items-center justify-start gap-2 px-2 py-0 absolute top-4 left-0 bg-[#0b232d36] overflow-hidden">
            <div className="relative flex items-center justify-center w-12 h-[34px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#0db8db] text-sm tracking-[0] leading-[48px] whitespace-nowrap">
              时间
            </div>
            {tableHeaders.map((header) => (
              <div 
                key={header.id}
                className="relative flex items-center justify-center flex-1 h-[34px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#0db8db] text-sm tracking-[0] leading-[48px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={header.unit ? `${header.label}(${header.unit})` : header.label}
              >
                {header.unit ? `${header.label}(${header.unit})` : header.label}
              </div>
            ))}
          </div>

          {/* 表格数据 */}
          {tableData.length > 0 ? (
            <>
              {/* 时间列 */}
              <div className="flex flex-col w-12 items-center justify-center gap-4 p-px absolute top-[58px] left-2">
                {tableData.map((row, index) => (
                  <div key={index} className="relative flex items-center justify-center self-stretch h-[17px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[48px] whitespace-nowrap">
                    {row.time}
                  </div>
                ))}
              </div>

              {/* 数据列 */}
              {tableHeaders.map((header, colIndex) => {
                const leftPosition = 60 + colIndex * 90; // 动态计算列位置
                return (
                  <div 
                    key={header.id}
                    className="flex flex-col w-20 items-center justify-center gap-4 p-px absolute top-[58px]"
                    style={{ left: `${leftPosition}px` }}
                  >
                    {tableData.map((row, rowIndex) => (
                      <div key={rowIndex} className="relative flex items-center justify-center self-stretch h-[17px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-white text-xs text-center leading-[48px] whitespace-nowrap font-normal tracking-[0] overflow-hidden text-ellipsis">
                        {row[header.id] || ''}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#ffffff7d] text-sm">
              暂无数据
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
