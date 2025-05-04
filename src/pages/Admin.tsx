
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';
import AdminLogin from '../components/AdminLogin';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // التحقق من حالة المصادقة المخزنة عند تحميل الصفحة
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-watan-darkblue">
            لوحة تحكم المشرفين
          </h1>
          <p className="text-gray-600 mt-2">
            يمكنك من هنا عرض وتصدير بيانات الأعضاء المسجلين
          </p>
        </div>
        
        {isAuthenticated ? (
          <>
            <AdminDashboard />
            <div className="text-center mt-6">
              <button 
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 underline"
              >
                تسجيل الخروج
              </button>
            </div>
          </>
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </main>
      <footer className="bg-watan-darkblue text-white py-4 text-center">
        <p className="text-sm">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - أمانة الشباب - حزب مستقبل وطن
        </p>
      </footer>
    </div>
  );
};

export default Admin;
