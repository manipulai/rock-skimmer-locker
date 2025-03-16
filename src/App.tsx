import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Rocks from "./pages/Rocks";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import DevControls from "./components/DevControls";
import { AdminProvider } from "./contexts/AdminContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rocks" element={<Rocks />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <DevControls />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
