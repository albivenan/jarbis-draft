/**
 * API utilities with error handling
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[] | Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: string[] | Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get CSRF token from meta tag
 */
function getCsrfToken(): string {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (!token) {
    throw new Error('CSRF token not found');
  }
  return token;
}

/**
 * Make an API request with error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'same-origin', // Important for session-based authentication
    });

    // Parse response
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (e) {
      throw new ApiError(
        'Respons server tidak valid',
        response.status
      );
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP Error: ${response.status}`,
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Unknown errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
    );
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': getCsrfToken(),
    },
  });
}

/**
 * Handle API error and return user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui';
}

/**
 * Format validation errors from API response
 */
export function formatApiErrors(errors?: string[] | Record<string, string[]>): string {
  if (!errors) {
    return '';
  }

  if (Array.isArray(errors)) {
    return errors.join('\n');
  }

  // Handle object of field errors
  return Object.entries(errors)
    .map(([field, messages]) => {
      if (Array.isArray(messages)) {
        return messages.join('\n');
      }
      return messages;
    })
    .join('\n');
}
