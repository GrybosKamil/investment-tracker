import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { InvestmentTypes } from "./components/InvestmentTypes";
import { Investments } from "./components/Investments";
import { setDbUri } from "./axiosConfig";

const queryClient = new QueryClient();

export default function App() {
  const [dbUri, setDbUriState] = useState("");
  const [isDbUriSet, setIsDbUriSet] = useState(false);

  const handleSetDbUri = () => {
    setDbUri(dbUri);
    setIsDbUriSet(true);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Investment Tracker</h1>
          <div>
            <label>
              Database URI:
              <input
                type="text"
                value={dbUri}
                onChange={(e) => setDbUriState(e.target.value)}
              />
            </label>
            <button onClick={handleSetDbUri}>Set Database URI</button>
          </div>
          {isDbUriSet ? (
            <>
              <InvestmentTypes />
              <Investments />
            </>
          ) : (
            <p>Please set the database URI to continue.</p>
          )}
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
