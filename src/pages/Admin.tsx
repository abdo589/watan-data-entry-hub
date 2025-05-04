
import React from 'react';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
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
        
        <AdminDashboard />
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
