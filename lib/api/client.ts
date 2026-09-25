import { API_BASE_URL } from '@/lib/config';
import { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  public status: number;
  public errors: string[];
  public responseData?: unknown;

  constructor(status: number, message: string, errors: string[] = [], responseData?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.responseData = responseData;
  }
}

/**
 * Parses HTTP status codes and API errors into user-friendly messages
 */
export function parseApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors && error.errors.length > 0) {
      return error.errors.join(' ');
    }
    if (error.message) {
      return error.message;
    }
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized access. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested resource was not found.';
      case 409:
        return 'A conflict occurred with the current resource state.';
      case 500:
        return 'Something went wrong on the server. Please try again.';
      default:
        return `Request failed with status ${error.status}.`;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('ECONNREFUSED')) {
      return 'Unable to connect to SocialHub API. Please check that the backend is running.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

/**
 * Core HTTP request handler
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  const isJsonBody = body !== undefined && !(body instanceof FormData);
  if (isJsonBody) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = isJsonBody ? JSON.stringify(body) : (body as BodyInit);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError(
      0,
      'Unable to connect to SocialHub API. Please check that the backend is running.',
      [],
      err
    );
  }

  // Handle empty 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText || 'Request failed.',
        []
      );
    }
    return {} as T;
  }

  // ASP.NET backend wraps responses in ApiResponse<T> = { success, message, data, errors }
  const isApiResponse =
    json !== null &&
    typeof json === 'object' &&
    'success' in json &&
    'errors' in json;

  if (isApiResponse) {
    const apiResponse = json as ApiResponse<T>;
    if (!response.ok || !apiResponse.success) {
      const errorMsg =
        apiResponse.message ||
        (apiResponse.errors && apiResponse.errors.length > 0
          ? apiResponse.errors.join(' ')
          : response.statusText || 'API request failed');

      throw new ApiError(
        response.status,
        errorMsg,
        apiResponse.errors || [],
        apiResponse.data
      );
    }
    return apiResponse.data as T;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText || 'API request failed.',
      [],
      json
    );
  }

  return json as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>, init?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', params, ...init }),

  post: <T>(endpoint: string, body?: unknown, init?: RequestOptions) =>
    request<T>(endpoint, { method: 'POST', body, ...init }),

  put: <T>(endpoint: string, body?: unknown, init?: RequestOptions) =>
    request<T>(endpoint, { method: 'PUT', body, ...init }),

  delete: <T>(endpoint: string, init?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...init }),
};
