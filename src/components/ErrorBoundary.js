import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md m-4">
          <h1 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Something went wrong</h1>
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            We're sorry, but there was a problem loading this part of the page. Try refreshing the page.
          </p>
          <div className="flex space-x-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <summary className="cursor-pointer font-bold">Error Details</summary>
              <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-200 dark:bg-gray-700 rounded">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 