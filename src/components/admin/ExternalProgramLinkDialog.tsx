
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { ExternalLink, Link, Save, X } from 'lucide-react';

interface ExternalProgramLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExternalProgramLinkDialog = ({ open, onOpenChange }: ExternalProgramLinkDialogProps) => {
  const { getSetting, updateSetting, isUpdating } = useAdminSettings();
  
  const [formData, setFormData] = useState({
    enabled: false,
    link: '',
    description: ''
  });

  useEffect(() => {
    if (open) {
      const externalPrograms = getSetting('external_programs') || { enabled: false, link: '', description: '' };
      setFormData(externalPrograms);
    }
  }, [open, getSetting]);

  const handleSave = () => {
    updateSetting('external_programs', formData);
    onOpenChange(false);
  };

  const isValidUrl = (url: string) => {
    if (!url) return true; // Allow empty URLs when disabled
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const canSave = !formData.enabled || (formData.enabled && formData.link.trim() && isValidUrl(formData.link));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Manage External Program Link
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enabled">Enable External Programs</Label>
              <p className="text-sm text-gray-600">
                Show link to external program platform on public programs page
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(enabled) => setFormData(prev => ({ ...prev, enabled }))}
            />
          </div>

          {/* Program Link Input */}
          <div className="space-y-2">
            <Label htmlFor="link">Program Link URL *</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://example.com/programs"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              disabled={!formData.enabled}
              className={!isValidUrl(formData.link) && formData.link ? 'border-red-500' : ''}
            />
            {formData.link && !isValidUrl(formData.link) && (
              <p className="text-sm text-red-600">Please enter a valid URL starting with http:// or https://</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Internal Notes (optional)</Label>
            <Textarea
              id="description"
              placeholder="Notes about this external program platform..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData.enabled && formData.link && isValidUrl(formData.link) && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                <ExternalLink className="h-4 w-4 mr-2" />
                See Our Programs
              </Button>
              <p className="text-xs text-gray-500 mt-2">This button will open: {formData.link}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave || isUpdating}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalProgramLinkDialog;
