'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Invoice } from '@/types';
import { invoiceStorage, formatCurrency } from '@/lib/storage';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const allInvoices = invoiceStorage.getAll();
    setInvoices(allInvoices);
  };

  const handleStatusUpdate = (id: string, status: Invoice['status']) => {
    invoiceStorage.update(id, { status, updatedAt: new Date() });
    loadInvoices();
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      invoiceStorage.delete(id);
      loadInvoices();
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0),
    pendingAmount: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.total, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600">Create, manage, and track your invoices</p>
          </div>
          <Link href="/invoices/create">
            <Button className="mt-4 sm:mt-0">
              Create New Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-green-600 mt-1">{stats.paid} paid invoices</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{formatCurrency(stats.pendingAmount)}</div>
              <p className="text-xs text-orange-600 mt-1">{stats.sent + stats.overdue} unpaid</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.overdue}</div>
              <p className="text-xs text-red-600 mt-1">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice List */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Directory</CardTitle>
            <CardDescription>Search and manage your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search invoices by number, client name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Invoice List Component */}
            <InvoiceList
              invoices={filteredInvoices}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteInvoice}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}