import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // في تطبيق حقيقي، يجب أن تكون كلمة المرور مخزنة بشكل آمن في الخادم
  // هذا مجرد مثال للتوضيح
  const correctPassword = 'watan2025';  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة تأخير شبكة
    setTimeout(() => {
      if (password === correctPassword) {
        // تخزين حالة تسجيل الدخول في localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        onLogin();
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-watan-darkblue flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-watan-darkblue">لوحة التحكم</CardTitle>
          <CardDescription>
            الرجاء إدخال كلمة المرور للوصول إلى لوحة تحكم المشرفين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                dir="rtl"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-watan-darkblue hover:bg-watan-blue"
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
