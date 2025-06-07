import React, { Component } from 'react'
import { ApiErrorType } from '../lib/api-client'
import type { ErrorInfo, ReactNode } from 'react'
import type { ApiError } from '../lib/api-client'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | ApiError | null
}

class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error | ApiError): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error | ApiError, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // Check if it's an API error
      const isApiError = 'type' in this.state.error!

      if (isApiError) {
        const apiError = this.state.error as ApiError

        // Handle specific API error types
        switch (apiError.type) {
          case ApiErrorType.AUTHENTICATION_ERROR:
            return (
              <div className="p-4 rounded-md bg-red-100 text-red-800">
                <h3 className="text-lg font-semibold">Authentication Error</h3>
                <p>{apiError.message}</p>
                <button
                  className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md"
                  onClick={() => (window.location.href = '/auth/login')}
                >
                  Go to Login
                </button>
              </div>
            )

          case ApiErrorType.FORBIDDEN:
            return (
              <div className="p-4 rounded-md bg-orange-100 text-orange-800">
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p>{apiError.message}</p>
                <button
                  className="mt-4 px-4 py-2 bg-orange-700 text-white rounded-md"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
              </div>
            )

          case ApiErrorType.NOT_FOUND:
            return (
              <div className="p-4 rounded-md bg-gray-100 text-gray-800">
                <h3 className="text-lg font-semibold">Not Found</h3>
                <p>{apiError.message}</p>
                <button
                  className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md"
                  onClick={() => (window.location.href = '/')}
                >
                  Go to Home
                </button>
              </div>
            )

          default:
            return (
              <div className="p-4 rounded-md bg-red-100 text-red-800">
                <h3 className="text-lg font-semibold">Error</h3>
                <p>{apiError.message}</p>
                <button
                  className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )
        }
      }

      // Generic error fallback
      return (
        this.props.fallback || (
          <div className="p-4 rounded-md bg-red-100 text-red-800">
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p>{this.state.error?.message || 'Unknown error'}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-700 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Hook wrapper for the error boundary to use hooks
export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />
}
