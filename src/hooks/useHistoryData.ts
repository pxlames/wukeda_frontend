/**
 * 历史数据查询 Hook
 */

import { useState, useCallback } from 'react';
import { historyService } from '../services/api.service';
import { HistoryDataResponse } from '../types/history.types';
import { DEVICE_TYPE_TO_API_PATH } from '../config/historyParams.config';
import { DeviceType } from '../types/device.types';
import { USE_HISTORY_MOCK_WHEN_ENABLED, getMockHistoryDataForDevice } from '../services/historyMockData';

interface UseHistoryDataResult {
  data: HistoryDataResponse | null;
  loading: boolean;
  error: string | null;
  fetchHistoryData: (
    deviceType: DeviceType,
    deviceId: string,
    timeLength: number,
    dataCount?: number,
    deviceName?: string
  ) => Promise<void>;
}

export const useHistoryData = (): UseHistoryDataResult => {
  const [data, setData] = useState<HistoryDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = useCallback(
    async (
      deviceType: DeviceType,
      deviceId: string,
      timeLength: number,
      dataCount: number = 100,
      deviceName: string = ''
    ) => {
      setLoading(true);
      setError(null);

      try {
        // 开发环境下，所有设备类型均使用 mock 数据便于演示
        if (USE_HISTORY_MOCK_WHEN_ENABLED) {
          const endTs = Date.now();
          const startTs = endTs - timeLength;
          const mock = getMockHistoryDataForDevice(deviceType, deviceId, deviceName, startTs, timeLength, dataCount);
          setData(mock);
          setLoading(false);
          return;
        }

        const apiPath = DEVICE_TYPE_TO_API_PATH[deviceType];
        if (!apiPath) {
          throw new Error(`不支持的设备类型: ${deviceType}`);
        }

        const response = await historyService.getHistoryData(apiPath, deviceId, {
          timeLength,
          dataCount,
        }, {
          suppressAuthRedirect: true,
        });

        setData(response);
      } catch (err: any) {
        console.error('获取历史数据失败:', err);
        setError(err.message || '获取历史数据失败');
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data,
    loading,
    error,
    fetchHistoryData,
  };
};
