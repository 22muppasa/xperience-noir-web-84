
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Jane',
    lastName: 'Johnson',
    email: user?.email || '',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: 'John Johnson - (555) 987-6543',
    children: [
      {
        name: 'Emma Johnson',
        age: 8,
        allergies: 'None',
        medicalNotes: 'No special medical requirements'
      }
    ]
  });

  const handleSave = () => {
    // Handle saving profile changes
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Profile</h1>
            <p className="text-black">Manage your account and family information</p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
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
                <div className="text-2xl font-bold text-black">85%</div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="bg-white border-black">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <User className="h-5 w-5 mr-2 text-black" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                />
              </div>

              <div>
                <Label htmlFor="emergency" className="text-black">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  disabled={!isEditing}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card className="bg-white border-black">
            <CardHeader>
              <CardTitle className="text-black">Children Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.children.map((child, index) => (
                <div key={index} className="border border-gray-300 bg-white rounded-lg p-4 space-y-3">
                  <div>
                    <Label htmlFor={`childName${index}`} className="text-black">Child's Name</Label>
                    <Input
                      id={`childName${index}`}
                      value={child.name}
                      disabled={!isEditing}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`childAge${index}`} className="text-black">Age</Label>
                    <Input
                      id={`childAge${index}`}
                      type="number"
                      value={child.age}
                      disabled={!isEditing}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`allergies${index}`} className="text-black">Allergies</Label>
                    <Input
                      id={`allergies${index}`}
                      value={child.allergies}
                      disabled={!isEditing}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`medical${index}`} className="text-black">Medical Notes</Label>
                    <Textarea
                      id={`medical${index}`}
                      value={child.medicalNotes}
                      disabled={!isEditing}
                      rows={2}
                      className="bg-white text-black border-gray-300"
                    />
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <Button variant="outline" className="w-full">
                  Add Another Child
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <Card className="bg-white border-black">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
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
