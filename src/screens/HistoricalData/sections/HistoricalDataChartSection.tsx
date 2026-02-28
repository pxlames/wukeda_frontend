import { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import { HistoryDataResponse } from '../../../types/history.types';
import { DEVICE_HISTORY_PARAMETERS } from '../../../config/historyParams.config';
import { DeviceType } from '../../../types/device.types';

interface HistoricalDataChartSectionProps {
  historyData: HistoryDataResponse | null;
  queryParams: {
    deviceType: DeviceType;
    deviceId: string;
    deviceName: string;
    timeLength: number;
    dataCount: number;
    parameters: string[];
  } | null;
  loading: boolean;
  error: string | null;
}

export const HistoricalDataChartSection = ({
  historyData,
  queryParams,
  loading,
  error,
}: HistoricalDataChartSectionProps): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 生成图例数据
  const legendData = useMemo(() => {
    if (!queryParams || !historyData) return [];

    const paramConfig = DEVICE_HISTORY_PARAMETERS[queryParams.deviceType] || [];
    
    return queryParams.parameters
      .map(paramId => {
        const config = paramConfig.find(p => p.id === paramId);
        return config ? {
          name: config.unit ? `${config.label}(${config.unit})` : config.label,
          paramId,
        } : null;
      })
      .filter(Boolean) as { name: string; paramId: string }[];
  }, [queryParams, historyData]);

  // 准备图表数据
  const chartData = useMemo(() => {
    if (!historyData || !queryParams) return null;

    const { timeseries } = historyData;
    const { parameters } = queryParams;

    // 获取所有时间戳（使用第一个参数的时间戳作为基准）
    const firstParam = parameters[0];
    const timeData = timeseries[firstParam]?.map(point => point.ts) || [];

    // 为每个参数准备数据系列
    const series = parameters.map((paramId, index) => {
      const paramData = timeseries[paramId] || [];
      const values = timeData.map(ts => {
        const point = paramData.find(p => p.ts === ts);
        return point ? Number(point.value) : null;
      });

      // 颜色配置
      const colors = [
        '#2174ff', '#3cb1fb', '#07a872', '#d29e08', '#ff6b6b', 
        '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#34495e'
      ];

      const legend = legendData[index];

      return {
        name: legend?.name || paramId,
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: colors[index % colors.length],
        },
        itemStyle: {
          color: colors[index % colors.length],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${colors[index % colors.length]}40` },
            { offset: 1, color: `${colors[index % colors.length]}10` },
          ]),
        },
      };
    });

    return {
      timeData,
      series,
    };
  }, [historyData, queryParams, legendData]);

  // 初始化和更新图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 如果没有数据，显示空状态
    if (!chartData || !chartData.timeData.length) {
      chart.setOption({
        title: {
          text: loading ? '加载中...' : error ? `错误: ${error}` : '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#ffffffcc',
            fontSize: 16,
          },
        },
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      });
      return;
    }

    // 格式化时间戳为可读格式
    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // 配置图表选项（有数据时需显式隐藏空状态标题，避免与上次 setOption 合并时残留「暂无数据」）
    const option: echarts.EChartsOption = {
      title: { show: false },
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 47, 71, 0.9)',
        borderColor: '#61afc2',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#0a2f47',
          },
        },
      },
      legend: {
        data: legendData.map(l => l.name),
        top: 10,
        textStyle: {
          color: '#ffffffcc',
          fontSize: 12,
        },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: '50px',
        right: '30px',
        top: '50px',
        bottom: '40px',
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.timeData.map(formatTime),
        axisLine: {
          lineStyle: {
            color: '#ffffff40',
          },
        },
        axisLabel: {
          color: '#ffffffcc',
          fontSize: 11,
          rotate: 0,
          interval: Math.floor(chartData.timeData.length / 8), // 显示约8个标签
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#ffffffcc',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: '#ffffff1a',
            type: 'dashed',
          },
        },
      },
      series: chartData.series,
    };

    chart.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData, loading, error, legendData]);

  // 清理图表实例
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <section className="absolute top-[62px] left-[492px] w-[797px] h-[469px]">
      <div className="absolute top-0.5 left-0 w-[797px] h-[467px] bg-[#0000004a]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-[415px] h-[38px]">
        <img
          className="h-[38px] absolute top-0 left-0 w-[413px]"
          alt=""
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/----3-1-5.png"
        />
        <h2 className="absolute top-px left-[42px] w-[105px] h-[37px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[48px] whitespace-nowrap">
          数据趋势图
        </h2>
      </header>

      {/* Chart container */}
      <div 
        ref={chartRef}
        className="absolute top-[50px] left-[20px] w-[757px] h-[400px]"
        style={{ zIndex: 1 }}
      />
    </section>
  );
};
