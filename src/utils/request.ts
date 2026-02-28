/**
 * HTTP 请求工具
 * 封装统一的请求方法，处理认证、错误等
 */

import { apiConfig } from '../config/api.config';

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
   * 获取认证 Token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * 设置认证 Token
   */
  public setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * 清除认证 Token
   */
  public clearAuthToken(): void {
    localStorage.removeItem('auth_token');
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
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuthToken();
        window.location.href = '/login';
        throw new Error('未授权，请重新登录');
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
  async get<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    const response = await this.fetchWithTimeout(
      fullURL,
      {
        method: 'GET',
        headers,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

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

    return this.handleResponse<T>(response);
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

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

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const fullURL = this.buildURL(url, options?.params);
    const headers = this.buildHeaders(options?.headers);
    const timeout = options?.timeout || this.timeout;

    const response = await this.fetchWithTimeout(
      fullURL,
      {
        method: 'DELETE',
        headers,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }
}

// 导出单例
export const request = new HttpClient();

export default request;
