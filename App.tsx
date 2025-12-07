import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Auth } from './components/Auth';
import { NewOrder } from './components/NewOrder';
import { Network } from './components/Network';
import { Trips } from './components/Trips';
import { TabView, User } from './types';
import { PlusCircle, Globe, Truck, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<TabView>('order');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('oleum_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('oleum_user');
      }
    }
    setInitializing(false);
  }, []);

  const handleLogin = (userData: User) => {
    localStorage.setItem('oleum_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem('oleum_user');
    setUser(null);
    setCurrentTab('order');
  };

  if (initializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-oleum-50 text-oleum-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="bg-oleum-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-oleum-600 flex items-center justify-center text-white font-bold">O</div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-oleum-900 leading-tight">Oleum</span>
              <span className="text-[10px] text-oleum-500 font-medium leading-none">Hello, {user.name}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentTab === 'order' && <NewOrder userId={user.id} />}
          {currentTab === 'network' && <Network />}
          {currentTab === 'trips' && <Trips />}
        </main>

        {/* Bottom Navigation - Fixed within container */}
        <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-200 pb-safe">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setCurrentTab('order')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                currentTab === 'order' ? 'text-oleum-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <PlusCircle className={`w-6 h-6 ${currentTab === 'order' ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">New Order</span>
            </button>

            <button
              onClick={() => setCurrentTab('network')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                currentTab === 'network' ? 'text-oleum-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Globe className={`w-6 h-6 ${currentTab === 'network' ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">Network</span>
            </button>

            <button
              onClick={() => setCurrentTab('trips')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                currentTab === 'trips' ? 'text-oleum-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Truck className={`w-6 h-6 ${currentTab === 'trips' ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">Trips</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* CSS Utility for safe area padding on mobile */}
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>
    </div>
  );
}