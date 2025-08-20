
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
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Blog from "./pages/Blog";
import SocialHub from "./pages/SocialHub";
import Consulting from "./pages/Consulting";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminPrograms from "./pages/admin/Programs";
import AdminEnrollments from "./pages/admin/Enrollments";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminMessages from "./pages/admin/Messages";
import AdminSocialPosts from "./pages/admin/SocialPosts";
import AdminContactForms from "./pages/admin/ContactForms";
import AdminPortfolio from "./pages/admin/Portfolio";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/social-hub" element={<Navigate to="/social" replace />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/login" element={<Login />} />

              {/* Redirect old customer routes to admin */}
              <Route path="/customer/*" element={<Navigate to="/admin" replace />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/programs" element={<ProtectedRoute><AdminPrograms /></ProtectedRoute>} />
              <Route path="/admin/enrollments" element={<ProtectedRoute><AdminEnrollments /></ProtectedRoute>} />
              <Route path="/admin/volunteers" element={<ProtectedRoute><AdminVolunteers /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/social-posts" element={<ProtectedRoute><AdminSocialPosts /></ProtectedRoute>} />
              <Route path="/admin/contact-forms" element={<ProtectedRoute><AdminContactForms /></ProtectedRoute>} />
              <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
