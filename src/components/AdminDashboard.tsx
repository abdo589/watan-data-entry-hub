
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for demonstration - in a real app, this would come from a backend
const mockData = [
  { id: 1, name: "أحمد محمد", nationalId: "29911121234567", phone: "01012345678", gender: "ذكر", position: "منسق شارع" },
  { id: 2, name: "سارة علي", nationalId: "29807121234567", phone: "01112345678", gender: "أنثى", position: "عضو" },
  { id: 3, name: "محمود خالد", nationalId: "30112121234567", phone: "01212345678", gender: "ذكر", position: "منسق منطقة" },
  { id: 4, name: "فاطمة أحمد", nationalId: "29605121234567", phone: "01512345678", gender: "أنثى", position: "عضو" },
  { id: 5, name: "محمد عبدالله", nationalId: "30209121234567", phone: "01012345670", gender: "ذكر", position: "منسق قطاع" },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(true); // In a real app, this would be authenticated

  // Filter data based on search term
  const filteredData = mockData.filter(item => 
    item.name.includes(searchTerm) || 
    item.nationalId.includes(searchTerm) || 
    item.phone.includes(searchTerm)
  );

  const handleDownloadExcel = () => {
    // In a real app, this would generate and download an Excel file
    alert('تم تنزيل الملف بنجاح');
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">غير مصرح بالدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <List className="h-6 w-6 text-watan-blue" />
              بيانات الأعضاء المسجلين
            </CardTitle>
            <CardDescription>
              عرض وتصدير بيانات الأعضاء المسجلين في النظام
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4" />
              تصدير Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن عضو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10"
            dir="rtl"
          />
        </div>
        <div className="overflow-x-auto">
          <Table dir="rtl">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">الرقم القومي</TableHead>
                <TableHead className="text-right">رقم التليفون</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الصفة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.nationalId}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.gender}</TableCell>
                    <TableCell>{member.position}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    لا توجد بيانات متطابقة مع البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="text-center text-muted-foreground text-sm mt-4">
            إجمالي عدد الأعضاء: {mockData.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
