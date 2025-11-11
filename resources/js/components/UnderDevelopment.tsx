import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, AlertCircle, Clock } from 'lucide-react';

interface UnderDevelopmentProps {
  role?: string;
  title?: string;
  message?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ 
  role, 
  title = "Halaman Dalam Pengembangan",
  message = "Role sudah ada, tapi belum memiliki data"
}) => {
  return (
    <div className="">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Construction className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Status: Dalam Pengembangan</span>
            </div>
            
            {role && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Role:</strong> {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-blue-600">
                  Role ini memiliki akses operasional terbatas dan sedang dalam tahap pengembangan fitur lengkap.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-3">
                {message}
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Fitur akan segera tersedia</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Untuk informasi lebih lanjut, silakan hubungi tim IT atau Administrator sistem.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnderDevelopment;