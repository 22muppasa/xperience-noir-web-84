
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { User, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    emergencyContact: ''
  });

  // Calculate profile completion percentage
  const calculateCompletion = (data: ProfileData): number => {
    const fields = [
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.address,
      data.emergencyContact
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion(profileData);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setProfileData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: '', // We'll need to add this field to profiles table later
            emergencyContact: '' // We'll need to add this field to profiles table later
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [user?.id, user?.email, toast]);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          // Note: address and emergencyContact would need to be added to the profiles table
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to save profile changes.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Profile</h1>
            <p className="text-black">Manage your account information</p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            disabled={loading}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Profile Completion */}
        <Card className="bg-white border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-black">Profile Completion</h3>
                <p className="text-black text-sm">Complete your profile for better service</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-black">{completionPercentage}%</div>
                <Progress 
                  value={completionPercentage} 
                  className="w-24 h-2 mt-2 [&>div]:bg-black" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information - Full Width */}
        <Card className="bg-white border-black">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <User className="h-5 w-5 mr-2 text-black" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-black">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="bg-white text-black border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-black">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-black">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-100 text-black border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-black">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="bg-white text-black border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-black">Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
                rows={2}
                className="bg-white text-black border-gray-300"
                placeholder="Address field will be available after database update"
              />
              <p className="text-xs text-gray-500 mt-1">Note: Address storage will be added to the database soon</p>
            </div>

            <div>
              <Label htmlFor="emergency" className="text-black">Emergency Contact</Label>
              <Input
                id="emergency"
                value={profileData.emergencyContact}
                onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                disabled={!isEditing}
                className="bg-white text-black border-gray-300"
                placeholder="Emergency contact will be available after database update"
              />
              <p className="text-xs text-gray-500 mt-1">Note: Emergency contact storage will be added to the database soon</p>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Card className="bg-white border-black">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Button onClick={handleSave} className="flex-1" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1" disabled={loading}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
