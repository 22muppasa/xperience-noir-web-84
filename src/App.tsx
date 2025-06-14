
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
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerPrograms from "./pages/customer/Programs";
import CustomerKidsWork from "./pages/customer/KidsWork";
import CustomerMessages from "./pages/customer/Messages";
import CustomerProfile from "./pages/customer/Profile";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Display loader for 6 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black z-50">
                <Loader />
              </div>
            ) : (
              <BrowserRouter>
                <div className="flex flex-col min-h-screen transition-colors duration-300">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <Index />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/programs" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <Programs />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/consulting" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <Consulting />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/get-involved" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <GetInvolved />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/social-hub" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <SocialHub />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/about" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <About />
                        </div>
                        <Footer />
                      </>
                    } />
                    <Route path="/contact" element={
                      <>
                        <Navbar />
                        <div className="flex-grow pt-16 w-full">
                          <Contact />
                        </div>
                        <Footer />
                      </>
                    } />
                    
                    {/* Auth route */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected customer routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/programs" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerPrograms />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/kids-work" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerKidsWork />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/messages" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerMessages />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/profile" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerProfile />
                      </ProtectedRoute>
                    } />
                    
                    {/* Protected admin routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            )}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
