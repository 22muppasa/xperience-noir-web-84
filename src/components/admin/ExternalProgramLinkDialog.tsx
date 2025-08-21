
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExternalProgramLinkDialog = () => {
  const { getSetting, updateSetting, isUpdating } = useAdminSettings();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    enabled: false,
    link: '',
    description: ''
  });
  const [isValidUrl, setIsValidUrl] = useState(true);

  // Load settings only when dialog opens
  useEffect(() => {
    if (isOpen) {
      const externalProgramsSettings = getSetting('external_programs') || {
        enabled: false,
        link: '',
        description: ''
      };
      
      console.log('Loading external programs setting:', externalProgramsSettings);
      setFormData(externalProgramsSettings);
      setIsValidUrl(true);
    }
  }, [isOpen, getSetting]);

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleEnabledToggle = (checked: boolean) => {
    console.log('Toggle enabled changed to:', checked);
    setFormData(prev => ({ ...prev, enabled: checked }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setFormData(prev => ({ ...prev, link: newLink }));
    setIsValidUrl(validateUrl(newLink));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleSave = () => {
    if (formData.enabled && !isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL before saving.",
        variant: "destructive",
      });
      return;
    }

    if (formData.enabled && !formData.link.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a URL when enabling external programs.",
        variant: "destructive",
      });
      return;
    }

    console.log('Saving external programs setting:', formData);
    updateSetting('external_programs', formData);
    setIsOpen(false);
    
    toast({
      title: "Settings saved",
      description: "External program settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    const currentSettings = getSetting('external_programs') || {
      enabled: false,
      link: '',
      description: ''
    };
    setFormData(currentSettings);
    setIsValidUrl(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage External Program Link
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>External Program Link</DialogTitle>
          <DialogDescription>
            Configure an external link to redirect users to third-party programs when no internal programs are available.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="external-programs-enabled" className="text-sm font-medium">
              Enable External Program Link
            </Label>
            <Switch
              id="external-programs-enabled"
              checked={formData.enabled}
              onCheckedChange={handleEnabledToggle}
            />
          </div>

          {formData.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="external-link">Program Link URL</Label>
                <div className="mt-1">
                  <Input
                    id="external-link"
                    type="url"
                    placeholder="https://example.com/programs"
                    value={formData.link}
                    onChange={handleLinkChange}
                    className={!isValidUrl ? 'border-red-500' : ''}
                  />
                  {!isValidUrl && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid URL (e.g., https://example.com)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="external-description">Description (Optional)</Label>
                <div className="mt-1">
                  <Textarea
                    id="external-description"
                    placeholder="Brief description of the external programs..."
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || (formData.enabled && !isValidUrl)}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalProgramLinkDialog;
