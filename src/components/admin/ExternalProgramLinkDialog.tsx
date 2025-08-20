
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, loading settings...');
      setIsLoading(true);
      
      const externalPrograms = getSetting('external_programs') || { 
        enabled: false, 
        link: '', 
        description: '' 
      };
      
      console.log('Loaded external programs setting:', externalPrograms);
      setFormData(externalPrograms);
      setIsLoading(false);
    }
  }, [open, getSetting]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      console.log('Dialog closed, resetting form');
      setFormData({
        enabled: false,
        link: '',
        description: ''
      });
    }
  }, [open]);

  const handleSave = () => {
    console.log('Saving form data:', formData);
    updateSetting('external_programs', formData);
    onOpenChange(false);
  };

  const isValidUrl = (url: string) => {
    if (!url || url.trim() === '') return true; // Allow empty URLs when disabled
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+\..+/;
    
    try {
      const parsedUrl = new URL(url);
      return (
        (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
        parsedUrl.hostname.includes('.') &&
        urlPattern.test(url)
      );
    } catch {
      return false;
    }
  };

  const handleEnabledChange = (enabled: boolean) => {
    console.log('Enabled changed to:', enabled);
    setFormData(prev => ({ ...prev, enabled }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    console.log('Link changed to:', link);
    setFormData(prev => ({ ...prev, link }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    console.log('Description changed to:', description);
    setFormData(prev => ({ ...prev, description }));
  };

  const canSave = !formData.enabled || (formData.enabled && formData.link.trim() && isValidUrl(formData.link));

  console.log('Current form data:', formData);
  console.log('Can save:', canSave);
  console.log('Is URL valid:', isValidUrl(formData.link));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Manage External Program Link
          </DialogTitle>
          <DialogDescription>
            Configure external program platform link that will be displayed on the public programs page.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <span className="ml-2 text-sm">Loading settings...</span>
          </div>
        ) : (
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
                onCheckedChange={handleEnabledChange}
                aria-describedby="enabled-description"
              />
            </div>

            {/* Program Link Input */}
            <div className="space-y-2">
              <Label htmlFor="link">Program Link URL {formData.enabled && '*'}</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com/programs"
                value={formData.link}
                onChange={handleLinkChange}
                disabled={!formData.enabled}
                className={
                  !isValidUrl(formData.link) && formData.link ? 'border-red-500 focus:border-red-500' : ''
                }
                aria-describedby="link-error"
              />
              {formData.link && !isValidUrl(formData.link) && (
                <p id="link-error" className="text-sm text-red-600">
                  Please enter a valid URL starting with http:// or https://
                </p>
              )}
              {formData.enabled && !formData.link.trim() && (
                <p className="text-sm text-orange-600">
                  URL is required when external programs are enabled
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Internal Notes (optional)</Label>
              <Textarea
                id="description"
                placeholder="Notes about this external program platform..."
                value={formData.description}
                onChange={handleDescriptionChange}
                rows={3}
                aria-describedby="description-help"
              />
              <p id="description-help" className="text-xs text-gray-500">
                These notes are only visible to administrators
              </p>
            </div>

            {/* Preview */}
            {formData.enabled && formData.link && isValidUrl(formData.link) && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <Button className="w-full bg-black text-white hover:bg-gray-800" type="button">
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
                type="button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave || isUpdating}
                className="flex-1 bg-black text-white hover:bg-gray-800"
                type="button"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExternalProgramLinkDialog;
