
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  Users, 
  BarChart3, 
  Calendar,
  TrendingUp
} from 'lucide-react';

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState('users');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'users', label: 'User Activity Report', icon: Users },
    { value: 'submissions', label: 'Submissions Report', icon: FileText },
    { value: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
    { value: 'engagement', label: 'User Engagement', icon: TrendingUp }
  ];

  const dateRanges = [
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'last_quarter', label: 'Last quarter' },
    { value: 'last_year', label: 'Last year' }
  ];

  const { data: reportPreview } = useQuery({
    queryKey: ['report-preview', reportType, dateRange],
    queryFn: async () => {
      // Generate preview data based on selected type and range
      switch (reportType) {
        case 'users':
          const { data: users } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
          return {
            title: 'User Activity Report',
            preview: users?.map(u => `${u.first_name} ${u.last_name} - ${u.role}`) || []
          };
        
        case 'submissions':
          const { data: submissions } = await supabase
            .from('kids_work')
            .select('title, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
          return {
            title: 'Submissions Report',
            preview: submissions?.map(s => `${s.title} - ${new Date(s.created_at).toLocaleDateString()}`) || []
          };
        
        default:
          return {
            title: 'Analytics Report',
            preview: ['Total Users: 1,247', 'Active Sessions: 89', 'Avg. Response Time: 125ms']
          };
      }
    }
  });

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download the actual report
      const reportData = JSON.stringify({
        type: reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        data: reportPreview
      }, null, 2);
      
      const blob = new Blob([reportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${dateRange}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report generated",
        description: "Your report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generate Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateReport}
            disabled={isGenerating}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Report...' : 'Generate & Download Report'}
          </Button>
        </CardContent>
      </Card>

      {reportPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">{reportPreview.title}</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {reportPreview.preview.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 py-1">
                    {item}
                  </div>
                ))}
                {reportPreview.preview.length === 0 && (
                  <p className="text-sm text-gray-500">No data available for this report</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsGenerator;
