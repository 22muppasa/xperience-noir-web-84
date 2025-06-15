
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Globe
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Kids Work Platform',
    siteDescription: 'A platform for showcasing children\'s creative work',
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxFileSize: '10',
    allowedFileTypes: 'jpg,png,gif,pdf,doc,docx',
    smtpServer: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    enableBackups: true,
    backupFrequency: 'daily'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // In a real implementation, you would create a settings table in Supabase
  // For now, we'll simulate saving to localStorage and show the structure
  const handleSave = () => {
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Load settings from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">System Settings</h2>
          <p className="text-black">
            Manage your platform configuration and monitor system health
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-black">
            <TabsTrigger value="general" className="text-black">
              <SettingsIcon className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="text-black">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="text-black">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="storage" className="text-black">
              <Database className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-black">
              <Monitor className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName" className="text-black">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription" className="text-black">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <Separator className="bg-black" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Allow New Registrations</Label>
                      <p className="text-sm text-black">
                        Allow new users to register for accounts
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Maintenance Mode</Label>
                      <p className="text-sm text-black">
                        Temporarily disable the platform for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Enable Notifications</Label>
                      <p className="text-sm text-black">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Email Verification</Label>
                    <p className="text-sm text-black">
                      Users must verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div>
                  <Label className="text-black">Session Timeout</Label>
                  <p className="text-sm text-black mb-2">
                    Automatically log out users after inactivity
                  </p>
                  <Input placeholder="24 hours" className="bg-white text-black border-black" />
                </div>

                <div>
                  <Label className="text-black">Password Policy</Label>
                  <p className="text-sm text-black mb-2">
                    Minimum password requirements
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="border-black" />
                      <span className="text-sm text-black">At least 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="border-black" />
                      <span className="text-sm text-black">Include uppercase letters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="border-black" />
                      <span className="text-sm text-black">Include numbers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpServer" className="text-black">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      placeholder="smtp.gmail.com"
                      value={settings.smtpServer}
                      onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort" className="text-black">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      placeholder="587"
                      value={settings.smtpPort}
                      onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUsername" className="text-black">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      type="email"
                      placeholder="your-email@domain.com"
                      value={settings.smtpUsername}
                      onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword" className="text-black">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      placeholder="••••••••"
                      value={settings.smtpPassword}
                      onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <Button variant="outline" className="border-black text-black hover:bg-gray-50">
                  Test Email Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Storage Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxFileSize" className="text-black">Maximum File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                    className="bg-white text-black border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="allowedFileTypes" className="text-black">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    placeholder="jpg,png,gif,pdf,doc,docx"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                    className="bg-white text-black border-black"
                  />
                  <p className="text-sm text-black mt-1">
                    Comma-separated list of allowed file extensions
                  </p>
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Enable Automatic Backups</Label>
                    <p className="text-sm text-black">
                      Automatically backup data and files
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableBackups}
                    onCheckedChange={(checked) => handleSettingChange('enableBackups', checked)}
                  />
                </div>

                <div>
                  <Label className="text-black">Backup Frequency</Label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md bg-white text-black border-black"
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <SystemMonitoring />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="border-black text-black hover:bg-gray-50"
            onClick={() => {
              setSettings({
                siteName: 'Kids Work Platform',
                siteDescription: 'A platform for showcasing children\'s creative work',
                allowRegistration: true,
                requireEmailVerification: true,
                enableNotifications: true,
                maintenanceMode: false,
                maxFileSize: '10',
                allowedFileTypes: 'jpg,png,gif,pdf,doc,docx',
                smtpServer: '',
                smtpPort: '587',
                smtpUsername: '',
                smtpPassword: '',
                enableBackups: true,
                backupFrequency: 'daily'
              });
            }}
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
