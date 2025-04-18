import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { InvestmentsContext } from "./components/InvestmentsContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
          <div>
            <h1>Investment Tracker</h1>
            <InvestmentsContext />
          </div>
        </PrimeReactProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
