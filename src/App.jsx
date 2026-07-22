import { Component } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useThemeEffect } from "./hooks/useThemeEffect";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <h1>{this.state.error?.message}</h1>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useThemeEffect();

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;