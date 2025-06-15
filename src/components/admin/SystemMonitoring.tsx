
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Server, 
  Database, 
  HardDrive, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SystemMonitoring = () => {
  const { data: systemHealth, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      // Simulate system health data - in real app this would come from monitoring APIs
      const [
        storageData,
        uploadsData,
        errorLogs
      ] = await Promise.all([
        supabase.from('file_uploads').select('file_size, created_at'),
        supabase.from('file_uploads').select('id, created_at, upload_status'),
        // Simulate error logs
        Promise.resolve([])
      ]);

      // Calculate storage usage
      const totalStorage = storageData.data?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0;
      const storageUsageMB = Math.round(totalStorage / (1024 * 1024));
      
      // Calculate upload success rate
      const totalUploads = uploadsData.data?.length || 0;
      const successfulUploads = uploadsData.data?.filter(u => u.upload_status === 'completed').length || 0;
      const successRate = totalUploads > 0 ? Math.round((successfulUploads / totalUploads) * 100) : 100;

      // Generate performance data for the last 24 hours
      const performanceData = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (23 - i));
        return {
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
          throughput: Math.floor(Math.random() * 100) + 20, // 20-120 requests/min
          errors: Math.floor(Math.random() * 5) // 0-5 errors per hour
        };
      });

      return {
        status: 'healthy',
        uptime: '99.9%',
        responseTime: 125,
        storageUsage: storageUsageMB,
        storageLimit: 1024, // 1GB limit
        successRate,
        totalRequests: 1247,
        errorCount: 3,
        performanceData,
        services: [
          { name: 'Database', status: 'healthy', responseTime: 45 },
          { name: 'Storage', status: 'healthy', responseTime: 89 },
          { name: 'Authentication', status: 'healthy', responseTime: 67 },
          { name: 'File Upload', status: 'warning', responseTime: 234 },
        ]
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white border-black">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-black';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 border-red-300">Error</Badge>;
      default: return <Badge className="bg-gray-100 text-black border-black">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">System Status</CardTitle>
            <Activity className={`h-4 w-4 ${getStatusColor(systemHealth?.status || '')}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{systemHealth?.uptime}</div>
            <p className="text-xs text-black">Uptime</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{systemHealth?.responseTime}ms</div>
            <p className="text-xs text-black">Average response</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {systemHealth?.storageUsage}MB
            </div>
            <p className="text-xs text-black">
              of {systemHealth?.storageLimit}MB used
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full" 
                style={{ 
                  width: `${((systemHealth?.storageUsage || 0) / (systemHealth?.storageLimit || 1)) * 100}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{systemHealth?.successRate}%</div>
            <p className="text-xs text-black">Upload success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="bg-white border-black">
        <CardHeader>
          <CardTitle className="text-black">Service Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth?.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-black rounded-lg bg-white">
                <div className="flex items-center space-x-3">
                  {service.status === 'healthy' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : service.status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-black">{service.name}</h3>
                    <p className="text-sm text-black">
                      Response time: {service.responseTime}ms
                    </p>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-black">
          <CardHeader>
            <CardTitle className="text-black">Response Time (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemHealth?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-black">
          <CardHeader>
            <CardTitle className="text-black">Request Throughput (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={systemHealth?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#000000" 
                  fill="#000000" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-black">
        <CardHeader>
          <CardTitle className="text-black">Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-black">Database backup completed</p>
                <p className="text-xs text-black">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-black">High response time detected on file upload service</p>
                <p className="text-xs text-black">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Server className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-black">System maintenance scheduled</p>
                <p className="text-xs text-black">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
