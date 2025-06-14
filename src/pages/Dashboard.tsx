
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "customer")) {
      navigate("/auth");
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <div>Welcome, {profile?.full_name || profile?.email}!</div>
      {/* TODO: Add camp signup, kids work gallery, messages, profile actions */}
    </div>
  );
};
export default Dashboard;
