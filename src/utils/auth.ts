/**
 * 认证工具函数
 */

import { request } from './request';
import { API_ENDPOINTS } from '../config/api.config';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const isSuccessCode = (code: unknown): boolean => code === 200 || code === '200';

/**
 * 保存 Token
 */
export const saveToken = (token: string, expiryHours: number = 24): void => {
  localStorage.setItem(TOKEN_KEY, token);
  const expiry = Date.now() + expiryHours * 60 * 60 * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  request.setAuthToken(token, expiryHours);
};

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  // 检查是否过期
  if (Date.now() > parseInt(expiry)) {
    clearToken();
    return null;
  }

  return token;
};

/**
 * 清除 Token
 */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  request.clearAuthToken();
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * 自动登录（使用固定账号）
 */
export const autoLogin = async (): Promise<string> => {
  try {
    const response = await request.post<{ token?: string; data?: { token?: string }; code?: number; message?: string }>(
      API_ENDPOINTS.LOGIN,
      { username: 'tenant@thingsboard.org', password: 'tenant' }
    );

    const token = isSuccessCode(response.code) ? (response.data?.token ?? (response as any).token) : (response as any).token;
    if (token) {
      saveToken(token);
      return token;
    }

    throw new Error((response as any).message || '登录失败');
  } catch (error) {
    console.error('自动登录失败:', error);
    throw error;
  }
};

/**
 * 确保已认证（如果未登录则自动登录）
 */
export const ensureAuthenticated = async (): Promise<string> => {
  const token = getToken();
  
  if (token) {
    return token;
  }

  // 未登录，执行自动登录
  return await autoLogin();
};

/**
 * 登出
 */
export const logout = (): void => {
  clearToken();
  window.location.href = '/';
};
