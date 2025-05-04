
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-watan-darkblue to-watan-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-3 md:mb-0">
          <img 
            src="/lovable-uploads/b7aed982-e436-4eb7-bfd7-51497286d1b1.png" 
            alt="مستقبل وطن" 
            className="h-16 w-16 object-contain"
          />
          <div className="text-right">
            <h1 className="text-2xl font-bold">أمانة الشباب</h1>
            <p className="text-sm opacity-90">قسم منتزة أول – حزب مستقبل وطن</p>
          </div>
        </div>
        
        <nav className="flex gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 rounded hover:bg-white/10 transition-colors"
          >
            تسجيل البيانات
          </button>
          <button 
            onClick={() => navigate('/admin')} 
            className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-1"
          >
            <Shield size={16} />
            لوحة التحكم
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
