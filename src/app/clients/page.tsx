'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { clientStorage, generateId } from '@/lib/storage';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientList } from '@/components/clients/ClientList';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const allClients = clientStorage.getAll();
    setClients(allClients);
  };

  const handleAddClient = (clientData: any) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    clientStorage.create(newClient);
    loadClients();
    setIsAddingClient(false);
  };

  const handleEditClient = (id: string, updates: Partial<Client>) => {
    clientStorage.update(id, { ...updates, updatedAt: new Date() });
    loadClients();
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      clientStorage.delete(id);
      loadClients();
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600">Manage your client database and contact information</p>
          </div>
          <Button 
            onClick={() => setIsAddingClient(true)}
            className="mt-4 sm:mt-0"
          >
            Add New Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {clients.filter(c => {
                  const clientMonth = new Date(c.createdAt).getMonth();
                  const currentMonth = new Date().getMonth();
                  return clientMonth === currentMonth;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>Search and manage your client information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Client List */}
            <ClientList
              clients={filteredClients}
              onEdit={setEditingClient}
              onDelete={handleDeleteClient}
            />
          </CardContent>
        </Card>

        {/* Add Client Modal */}
        {isAddingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Add New Client</h2>
                <ClientForm
                  onSubmit={handleAddClient}
                  onCancel={() => setIsAddingClient(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Edit Client</h2>
                <ClientForm
                  initialData={editingClient}
                  onSubmit={(data) => handleEditClient(editingClient.id, data)}
                  onCancel={() => setEditingClient(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}