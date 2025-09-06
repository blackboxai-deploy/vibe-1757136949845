'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">RM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Richezza Mega Value</h1>
                <p className="text-xs text-gray-500">A THE RICHHDAD GROUP Company</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen -mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Welcome Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Complete Business Management Suite
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Streamline your billing, payroll, and attendance management with our comprehensive business solution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Billing</h3>
                  <p className="text-sm text-gray-600">Professional invoicing and payment tracking</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-green-600 rounded-sm"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Payroll</h3>
                  <p className="text-sm text-gray-600">Automated salary processing and reporting</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-sm"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Attendance</h3>
                  <p className="text-sm text-gray-600">Digital clock-in system and tracking</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Demo Login Credentials</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Admin:</strong> admin@richezzamegavalue.com / demo123</p>
                  <p><strong>Manager:</strong> hr@richezzamegavalue.com / demo123</p>
                  <p><strong>Employee:</strong> john@richezzamegavalue.com / demo123</p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-white shadow-xl border-0">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">RM</span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-600">
                    Sign in to access your business dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 Richezza Mega Value. A subsidiary of THE RICHHDAD GROUP. All rights reserved.
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              Business Management System v1.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}