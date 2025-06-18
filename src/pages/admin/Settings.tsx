
import React, { useState, useEffect } from 'react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Shield
} from 'lucide-react';

const AdminSettings = () => {
  const { getSetting, updateSetting, isLoading } = useAdminSettings();
  
  const [localSettings, setLocalSettings] = useState({
    enrollmentAutoApproval: false,
    workUploadNotifications: true,
    notifyAdminsOnUpload: true,
    requireParentApproval: true,
    autoNotifyOnRequests: true,
    maxChildrenPerParent: 10,
    maxWorkItemsPerChild: 100,
    maxProgramsPerSeason: 20
  });

  useEffect(() => {
    if (!isLoading) {
      const enrollmentSettings = getSetting('enrollment_auto_approval') || {};
      const workNotifications = getSetting('work_upload_notifications') || {};
      const parentSettings = getSetting('parent_child_requests') || {};
      const platformLimits = getSetting('platform_limits') || {};

      setLocalSettings(prev => ({
        ...prev,
        enrollmentAutoApproval: enrollmentSettings.enabled ?? false,
        workUploadNotifications: workNotifications.enabled ?? true,
        notifyAdminsOnUpload: workNotifications.notify_admins ?? true,
        requireParentApproval: parentSettings.require_admin_approval ?? true,
        autoNotifyOnRequests: parentSettings.auto_notify_admins ?? true,
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

    updateSetting('parent_child_requests', {
      require_admin_approval: localSettings.requireParentApproval,
      auto_notify_admins: localSettings.autoNotifyOnRequests
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
          <TabsList className="grid w-full grid-cols-2 bg-white border-black">
            <TabsTrigger value="enrollment" className="text-black">
              <Users className="h-4 w-4 mr-2" />
              Enrollment & Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-black">
              <Shield className="h-4 w-4 mr-2" />
              Security & Limits
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

            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Work Upload Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                requireParentApproval: true,
                autoNotifyOnRequests: true,
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
