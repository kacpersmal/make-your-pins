import axios from 'axios'
import { QueryClient } from '@tanstack/react-query'
import { auth } from './firebase-config'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

// Initialize QueryClient for potential use with React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response.status < 500
        ) {
          return false
        }
        // Exponential backoff for retries, max 3 retries
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff with max 30s
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: 'always', // Auto refresh data when window regains focus
      refetchOnReconnect: true, // Auto refresh when reconnecting
      keepPreviousData: true, // Keep old data while fetching new data
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

// Error types
export enum ApiErrorType {
  NETWORK_ERROR = 'network_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  VALIDATION_ERROR = 'validation_error',
  SERVER_ERROR = 'server_error',
  NOT_FOUND = 'not_found',
  FORBIDDEN = 'forbidden',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface ApiError {
  type: ApiErrorType
  message: string
  statusCode?: number
  details?: unknown
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

    // Create Axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 15000, // 15 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor - add authorization token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Skip adding token for public endpoints
        const isPublicEndpoint =
          (config.url?.includes('/health') ||
            config.url?.endsWith('/assets')) &&
          config.method?.toLowerCase() === 'get'

        if (isPublicEndpoint) {
          return config
        }

        // Add auth token
        const token = await this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(this.normalizeError(error)),
    )

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Handle token expiration
        if (
          error.response?.status === 401 &&
          error.response?.data?.message?.includes('Token expired') &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          const token = await this.refreshToken()
          originalRequest.headers.Authorization = `Bearer ${token}`
          return this.axiosInstance(originalRequest)
        }

        return Promise.reject(this.normalizeError(error))
      },
    )
  }

  // Get a valid auth token, refreshing if necessary
  private async getAuthToken(): Promise<string | null> {
    const currentUser = auth.currentUser
    if (!currentUser) return null

    try {
      return await currentUser.getIdToken(false) // Don't force refresh
    } catch (error) {
      console.warn('Error getting token, will try to refresh:', error)
      return this.refreshToken()
    }
  }

  // Force refresh the Firebase auth token
  private async refreshToken(): Promise<string> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    // If already refreshing, return the existing promise
    if (this.isRefreshing) {
      return new Promise<string>((resolve) => {
        this.refreshSubscribers.push(resolve)
      })
    }

    this.isRefreshing = true

    try {
      const token = await currentUser.getIdToken(true) // Force refresh

      // Notify subscribers about the new token
      this.refreshSubscribers.forEach((callback) => callback(token))
      this.refreshSubscribers = []

      return token
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // Force sign out on unrecoverable auth errors
      await auth.signOut()
      throw new Error('Authentication failed. Please sign in again.')
    } finally {
      this.isRefreshing = false
    }
  }

  // Normalize different error types into a consistent format
  private normalizeError(error: AxiosError | Error): ApiError {
    if (axios.isAxiosError(error)) {
      // Network errors
      if (error.code === 'ECONNABORTED' || !error.response) {
        return {
          type: ApiErrorType.NETWORK_ERROR,
          message: 'Network error. Please check your connection.',
          details: error.message,
        }
      }

      // Server errors
      const statusCode = error.response.status
      switch (statusCode) {
        case 401:
          return {
            type: ApiErrorType.AUTHENTICATION_ERROR,
            message: 'Authentication failed. Please sign in again.',
            statusCode,
            details: error.response.data,
          }
        case 403:
          return {
            type: ApiErrorType.FORBIDDEN,
            message: 'You do not have permission to perform this action.',
            statusCode,
            details: error.response.data,
          }
        case 404:
          return {
            type: ApiErrorType.NOT_FOUND,
            message: 'The requested resource was not found.',
            statusCode,
            details: error.response.data,
          }
        case 422:
          return {
            type: ApiErrorType.VALIDATION_ERROR,
            message: 'Validation error. Please check your input.',
            statusCode,
            details: error.response.data,
          }
        default:
          if (statusCode >= 500) {
            return {
              type: ApiErrorType.SERVER_ERROR,
              message: 'Server error. Please try again later.',
              statusCode,
              details: error.response.data,
            }
          }
          return {
            type: ApiErrorType.UNKNOWN_ERROR,
            message: 'An unexpected error occurred.',
            statusCode,
            details: error.response.data,
          }
      }
    }

    // Generic error
    return {
      type: ApiErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unknown error occurred',
      details: error,
    }
  }

  // Generic request method with type safety
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> =
        await this.axiosInstance.request(config)
      return response.data
    } catch (error) {
      throw this.normalizeError(error as Error)
    }
  }

  // Convenience methods for common HTTP verbs
  public async get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params })
  }

  public async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data })
  }

  public async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data })
  }

  public async delete<T = any>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url })
  }

  // Method to invalidate React Query cache for a specific key or pattern
  public invalidateQueries(queryKey: Array<unknown>) {
    return queryClient.invalidateQueries({ queryKey })
  }

  // Method to clear the entire cache
  public clearCache() {
    return queryClient.clear()
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()

export default apiClient
