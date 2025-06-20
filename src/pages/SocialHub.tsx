// src/pages/SocialHub.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminSocialPosts from "./pages/admin/SocialPosts";
import SocialFeed from '@/components/ui/SocialFeed';    // your public feed

const SocialHub: React.FC = () => {
  const { user } = useAuth();

  // If the current user is an admin, show the post management dashboard.
  // Otherwise show the public feed.
  if (user?.role === 'admin') {
    return <AdminSocialPosts />;
  }

  return <SocialFeed />;
};

export default SocialHub;
