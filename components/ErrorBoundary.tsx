import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Production-ready error handling for React applications.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Optionally reload the page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-red-950/20 border border-red-500/50 rounded-lg p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-500 font-orbitron">
                  SYSTEM ERROR
                </h1>
                <p className="text-red-400 text-sm">
                  Critical Runtime Exception Detected
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-red-500/30 rounded p-4 mb-6">
              <p className="text-red-300 text-sm mb-2 font-bold">Error Message:</p>
              <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
            </div>

            {this.state.errorInfo && (
              <details className="mb-6">
                <summary className="text-red-400 cursor-pointer hover:text-red-300 text-sm mb-2">
                  Show Stack Trace
                </summary>
                <div className="bg-black/40 border border-red-500/30 rounded p-4 mt-2">
                  <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
              >
                Reload Application
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded transition-colors"
              >
                Go Back
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                If this error persists, please check the browser console for more details
                or contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
