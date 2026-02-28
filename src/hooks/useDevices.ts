/**
 * 设备数据获取 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { Device } from '../types/device.types';
import { deviceService } from '../services/api.service';
import { ensureAuthenticated } from '../utils/auth';

interface UseDevicesOptions {
  floor?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // 毫秒
}

interface UseDevicesResult {
  devices: Device[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * 使用设备数据的 Hook
 */
export const useDevices = (options: UseDevicesOptions = {}): UseDevicesResult => {
  const {
    floor,
    autoRefresh = true,
    refreshInterval = 60000, // 默认 1 分钟
  } = options;

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取设备数据
   */
  const fetchDevices = useCallback(async () => {
    try {
      setError(null);
      
      // 确保已认证
      await ensureAuthenticated();

      // 获取设备列表
      const deviceList = await deviceService.getAllDevices(floor);
      setDevices(deviceList);
    } catch (err) {
      // 如果是404错误（楼层没有设备），不显示错误，只是设置空数组
      if (err instanceof Error && err.message.includes('404')) {
        console.log(`楼层 ${floor || '全部'} 暂无设备`);
        setDevices([]);
        setError(null);
      } else {
        const errorMessage = err instanceof Error ? err.message : '获取设备数据失败';
        setError(errorMessage);
        console.error('获取设备数据失败:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [floor]);

  /**
   * 手动刷新
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchDevices();
  }, [fetchDevices]);

  // 初始加载
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = setInterval(() => {
      fetchDevices();
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, fetchDevices]);

  return {
    devices,
    loading,
    error,
    refresh,
  };
};
