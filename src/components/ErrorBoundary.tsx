import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <pre className="max-w-xl whitespace-pre-wrap text-sm opacity-70">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={this.reload}
            className="rounded border px-4 py-2 text-sm"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
