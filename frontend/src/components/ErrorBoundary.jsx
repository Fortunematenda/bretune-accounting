import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback(this.state.error, this.handleRetry);

      const { error } = this.state;
      const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== "production";

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
          <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-900">Something went wrong</h2>
              <p className="mt-2 text-sm text-slate-600">
                An unexpected error occurred. Please try again or refresh the page.
              </p>
              {isDev && error && (
                <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                  <p className="text-xs font-medium text-red-800">{error?.message}</p>
                  {error?.stack && (
                    <pre className="mt-2 max-h-32 overflow-auto text-xs text-red-700 whitespace-pre-wrap break-words">
                      {error.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={this.handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                Refresh page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
