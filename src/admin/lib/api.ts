import { Order, OrderStatus, BusinessSettings } from '@/lib/types';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export { ApiError };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface DashboardStats {
  totalOrders: number;
  newOrders: number;
  pickupToday: number;
  processing: number;
  outForDelivery: number;
  delivered: number;
  totalRevenue: number;
}

export const adminApi = {
  login: (username: string, password: string) => request<{ ok: true }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ authenticated: boolean }>('/api/auth/me'),

  stats: () => request<DashboardStats>('/api/admin/stats'),

  listOrders: (params: { status?: string; search?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.search) qs.set('search', params.search);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));
    return request<{ orders: Order[]; total: number }>(`/api/admin/orders?${qs.toString()}`);
  },
  updateOrder: (id: string, patch: Partial<{ status: OrderStatus; notes: string; pickup_date: string; pickup_time: string; price: number }>) =>
    request<{ ok: true }>(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteOrder: (id: string) => request<{ ok: true }>(`/api/admin/orders/${id}`, { method: 'DELETE' }),

  getSettings: () => request<BusinessSettings>('/api/settings'),
  saveSettings: (data: BusinessSettings) => request<{ ok: true }>('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
