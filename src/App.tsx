import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appRouter } from "./router/app.router";
import { RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}

export default App;
