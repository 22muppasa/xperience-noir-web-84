
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "customer")) {
      navigate("/auth");
    }
  }, [user, profile, loading, navigate]);

  // Don't render dashboard while loading or if user/profile is missing
  if (loading || !profile) return null;

  return (
    <div className="container py-12 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">
            Welcome, {profile.full_name || profile.email}!
          </div>
          <div className="text-muted-foreground">
            <p>Your role: <span className="font-bold text-primary">Customer</span></p>
            <p className="text-sm mt-1">You are not able to change your role.</p>
          </div>
          {/* Future features for customers to be implemented here */}
        </CardContent>
      </Card>
    </div>
  );
};
export default Dashboard;
