import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Investments } from "./components/Investments";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Investment Tracker</h1>
          <Investments />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
