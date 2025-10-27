'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, DollarSign, CheckSquare, Shield, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const authenticatedRoutes = ['/dashboard', '/expenses', '/tasks', '/admin'];
  const shouldShowSidebar = authenticatedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    setMounted(true);
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail === 'anegi@admin.com') {
      setUserRole('admin');
    } else {
      setUserRole('user');
    }
  }, []);

  const getNavigation = () => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Expenses', href: '/expenses', icon: DollarSign },
      { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    ];
    
    if (userRole === 'admin') {
      return [{ name: 'Admin', href: '/admin', icon: Shield }, ...baseNav];
    }
    
    return baseNav;
  };

  const navigation = getNavigation();

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://personal-productivity-manager-b.onrender.com';
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      router.push('/login');
    }
  };

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col max-w-xs w-full h-full bg-brown-m">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Scrollable navigation area */}
          <div className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <h1 className="text-2xl font-semibold text-amber-100 tracking-wide">Productivity Manager</h1>
            </div>
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg ${
                      isActive
                        ? 'bg-amber-800 text-amber-50'
                        : 'text-amber-200 hover:bg-amber-900/50 hover:text-amber-50'
                    }`}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Fixed logout button */}
          <div className="flex-shrink-0 border-t border-amber-900/50 p-4 bg-brown-m">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center px-3 py-3 rounded-lg hover:bg-amber-900/50">
                <LogOut className="h-6 w-6 text-amber-300" />
                <span className="ml-3 text-base font-medium text-amber-200 group-hover:text-amber-50">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 h-screen">
          <div className="flex flex-col flex-1 bg-brown-m shadow-xl">
             <div className="flex-1 pt-5 pb-10 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <h1 className="text-2xl font-semibold text-amber-100 tracking-wide">Productivity Manager</h1>
              </div>
              <nav className="px-3 space-y-5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg ${
                        isActive
                          ? 'bg-amber-800 text-amber-50 shadow-md'
                          : 'text-amber-200 hover:bg-amber-900/50 hover:text-amber-50'
                      }`}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* Fixed logout button */}
            <div className="flex-shrink-0 border-t border-amber-900/50 p-4 bg-brown-m">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center px-3 py-3 rounded-lg hover:bg-amber-900/50">
                  <LogOut className="h-6 w-6 text-amber-300" />
                  <span className="ml-3 text-base font-medium text-amber-200 group-hover:text-amber-50">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
         <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

         <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}