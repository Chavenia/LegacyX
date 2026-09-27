import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[LegacyX ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-500 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Application Render Error
            </h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              LegacyX encountered an unexpected client-side exception while rendering dashboard components.
            </p>

            {this.state.error && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left mb-5 overflow-x-auto text-xs font-mono text-red-600">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium font-mono cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
