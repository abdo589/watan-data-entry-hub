
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, Save } from 'lucide-react';

const positions = [
  "عضو",
  "منسق شارع",
  "منسق منطقة",
  "منسق قطاع",
  "أخرى"
];

// نموذج البيانات الذي سيتم تخزينه
export interface MemberData {
  id: number;
  name: string;
  nationalId: string;
  phone: string;
  gender: string;
  position: string;
  timestamp: string;
}

// تخزين مؤقت للبيانات
const TEMP_STORAGE_KEY = 'tempFormData';

const RegistrationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phone: '',
    gender: '',
    position: '',
    customPosition: ''
  });
  const [loading, setLoading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // استرجاع البيانات المؤقتة عند تحميل النموذج
  useEffect(() => {
    const savedData = localStorage.getItem(TEMP_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
  }, []);

  // حفظ البيانات تلقائيًا كلما تغيرت
  useEffect(() => {
    if (autoSaveEnabled && (formData.name || formData.nationalId || formData.phone)) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(formData));
        const now = new Date();
        setLastSaved(now.toLocaleTimeString('ar-EG'));
      }, 500);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [formData, autoSaveEnabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.nationalId || !formData.phone || !formData.gender || 
        (!formData.position || (formData.position === 'أخرى' && !formData.customPosition))) {
      toast({
        title: "خطأ في البيانات",
        description: "برجاء ملء كافة الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // National ID validation (must be 14 digits for Egyptian ID)
    if (!/^\d{14}$/.test(formData.nationalId)) {
      toast({
        title: "خطأ في الرقم القومي",
        description: "الرقم القومي يجب أن يتكون من 14 رقم",
        variant: "destructive"
      });
      return;
    }

    // Phone validation (Egyptian phone number format)
    if (!/^(01)[0-2|5]{1}[0-9]{8}$/.test(formData.phone)) {
      toast({
        title: "خطأ في رقم الهاتف",
        description: "برجاء إدخال رقم هاتف مصري صحيح",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // تجهيز البيانات للحفظ
      const finalPosition = formData.position === 'أخرى' ? formData.customPosition : formData.position;
      
      // جلب البيانات الحالية من localStorage
      const existingDataString = localStorage.getItem('membersData');
      const existingData: MemberData[] = existingDataString ? JSON.parse(existingDataString) : [];
      
      // التحقق من وجود الرقم القومي مسبقًا
      const isDuplicate = existingData.some(item => item.nationalId === formData.nationalId);
      
      if (isDuplicate) {
        toast({
          title: "تنبيه",
          description: "هذا الرقم القومي مسجل مسبقًا في النظام",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // إنشاء معرف جديد
      const newId = existingData.length > 0 ? Math.max(...existingData.map(item => item.id)) + 1 : 1;
      
      // إنشاء كائن البيانات الجديد
      const newMemberData: MemberData = {
        id: newId,
        name: formData.name,
        nationalId: formData.nationalId,
        phone: formData.phone,
        gender: formData.gender,
        position: finalPosition,
        timestamp: new Date().toISOString()
      };
      
      // إضافة البيانات الجديدة للمصفوفة
      const updatedData = [...existingData, newMemberData];
      
      // حفظ البيانات في localStorage
      localStorage.setItem('membersData', JSON.stringify(updatedData));
      
      // حذف البيانات المؤقتة
      localStorage.removeItem(TEMP_STORAGE_KEY);
      
      // عرض رسالة نجاح
      toast({
        title: "تم التسجيل بنجاح!",
        description: "تم حفظ بيانات العضو في النظام",
      });
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        nationalId: '',
        phone: '',
        gender: '',
        position: '',
        customPosition: ''
      });
      setLastSaved(null);
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      toast({
        title: "خطأ في النظام",
        description: "لم نتمكن من حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-t-watan-blue">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">تسجيل بيانات الأعضاء</CardTitle>
        <CardDescription>
          البيانات تُحفظ تلقائيًا أثناء الكتابة
          {lastSaved && 
            <div className="text-xs text-muted-foreground mt-1">
              آخر حفظ تلقائي: {lastSaved}
            </div>
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={handleInputChange}
                className="pr-10"
              />
              <User className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId">الرقم القومي</Label>
            <Input
              id="nationalId"
              name="nationalId"
              placeholder="الرقم القومي المكون من 14 رقم"
              value={formData.nationalId}
              onChange={handleInputChange}
              maxLength={14}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم التليفون</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="رقم المحمول"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>النوع</Label>
            <RadioGroup 
              value={formData.gender} 
              onValueChange={(value) => handleSelectChange('gender', value)}
              className="flex justify-start space-x-4 space-x-reverse"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="ذكر" id="male" />
                <Label htmlFor="male" className="cursor-pointer">ذكر</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="أنثى" id="female" />
                <Label htmlFor="female" className="cursor-pointer">أنثى</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">الصفة</Label>
            <Select 
              value={formData.position} 
              onValueChange={(value) => handleSelectChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الصفة" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.position === 'أخرى' && (
            <div className="space-y-2">
              <Label htmlFor="customPosition">تحديد الصفة</Label>
              <Input
                id="customPosition"
                name="customPosition"
                placeholder="أدخل الصفة"
                value={formData.customPosition}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSaveEnabled}
                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="rounded text-watan-blue"
              />
              <label htmlFor="autoSave" className="cursor-pointer text-muted-foreground">حفظ تلقائي</label>
            </div>
            {formData.name || formData.nationalId || formData.phone ? (
              <button 
                type="button"
                onClick={() => {
                  localStorage.removeItem(TEMP_STORAGE_KEY);
                  setFormData({
                    name: '',
                    nationalId: '',
                    phone: '',
                    gender: '',
                    position: '',
                    customPosition: ''
                  });
                  setLastSaved(null);
                  toast({
                    title: "تم مسح النموذج",
                    description: "تم مسح جميع البيانات المدخلة",
                  });
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                مسح النموذج
              </button>
            ) : null}
          </div>

          <Button 
            type="submit" 
            className="w-full group hover:animate-scale-up"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            {loading ? 'جاري التسجيل...' : 'تسجيل البيانات'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
