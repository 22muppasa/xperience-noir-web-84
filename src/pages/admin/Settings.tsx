
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
  Link,
  Clock
} from 'lucide-react';

const AdminSettings = () => {
  const { getSetting, updateSetting, isLoading } = useAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
    enrollmentAutoApproval: false,
    workUploadNotifications: true,
    notifyAdminsOnUpload: true,
    requirePublicLinks: true,
    autoVerifyLinks: false,
    allowFolderLinks: true,
    linkExpirationCheck: true,
    requireParentApproval: true,
    autoNotifyOnRequests: true,
    dataRetentionMonths: 24,
    archiveOldWork: false,
    maxChildrenPerParent: 10,
    maxWorkItemsPerChild: 100,
    maxProgramsPerSeason: 20
  });

  useEffect(() => {
    if (!isLoading) {
      const enrollmentSettings = getSetting('enrollment_auto_approval') || {};
      const workNotifications = getSetting('work_upload_notifications') || {};
      const googleDriveSettings = getSetting('google_drive_settings') || {};
      const parentSettings = getSetting('parent_child_requests') || {};
      const retentionSettings = getSetting('data_retention') || {};
      const platformLimits = getSetting('platform_limits') || {};

      setLocalSettings(prev => ({
        ...prev,
        enrollmentAutoApproval: enrollmentSettings.enabled ?? false,
        workUploadNotifications: workNotifications.enabled ?? true,
        notifyAdminsOnUpload: workNotifications.notify_admins ?? true,
        requirePublicLinks: googleDriveSettings.require_public_links ?? true,
        autoVerifyLinks: googleDriveSettings.auto_verify_links ?? false,
        allowFolderLinks: googleDriveSettings.allow_folder_links ?? true,
        linkExpirationCheck: googleDriveSettings.link_expiration_check ?? true,
        requireParentApproval: parentSettings.require_admin_approval ?? true,
        autoNotifyOnRequests: parentSettings.auto_notify_admins ?? true,
        dataRetentionMonths: retentionSettings.keep_completed_enrollments_months ?? 24,
        archiveOldWork: retentionSettings.archive_old_work ?? false,
        maxChildrenPerParent: platformLimits.max_children_per_parent ?? 10,
        maxWorkItemsPerChild: platformLimits.max_work_items_per_child ?? 100,
        maxProgramsPerSeason: platformLimits.max_programs_per_season ?? 20
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

    updateSetting('google_drive_settings', {
      require_public_links: localSettings.requirePublicLinks,
      auto_verify_links: localSettings.autoVerifyLinks,
      allow_folder_links: localSettings.allowFolderLinks,
      link_expiration_check: localSettings.linkExpirationCheck
    });

    updateSetting('parent_child_requests', {
      require_admin_approval: localSettings.requireParentApproval,
      auto_notify_admins: localSettings.autoNotifyOnRequests
    });

    updateSetting('data_retention', {
      keep_completed_enrollments_months: localSettings.dataRetentionMonths,
      archive_old_work: localSettings.archiveOldWork
    });

    updateSetting('platform_limits', {
      max_children_per_parent: localSettings.maxChildrenPerParent,
      max_work_items_per_child: localSettings.maxWorkItemsPerChild,
      max_programs_per_season: localSettings.maxProgramsPerSeason
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
            <TabsTrigger value="google-drive" className="text-black">
              <Link className="h-4 w-4 mr-2" />
              Google Drive
            </TabsTrigger>
            <TabsTrigger value="security" className="text-black">
              <Shield className="h-4 w-4 mr-2" />
              Security & Limits
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

          <TabsContent value="google-drive" className="space-y-6">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Google Drive Link Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Require Public Links</Label>
                    <p className="text-sm text-black">
                      Only allow publicly accessible Google Drive links
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.requirePublicLinks}
                    onCheckedChange={(checked) => handleSettingChange('requirePublicLinks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Auto-verify Links</Label>
                    <p className="text-sm text-black">
                      Automatically verify link accessibility when submitted
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoVerifyLinks}
                    onCheckedChange={(checked) => handleSettingChange('autoVerifyLinks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Allow Folder Links</Label>
                    <p className="text-sm text-black">
                      Allow links to Google Drive folders (not just individual files)
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.allowFolderLinks}
                    onCheckedChange={(checked) => handleSettingChange('allowFolderLinks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Link Expiration Monitoring</Label>
                    <p className="text-sm text-black">
                      Periodically check if Google Drive links are still accessible
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.linkExpirationCheck}
                    onCheckedChange={(checked) => handleSettingChange('linkExpirationCheck', checked)}
                  />
                </div>

                <Separator className="bg-black" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-black">Upload Notifications</Label>
                    <p className="text-sm text-black">
                      Send notifications when kids work links are shared
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
                      Also notify admins when new work links are shared
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
                <CardTitle className="text-black">Platform Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxChildren" className="text-black">Max Children per Parent</Label>
                    <Input
                      id="maxChildren"
                      type="number"
                      min="1"
                      max="50"
                      value={localSettings.maxChildrenPerParent}
                      onChange={(e) => handleSettingChange('maxChildrenPerParent', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxWork" className="text-black">Max Work Items per Child</Label>
                    <Input
                      id="maxWork"
                      type="number"
                      min="10"
                      max="500"
                      value={localSettings.maxWorkItemsPerChild}
                      onChange={(e) => handleSettingChange('maxWorkItemsPerChild', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrograms" className="text-black">Max Programs per Season</Label>
                    <Input
                      id="maxPrograms"
                      type="number"
                      min="5"
                      max="100"
                      value={localSettings.maxProgramsPerSeason}
                      onChange={(e) => handleSettingChange('maxProgramsPerSeason', parseInt(e.target.value))}
                      className="bg-white text-black border-black"
                    />
                  </div>
                </div>

                <Separator className="bg-black" />

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
                requirePublicLinks: true,
                autoVerifyLinks: false,
                allowFolderLinks: true,
                linkExpirationCheck: true,
                requireParentApproval: true,
                autoNotifyOnRequests: true,
                dataRetentionMonths: 24,
                archiveOldWork: false,
                maxChildrenPerParent: 10,
                maxWorkItemsPerChild: 100,
                maxProgramsPerSeason: 20
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
