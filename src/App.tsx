import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appRouter } from "./router/app.router";
import { RouterProvider } from "react-router-dom";
import { CheckAuthProvider } from "./auth/providers/CheckAuthProvider";
import { Toaster } from "./components/ui/toast";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CheckAuthProvider>
      <RouterProvider router={appRouter} />
      </CheckAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
