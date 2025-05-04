
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, List, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { MemberData } from './RegistrationForm';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [membersData, setMembersData] = useState<MemberData[]>([]);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    loadMembersData();
  }, []);

  // تحميل البيانات من localStorage
  const loadMembersData = () => {
    const dataString = localStorage.getItem('membersData');
    if (dataString) {
      const data = JSON.parse(dataString);
      setMembersData(data);
    }
  };

  // تصفية البيانات بناءً على مصطلح البحث
  const filteredData = membersData.filter(item => 
    item.name.includes(searchTerm) || 
    item.nationalId.includes(searchTerm) || 
    item.phone.includes(searchTerm)
  );

  // تنزيل البيانات كملف Excel
  const handleDownloadExcel = () => {
    if (membersData.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "لا يوجد أعضاء مسجلين لتصدير بياناتهم",
        variant: "destructive"
      });
      return;
    }

    // تحويل البيانات إلى CSV
    const headers = ["الاسم", "الرقم القومي", "رقم التليفون", "النوع", "الصفة", "تاريخ التسجيل"];
    
    const csvContent = [
      headers.join(','),
      ...membersData.map(member => [
        `"${member.name}"`,
        `"${member.nationalId}"`,
        `"${member.phone}"`,
        `"${member.gender}"`,
        `"${member.position}"`,
        `"${new Date(member.timestamp).toLocaleString('ar-EG')}"`
      ].join(','))
    ].join('\n');
    
    // إنشاء رابط تنزيل
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `أعضاء_مستقبل_وطن_${new Date().toLocaleDateString('ar-EG')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير بيانات الأعضاء بنجاح",
    });
  };

  // حذف عضو
  const handleDeleteMember = (id: number) => {
    const updatedData = membersData.filter(member => member.id !== id);
    localStorage.setItem('membersData', JSON.stringify(updatedData));
    setMembersData(updatedData);
    
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف بيانات العضو من النظام",
    });
  };

  // حذف كل البيانات
  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      localStorage.removeItem('membersData');
      setMembersData([]);
      
      toast({
        title: "تم مسح البيانات",
        description: "تم حذف جميع بيانات الأعضاء من النظام",
      });
    }
  };

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
            {membersData.length > 0 && (
              <Button onClick={handleClearAll} variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                حذف الكل
              </Button>
            )}
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
                <TableHead className="text-right">إجراءات</TableHead>
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
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    لا توجد بيانات متطابقة مع البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="text-center text-muted-foreground text-sm mt-4">
            إجمالي عدد الأعضاء: {membersData.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
