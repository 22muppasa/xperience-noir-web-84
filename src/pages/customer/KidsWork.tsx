
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Download, Eye, MessageSquare } from 'lucide-react';

const KidsWork = () => {
  // Mock data for kids work
  const kidsWork = [
    {
      id: 1,
      title: 'Colorful Butterfly Painting',
      childName: 'Emma Johnson',
      program: 'Summer Art Camp',
      uploadDate: '2024-06-20',
      fileType: 'image',
      fileUrl: '/placeholder.svg',
      description: 'Beautiful watercolor painting of a butterfly',
      commentsCount: 2
    },
    {
      id: 2,
      title: 'Robot Drawing',
      childName: 'Emma Johnson',
      program: 'STEM Workshop',
      uploadDate: '2024-06-18',
      fileType: 'image',
      fileUrl: '/placeholder.svg',
      description: 'Creative robot design with moving parts',
      commentsCount: 1
    },
    {
      id: 3,
      title: 'Nature Journal Entry',
      childName: 'Emma Johnson',
      program: 'Nature Adventure',
      uploadDate: '2024-06-15',
      fileType: 'document',
      fileUrl: '/placeholder.svg',
      description: 'Observations about local wildlife',
      commentsCount: 0
    }
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-5 w-5" />;
      default:
        return <Image className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kids Work</h1>
          <p className="text-gray-600">View and download your children's creative work</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Works</p>
                  <p className="text-2xl font-bold">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-2xl font-bold">
                    {kidsWork.reduce((sum, work) => sum + work.commentsCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kids Work Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kidsWork.map((work) => (
            <Card key={work.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{work.title}</CardTitle>
                  {getFileIcon(work.fileType)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview Image */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={work.fileUrl} 
                    alt={work.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                {/* Work Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{work.program}</Badge>
                    <span className="text-sm text-gray-500">{work.uploadDate}</span>
                  </div>
                  <p className="text-sm text-gray-600">{work.description}</p>
                  <p className="text-sm font-medium">By: {work.childName}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  {work.commentsCount > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {work.commentsCount}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KidsWork;
