
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Shield, 
  Database,
  Users,
  FileUp,
  Clock
} from 'lucide-react';

const AdminSettings = () => {
  const { getSetting, updateSetting, isLoading } = useAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
    enrollmentAutoApproval: false,
    workUploadNotifications: true,
    notifyAdminsOnUpload: true,
    maxFileSizeMb: 10,
    maxFilesPerChild: 50,
    requireParentApproval: true,
    autoNotifyOnRequests: true,
    dataRetentionMonths: 24,
    archiveOldWork: false
  });

  useEffect(() => {
    if (!isLoading) {
      const enrollmentSettings = getSetting('enrollment_auto_approval') || {};
      const workNotifications = getSetting('work_upload_notifications') || {};
      const fileSettings = getSetting('file_upload_limits') || {};
      const parentSettings = getSetting('parent_child_requests') || {};
      const retentionSettings = getSetting('data_retention') || {};

      setLocalSettings(prev => ({
        ...prev,
        enrollmentAutoApproval: enrollmentSettings.enabled ?? false,
        workUploadNotifications: workNotifications.enabled ?? true,
        notifyAdminsOnUpload: workNotifications.notify_admins ?? true,
        maxFileSizeMb: fileSettings.max_size_mb ?? 10,
        maxFilesPerChild: fileSettings.max_files_per_child ?? 50,
        requireParentApproval: parentSettings.require_admin_approval ?? true,
        autoNotifyOnRequests: parentSettings.auto_notify_admins ?? true,
        dataRetentionMonths: retentionSettings.keep_completed_enrollments_months ?? 24,
        archiveOldWork: retentionSettings.archive_old_work ?? false
      }));
    }
  }, [isLoading, getSetting]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSetting('enrollment_auto_approval', {
      enabled: localSettings.enrollmentAutoApproval
    });

    updateSetting('work_upload_notifications', {
      enabled: localSettings.workUploadNotifications,
      notify_admins: localSettings.notifyAdminsOnUpload
    });

    updateSetting('file_upload_limits', {
      max_size_mb: localSettings.maxFileSizeMb,
      max_files_per_child: localSettings.maxFilesPerChild
    });

    updateSetting('parent_child_requests', {
      require_admin_approval: localSettings.requireParentApproval,
      auto_notify_admins: localSettings.autoNotifyOnRequests
    });

    updateSetting('data_retention', {
      keep_completed_enrollments_months: localSettings.dataRetentionMonths,
      archive_old_work: localSettings.archiveOldWork
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Platform Settings</h2>
          <p className="text-black">
            Configure platform behavior and policies
          </p>
        </div>

        <Tabs defaultValue="enrollment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-black">
            <TabsTrigger value="enrollment" className="text-black">
              <Users className="h-4 w-4 mr-2" />
              Enrollment
            </TabsTrigger>
            <TabsTrigger value="uploads" className="text-black">
              <FileUp className="h-4 w-4 mr-2" />
              File Uploads
            </TabsTrigger>
            <TabsTrigger value="security" className="text-black">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="data" className="text-black">
              <Database className="h-4 w-4 mr-2" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-black">
              <Monitor className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Enrollment Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-approve Enrollments</Label>
                    <p className="text-sm text-black">
                      Automatically approve new program enrollments without admin review
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enrollmentAutoApproval}
                    onCheckedChange={(checked) => handleSettingChange('enrollmentAutoApproval', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Parent-Child Approval</Label>
                    <p className="text-sm text-black">
                      Require admin approval for parent-child association requests
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.requireParentApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireParentApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-notify on Requests</Label>
                    <p className="text-sm text-black">
                      Send notifications to admins for new association requests
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoNotifyOnRequests}
                    onCheckedChange={(checked) => handleSettingChange('autoNotifyOnRequests', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">File Upload Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxFileSize" className="text-black">Maximum File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="100"
                      value={localSettings.maxFileSizeMb}
                      onChange={(e) => handleSettingChange('maxFileSizeMb', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFiles" className="text-black">Max Files per Child</Label>
                    <Input
                      id="maxFiles"
                      type="number"
                      min="1"
                      max="200"
                      value={localSettings.maxFilesPerChild}
                      onChange={(e) => handleSettingChange('maxFilesPerChild', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Upload Notifications</Label>
                    <p className="text-sm text-black">
                      Send notifications when kids work is uploaded
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.workUploadNotifications}
                    onCheckedChange={(checked) => handleSettingChange('workUploadNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Notify Admins on Upload</Label>
                    <p className="text-sm text-black">
                      Also notify admins when new work is uploaded
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.notifyAdminsOnUpload}
                    onCheckedChange={(checked) => handleSettingChange('notifyAdminsOnUpload', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Security & Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-black">Session Timeout</Label>
                  <p className="text-sm text-black mb-2">
                    Automatically log out users after inactivity
                  </p>
                  <Select defaultValue="24h">
                    <SelectTrigger className="bg-white text-black border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-black" />

                <div>
                  <Label className="text-black">Password Requirements</Label>
                  <p className="text-sm text-black mb-2">
                    Minimum password strength requirements
                  </p>
                  <Select defaultValue="medium">
                    <SelectTrigger className="bg-white text-black border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basic (8+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, numbers)</SelectItem>
                      <SelectItem value="high">Strong (8+ chars, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="retentionPeriod" className="text-black">
                    Keep Completed Enrollments (months)
                  </Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.dataRetentionMonths}
                    onChange={(e) => handleSettingChange('dataRetentionMonths', parseInt(e.target.value))}
                    className="bg-white text-black border-black"
                  />
                  <p className="text-sm text-black mt-1">
                    How long to keep enrollment data after program completion
                  </p>
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-archive Old Work</Label>
                    <p className="text-sm text-black">
                      Automatically archive kids work after retention period
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.archiveOldWork}
                    onCheckedChange={(checked) => handleSettingChange('archiveOldWork', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">
                      Data Export Available
                    </span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    Export platform data before making retention changes
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                    Export Data
                  </Button>
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
                enrollmentAutoApproval: false,
                workUploadNotifications: true,
                notifyAdminsOnUpload: true,
                maxFileSizeMb: 10,
                maxFilesPerChild: 50,
                requireParentApproval: true,
                autoNotifyOnRequests: true,
                dataRetentionMonths: 24,
                archiveOldWork: false
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
