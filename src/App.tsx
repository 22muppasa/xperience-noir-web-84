
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Portfolio from "./pages/Portfolio";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Impact from "./pages/Impact";
import SocialHub from "./pages/SocialHub";
import Consulting from "./pages/Consulting";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminChildren from "./pages/admin/Children";
import AdminPrograms from "./pages/admin/Programs";
import AdminKidsWork from "./pages/admin/KidsWork";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminMessages from "./pages/admin/Messages";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminSocialPosts from "./pages/admin/SocialPosts";
import AdminContactForms from "./pages/admin/ContactForms";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/customers" element={
                <ProtectedRoute>
                  <AdminCustomers />
                </ProtectedRoute>
              } />
              <Route path="/admin/children" element={
                <ProtectedRoute>
                  <AdminChildren />
                </ProtectedRoute>
              } />
              <Route path="/admin/programs" element={
                <ProtectedRoute>
                  <AdminPrograms />
                </ProtectedRoute>
              } />
              <Route path="/admin/kids-work" element={
                <ProtectedRoute>
                  <AdminKidsWork />
                </ProtectedRoute>
              } />
              <Route path="/admin/volunteers" element={
                <ProtectedRoute>
                  <AdminVolunteers />
                </ProtectedRoute>
              } />
              <Route path="/admin/messages" element={
                <ProtectedRoute>
                  <AdminMessages />
                </ProtectedRoute>
              } />
              <Route path="/admin/portfolio" element={
                <ProtectedRoute>
                  <AdminPortfolio />
                </ProtectedRoute>
              } />
              <Route path="/admin/social-posts" element={
                <ProtectedRoute>
                  <AdminSocialPosts />
                </ProtectedRoute>
              } />
              <Route path="/admin/contact-forms" element={
                <ProtectedRoute>
                  <AdminContactForms />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Redirects for old customer routes */}
              <Route path="/customer/*" element={<Navigate to="/admin" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
