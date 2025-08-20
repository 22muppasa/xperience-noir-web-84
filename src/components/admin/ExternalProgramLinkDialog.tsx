
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
  const [linkError, setLinkError] = useState('');

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      console.log('Dialog opened, loading external program settings...');
      setIsLoading(true);
      
      const externalPrograms = getSetting('external_programs') || { 
        enabled: false, 
        link: '', 
        description: '' 
      };
      
      console.log('Loaded external programs setting:', externalPrograms);
      
      setFormData({
        enabled: Boolean(externalPrograms.enabled),
        link: externalPrograms.link || '',
        description: externalPrograms.description || ''
      });
      
      setLinkError('');
      setIsLoading(false);
    }
  }, [open, getSetting]);

  // Reset form when dialog closes without saving
  useEffect(() => {
    if (!open) {
      console.log('Dialog closed, resetting form state');
      setFormData({
        enabled: false,
        link: '',
        description: ''
      });
      setLinkError('');
    }
  }, [open]);

  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return true; // Allow empty URLs when disabled
    
    try {
      const urlObj = new URL(url.trim());
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleEnabledToggle = (checked: boolean) => {
    console.log('Toggle clicked - new enabled state:', checked);
    
    setFormData(prev => {
      const newData = { ...prev, enabled: checked };
      console.log('Form data after toggle:', newData);
      return newData;
    });
    
    // Clear link error when disabling
    if (!checked) {
      setLinkError('');
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    console.log('Link input changed to:', newLink);
    
    setFormData(prev => ({ ...prev, link: newLink }));
    
    // Validate URL in real-time
    if (newLink && !validateUrl(newLink)) {
      setLinkError('Please enter a valid URL starting with http:// or https://');
    } else {
      setLinkError('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    console.log('Description changed to:', newDescription);
    
    setFormData(prev => ({ ...prev, description: newDescription }));
  };

  const handleSave = () => {
    console.log('Save button clicked with form data:', formData);
    
    // Final validation
    if (formData.enabled && (!formData.link.trim() || !validateUrl(formData.link))) {
      console.log('Save blocked - validation failed');
      if (!formData.link.trim()) {
        setLinkError('URL is required when external programs are enabled');
      }
      return;
    }
    
    console.log('Saving external programs setting...');
    updateSetting('external_programs', formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    console.log('Cancel button clicked');
    onOpenChange(false);
  };

  // Determine if save button should be enabled
  const canSave = () => {
    if (!formData.enabled) {
      return true; // Can always save when disabled
    }
    
    // When enabled, need valid URL
    const hasValidLink = formData.link.trim() && validateUrl(formData.link);
    console.log('Can save check - enabled:', formData.enabled, 'hasValidLink:', hasValidLink, 'linkError:', linkError);
    return hasValidLink && !linkError;
  };

  const saveEnabled = canSave();
  console.log('Render - Form data:', formData, 'Save enabled:', saveEnabled);

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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm">Loading settings...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="external-programs-toggle">Enable External Programs</Label>
                <p className="text-sm text-muted-foreground">
                  Show link to external program platform on public programs page
                </p>
              </div>
              <Switch
                id="external-programs-toggle"
                checked={formData.enabled}
                onCheckedChange={handleEnabledToggle}
              />
            </div>

            {/* Program Link Input */}
            <div className="space-y-2">
              <Label htmlFor="program-link-input">
                Program Link URL {formData.enabled && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="program-link-input"
                type="url"
                placeholder="https://example.com/programs"
                value={formData.link}
                onChange={handleLinkChange}
                disabled={!formData.enabled}
                className={linkError ? 'border-red-500 focus:border-red-500' : ''}
              />
              {linkError && (
                <p className="text-sm text-red-600">{linkError}</p>
              )}
              {formData.enabled && !formData.link.trim() && !linkError && (
                <p className="text-sm text-amber-600">
                  URL is required when external programs are enabled
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="program-description-input">Internal Notes (optional)</Label>
              <Textarea
                id="program-description-input"
                placeholder="Notes about this external program platform..."
                value={formData.description}
                onChange={handleDescriptionChange}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                These notes are only visible to administrators
              </p>
            </div>

            {/* Preview */}
            {formData.enabled && formData.link && validateUrl(formData.link) && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <Button className="w-full" type="button" variant="default">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  See Our Programs
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This button will open: {formData.link}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                type="button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!saveEnabled || isUpdating}
                className="flex-1"
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
