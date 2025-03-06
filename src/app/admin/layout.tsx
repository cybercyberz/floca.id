'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { useAuth, logout } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Check if the current path is the login page
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';
  
  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, router, isLoginPage]);
  
  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { success } = await logout();
      if (success) {
        // Call the logout API to clear the session cookie
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Redirect to login page
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Show login page layout if on login page
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show admin layout if authenticated
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <Logo />
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className={`block px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/articles"
              className={`block px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin/articles'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Articles
            </Link>
            <Link
              href="/admin/articles/new"
              className={`block px-4 py-2 text-sm rounded-lg ${
                pathname === '/admin/articles/new'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              New Article
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
            )}
            <div className="flex space-x-2">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm text-red-600 hover:text-red-800"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 