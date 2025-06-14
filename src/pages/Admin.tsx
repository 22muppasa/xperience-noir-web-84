
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Admin = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      navigate("/auth");
    }
  }, [user, profile, loading, navigate]);

  // Don't render dashboard while loading or if user/profile is missing
  if (loading || !profile) return null;

  return (
    <div className="container py-12 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">
            Welcome, {profile.full_name || profile.email}!
          </div>
          <div className="text-muted-foreground">
            <p>Your role: <span className="font-bold text-primary">Admin</span></p>
            <p className="text-sm mt-1">Role assignment can only be set via the database. No user is able to change roles within the app.</p>
          </div>
          {/* Future features for admins to be implemented here */}
        </CardContent>
      </Card>
    </div>
  );
};
export default Admin;
