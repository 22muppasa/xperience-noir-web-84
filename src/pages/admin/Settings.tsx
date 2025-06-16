
import React, { useState, useEffect } from 'react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
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
  const { getSetting, updateSetting, isLoading } = useAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
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

  // Load settings from database when available
  useEffect(() => {
    if (!isLoading) {
      const userRegistration = getSetting('user_registration') || {};
      const emailNotifications = getSetting('email_notifications') || {};
      const systemMaintenance = getSetting('system_maintenance') || {};
      const fileStorage = getSetting('file_storage') || {};

      setLocalSettings(prev => ({
        ...prev,
        allowRegistration: userRegistration.enabled ?? true,
        requireEmailVerification: userRegistration.require_approval ?? false,
        enableNotifications: emailNotifications.enabled ?? true,
        maintenanceMode: systemMaintenance.enabled ?? false,
        maxFileSize: fileStorage.max_size_mb?.toString() || '10',
        allowedFileTypes: fileStorage.allowed_types?.join(',') || 'jpg,png,gif,pdf,doc,docx'
      }));
    }
  }, [isLoading, getSetting]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Update database settings
    updateSetting('user_registration', {
      enabled: localSettings.allowRegistration,
      require_approval: localSettings.requireEmailVerification
    });

    updateSetting('email_notifications', {
      enabled: localSettings.enableNotifications,
      from_email: localSettings.smtpUsername
    });

    updateSetting('system_maintenance', {
      enabled: localSettings.maintenanceMode,
      message: 'System under maintenance'
    });

    updateSetting('file_storage', {
      max_size_mb: parseInt(localSettings.maxFileSize),
      allowed_types: localSettings.allowedFileTypes.split(',').map(t => t.trim())
    });
  };

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
                      value={localSettings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription" className="text-black">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={localSettings.siteDescription}
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
                      checked={localSettings.allowRegistration}
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
                      checked={localSettings.maintenanceMode}
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
                      checked={localSettings.enableNotifications}
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
                    checked={localSettings.requireEmailVerification}
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
                      value={localSettings.smtpServer}
                      onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort" className="text-black">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      placeholder="587"
                      value={localSettings.smtpPort}
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
                      value={localSettings.smtpUsername}
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
                      value={localSettings.smtpPassword}
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
                    value={localSettings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                    className="bg-white text-black border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="allowedFileTypes" className="text-black">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    placeholder="jpg,png,gif,pdf,doc,docx"
                    value={localSettings.allowedFileTypes}
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
                    checked={localSettings.enableBackups}
                    onCheckedChange={(checked) => handleSettingChange('enableBackups', checked)}
                  />
                </div>

                <div>
                  <Label className="text-black">Backup Frequency</Label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md bg-white text-black border-black"
                    value={localSettings.backupFrequency}
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
              setLocalSettings({
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
