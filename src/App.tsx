
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

// Customer Dashboard Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerPrograms from "./pages/customer/Programs";
import CustomerChildren from "./pages/customer/Children";
import CustomerKidsWork from "./pages/customer/KidsWork";
import CustomerMessages from "./pages/customer/Messages";
import CustomerProfile from "./pages/customer/Profile";

// Admin Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminChildren from "./pages/admin/Children";
import AdminPrograms from "./pages/admin/Programs";
import AdminKidsWork from "./pages/admin/KidsWork";
import AdminMessages from "./pages/admin/Messages";
import AdminSocialPosts from "./pages/admin/SocialPosts";
import AdminContactForms from "./pages/admin/ContactForms";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />

              {/* Customer Protected Routes */}
              <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/customer/programs" element={<ProtectedRoute><CustomerPrograms /></ProtectedRoute>} />
              <Route path="/customer/children" element={<ProtectedRoute><CustomerChildren /></ProtectedRoute>} />
              <Route path="/customer/kids-work" element={<ProtectedRoute><CustomerKidsWork /></ProtectedRoute>} />
              <Route path="/customer/messages" element={<ProtectedRoute><CustomerMessages /></ProtectedRoute>} />
              <Route path="/customer/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/children" element={<ProtectedRoute adminOnly><AdminChildren /></ProtectedRoute>} />
              <Route path="/admin/programs" element={<ProtectedRoute adminOnly><AdminPrograms /></ProtectedRoute>} />
              <Route path="/admin/kids-work" element={<ProtectedRoute adminOnly><AdminKidsWork /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/social-posts" element={<ProtectedRoute adminOnly><AdminSocialPosts /></ProtectedRoute>} />
              <Route path="/admin/contact-forms" element={<ProtectedRoute adminOnly><AdminContactForms /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
