/**
 * API Client for PRICE Dashboard Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Include cookies for session
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// User types
export interface User {
  id: number;
  ufid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  affiliation?: string;
  active: boolean;
}

// Lab types
export interface Lab {
  id: number;
  labCode: string;
  name: string;
  description?: string;
  labAdminUserId?: number;
  labAdmin?: User;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabDto {
  labCode: string;
  name: string;
  description?: string;
  labAdminUserId?: number;
}

export interface UpdateLabDto {
  name?: string;
  description?: string;
  labAdminUserId?: number;
  active?: boolean;
}

// Study types
export interface Study {
  id: number;
  labId: number;
  lab?: Lab;
  studyCode: string;
  name: string;
  description?: string;
  irbNumber?: string;
  piUserId?: number;
  principalInvestigator?: User;
  enrollmentTarget?: number;
  startYear?: number;
  endYear?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyDto {
  labId: number;
  studyCode: string;
  name: string;
  description?: string;
  irbNumber?: string;
  piUserId?: number;
  enrollmentTarget?: number;
  startYear?: number;
  endYear?: number;
}

export interface UpdateStudyDto {
  name?: string;
  description?: string;
  irbNumber?: string;
  piUserId?: number;
  enrollmentTarget?: number;
  startYear?: number;
  endYear?: number;
  active?: boolean;
}

export interface StudyStats {
  total: number;
  screened: number;
  enrolled: number;
  active: number;
  completed: number;
  withdrawn: number;
}

// API functions
export const api = {
  // Users
  users: {
    getAll: () => fetchApi<User[]>('/users'),
    getById: (id: number) => fetchApi<User>(`/users/${id}`),
  },

  // Labs
  labs: {
    getAll: () => fetchApi<Lab[]>('/labs'),
    getById: (id: number) => fetchApi<Lab>(`/labs/${id}`),
    create: (data: CreateLabDto) => fetchApi<Lab>('/labs', { method: 'POST', body: data }),
    update: (id: number, data: UpdateLabDto) =>
      fetchApi<Lab>(`/labs/${id}`, { method: 'PUT', body: data }),
    delete: (id: number) => fetchApi<void>(`/labs/${id}`, { method: 'DELETE' }),
  },

  // Studies
  studies: {
    getAll: (labId?: number) =>
      fetchApi<Study[]>(labId ? `/studies?labId=${labId}` : '/studies'),
    getById: (id: number) => fetchApi<Study>(`/studies/${id}`),
    getStats: (id: number) => fetchApi<StudyStats>(`/studies/${id}/stats`),
    create: (data: CreateStudyDto) =>
      fetchApi<Study>('/studies', { method: 'POST', body: data }),
    update: (id: number, data: UpdateStudyDto) =>
      fetchApi<Study>(`/studies/${id}`, { method: 'PUT', body: data }),
    delete: (id: number) => fetchApi<void>(`/studies/${id}`, { method: 'DELETE' }),
  },
};

export { ApiError };
