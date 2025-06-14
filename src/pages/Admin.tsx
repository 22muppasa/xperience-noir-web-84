
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      navigate("/auth");
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div>Welcome, {profile?.full_name || profile?.email}!</div>
      {/* TODO: Add options for uploading projects, viewing customers, viewing contact messages, making social posts, messaging system, uploading kids work, etc. */}
    </div>
  );
};
export default Admin;
