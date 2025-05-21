
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import Consulting from "./pages/Consulting";
import GetInvolved from "./pages/GetInvolved";
import SocialHub from "./pages/SocialHub";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for 6 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {loading ? (
            <Loader />
          ) : (
            <BrowserRouter>
              <div className="transition-colors duration-300">
                <Navbar />
                <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/consulting" element={<Consulting />} />
                    <Route path="/get-involved" element={<GetInvolved />} />
                    <Route path="/social-hub" element={<SocialHub />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
