"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = process.env.NODE_ENV === "development";

      return (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <div className="max-w-md w-full">
            {/* macOS-style warning icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Error message */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The content couldn&apos;t be displayed. This might be due to a formatting issue or corrupted data.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>

            {/* Error details (dev mode only) */}
            {isDev && this.state.error && (
              <details className="mt-6 text-xs font-mono">
                <summary className="cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 select-none mb-2">
                  🔧 Developer Info
                </summary>
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="text-red-600 dark:text-red-400 font-semibold mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <pre className="text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap break-words">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
