
import React from 'react';
import Header from '../components/Header';
import RegistrationForm from '../components/RegistrationForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/lovable-uploads/b7aed982-e436-4eb7-bfd7-51497286d1b1.png" 
            alt="مستقبل وطن"
            className="w-36 h-36 object-contain mb-4"
          />
          <h1 className="text-3xl font-bold text-watan-darkblue text-center">
            نظام تسجيل بيانات الأعضاء
          </h1>
          <p className="text-gray-600 mt-2 text-center max-w-2xl">
            برجاء إدخال بيانات العضو بدقة. سيتم حفظ البيانات تلقائيًا في النظام بمجرد الإرسال.
          </p>
        </div>
        
        <RegistrationForm />
      </main>
      <footer className="bg-watan-darkblue text-white py-4 text-center">
        <p className="text-sm">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - أمانة الشباب - حزب مستقبل وطن
        </p>
      </footer>
    </div>
  );
};

export default Index;
