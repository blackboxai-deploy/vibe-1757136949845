'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { clientStorage, employeeStorage, invoiceStorage, payrollStorage } from '@/lib/storage';
import { formatCurrency } from '@/lib/storage';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalEmployees: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    monthlyPayroll: 0,
    activeEmployees: 0
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const clients = clientStorage.getAll();
    const employees = employeeStorage.getAll();
    const invoices = invoiceStorage.getAll();
    const payroll = payrollStorage.getAll();

    const monthlyPayrollEntries = payroll.filter(p => 
      p.month === new Date().toLocaleDateString('en-US', { month: 'long' }) &&
      p.year === new Date().getFullYear()
    );

    setStats({
      totalClients: clients.length,
      totalEmployees: employees.length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      pendingInvoices: invoices.filter(i => i.status === 'sent').length,
      totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
      monthlyPayroll: monthlyPayrollEntries.reduce((sum, p) => sum + p.netSalary, 0),
      activeEmployees: employees.filter(e => e.status === 'active').length
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-sm text-blue-100">Today's Date</div>
                <div className="font-semibold">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-green-600 mt-1">From paid invoices</p>
            </CardContent>
          </Card>

          {/* Invoices Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalInvoices}</div>
              <p className="text-xs text-blue-600 mt-1">
                {stats.paidInvoices} paid • {stats.pendingInvoices} pending
              </p>
            </CardContent>
          </Card>

          {/* Employees Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.activeEmployees}</div>
              <p className="text-xs text-purple-600 mt-1">Active employees</p>
            </CardContent>
          </Card>

          {/* Payroll Card */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Monthly Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{formatCurrency(stats.monthlyPayroll)}</div>
              <p className="text-xs text-orange-600 mt-1">Current month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.role !== 'employee' && (
                <>
                  <Link href="/invoices/create">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-blue-600 rounded mr-3"></div>
                      Create New Invoice
                    </Button>
                  </Link>
                  <Link href="/employees">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                      Manage Employees
                    </Button>
                  </Link>
                  <Link href="/payroll">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-purple-600 rounded mr-3"></div>
                      Process Payroll
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/attendance">
                <Button variant="outline" className="w-full justify-start">
                  <div className="w-4 h-4 bg-orange-600 rounded-full mr-3"></div>
                  {user?.role === 'employee' ? 'Clock In/Out' : 'View Attendance'}
                </Button>
              </Link>
              <Link href="/leaves">
                <Button variant="outline" className="w-full justify-start">
                  <div className="w-4 h-4 bg-red-600 rounded mr-3"></div>
                  {user?.role === 'employee' ? 'Request Leave' : 'Manage Leaves'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System initialized</p>
                    <p className="text-xs text-gray-500">Welcome to Richezza Mega Value</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard ready</p>
                    <p className="text-xs text-gray-500">All modules are active</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User logged in</p>
                    <p className="text-xs text-gray-500">Session started successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Info Footer */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Richezza Mega Value</h3>
              <p className="text-sm text-gray-600 mb-2">
                Complete Business Management Suite - A THE RICHHDAD GROUP Company
              </p>
              <p className="text-xs text-gray-500">
                Streamlining billing, payroll, and attendance management for modern businesses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}