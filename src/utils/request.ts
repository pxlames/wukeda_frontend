/**
 * HTTP 请求工具
 * 封装统一的请求方法，处理认证、错误等
 * Token 缓存：未过期则使用缓存，过期则尝试刷新（重新登录）后重试
 */

import { apiConfig, API_ENDPOINTS } from '../config/api.config';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const DEFAULT_EXPIRY_HOURS = 24;
const isSuccessCode = (code: unknown): boolean => code === 200 || code === '200';

/** 用于在 401 时识别并尝试刷新 token */
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    this.defaultHeaders = apiConfig.headers;
  }

  /**
   * 获取认证 Token（仅返回未过期的 token，与 auth.ts 逻辑一致）
   */
  private getAuthToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry, 10)) {
      this.clearAuthToken();
      return null;
    }
    return token;
  }

  /**
   * 设置认证 Token（含过期时间）
   */
  public setAuthToken(token: string, expiryHours: number = DEFAULT_EXPIRY_HOURS): void {
    localStorage.setItem(TOKEN_KEY, token);
    const expiry = Date.now() + expiryHours * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
  }

  /**
   * 清除认证 Token
   */
  public clearAuthToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /**
   * 尝试刷新 Token（重新登录），成功返回 true
   */
  private async tryRefreshToken(): Promise<boolean> {
    try {
      const path = API_ENDPOINTS.LOGIN.startsWith('/') ? API_ENDPOINTS.LOGIN : `/${API_ENDPOINTS.LOGIN}`;
      const loginUrl = this.baseURL ? `${this.baseURL.replace(/\/$/, '')}${path}` : path;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'tenant@thingsboard.org',
          password: 'tenant',
        }),
      });
      const data = await res.json().catch(() => ({}));
      const token = isSuccessCode(data?.code) ? (data?.data?.token ?? data?.token) : data?.token;
      if (token) {
        this.setAuthToken(token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  /**
   * 构建请求头
   */
  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      (headers as Record<string, string>)['X-Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 处理响应（401 时抛出 UnauthorizedError，由 get/post 等尝试刷新后重试）
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedError('未授权，请重新登录');
      }
      const errorText = await response.text();
      throw new Error(`请求失败: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return data;
  }

  /**
   * 带超时的 fetch
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, options?: RequestOptions, isRetry = false): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    try {
      const response = await this.fetchWithTimeout(
        fullURL,
        { method: 'GET', headers, ...options },
        timeout
      );
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        const isLoginRequest = url.includes('/api/auth/login');
        if (!isRetry && !isLoginRequest) {
          const ok = await this.tryRefreshToken();
          if (ok) return this.get<T>(url, options, true);
        }
        this.clearAuthToken();
        const redirect = window.location.pathname + window.location.search;
        if (redirect && redirect !== '/login') {
          sessionStorage.setItem('redirect_after_login', redirect);
        }
        window.location.href = '/login';
      }
      throw e;
    }
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions,
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    try {
      const response = await this.fetchWithTimeout(
        fullURL,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
          ...options,
        },
        timeout
      );
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        const isLoginRequest = url.includes('/api/auth/login');
        if (!isRetry && !isLoginRequest) {
          const ok = await this.tryRefreshToken();
          if (ok) return this.post<T>(url, data, options, true);
        }
        this.clearAuthToken();
        const redirect = window.location.pathname + window.location.search;
        if (redirect && redirect !== '/login') {
          sessionStorage.setItem('redirect_after_login', redirect);
        }
        window.location.href = '/login';
      }
      throw e;
    }
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions,
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    try {
      const response = await this.fetchWithTimeout(
        fullURL,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
          ...options,
        },
        timeout
      );
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        const isLoginRequest = url.includes('/api/auth/login');
        if (!isRetry && !isLoginRequest) {
          const ok = await this.tryRefreshToken();
          if (ok) return this.put<T>(url, data, options, true);
        }
        this.clearAuthToken();
        const redirect = window.location.pathname + window.location.search;
        if (redirect && redirect !== '/login') {
          sessionStorage.setItem('redirect_after_login', redirect);
        }
        window.location.href = '/login';
      }
      throw e;
    }
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, options?: RequestOptions, isRetry = false): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    try {
      const response = await this.fetchWithTimeout(
        fullURL,
        { method: 'DELETE', headers, ...options },
        timeout
      );
      return await this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        const isLoginRequest = url.includes('/api/auth/login');
        if (!isRetry && !isLoginRequest) {
          const ok = await this.tryRefreshToken();
          if (ok) return this.delete<T>(url, options, true);
        }
        this.clearAuthToken();
        const redirect = window.location.pathname + window.location.search;
        if (redirect && redirect !== '/login') {
          sessionStorage.setItem('redirect_after_login', redirect);
        }
        window.location.href = '/login';
      }
      throw e;
    }
  }
}

// 导出单例
export const request = new HttpClient();

export default request;
