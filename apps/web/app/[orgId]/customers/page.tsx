'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/ui/Table';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalOrders: number;
  totalSpent: string;
  status: 'Active' | 'Inactive';
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc',
    totalOrders: 45,
    totalSpent: '$125,450',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@globaltraders.com',
    phone: '+1 (555) 234-5678',
    company: 'Global Traders',
    totalOrders: 32,
    totalSpent: '$89,230',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'mchen@innovate.com',
    phone: '+1 (555) 345-6789',
    company: 'Innovate Solutions',
    totalOrders: 28,
    totalSpent: '$67,890',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily@startup.io',
    phone: '+1 (555) 456-7890',
    company: 'StartUp LLC',
    totalOrders: 15,
    totalSpent: '$34,500',
    status: 'Active',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });

  const handleAdd = () => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      ...formData,
      totalOrders: 0,
      totalSpent: '$0',
      status: 'Active',
    };
    setCustomers([...customers, newCustomer]);
    setShowAddDialog(false);
    setFormData({ name: '', email: '', phone: '', company: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this customer?')) setCustomers(customers.filter((c) => c.id !== id));
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerColumns: Column<Customer>[] = [
    { key: 'name', label: 'Name', sortable: true, width: 'min-w-48' },
    { key: 'company', label: 'Company', sortable: true, width: 'min-w-40' },
    { key: 'email', label: 'Email', sortable: true, width: 'min-w-48' },
    { key: 'phone', label: 'Phone', width: 'w-36' },
    { key: 'totalOrders', label: 'Orders', sortable: true, width: 'w-24' },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, width: 'w-32' },
    {
      key: 'status',
      label: 'Status',
      width: 'w-24',
      render: (c) => (
        <Badge variant={c.status === 'Active' ? 'default' : 'secondary'}>{c.status}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 'w-24',
      actions: [
        {
          icon: <Edit className="h-4 w-4" />,
          label: 'Edit',
          onClick: () => {},
          className: 'text-info hover:bg-info/10',
        },
        {
          icon: <Trash2 className="h-4 w-4" />,
          label: 'Delete',
          onClick: (customer) => handleDelete(customer.id),
          className: 'text-destructive hover:bg-destructive/10',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Customer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filteredCustomers} columns={customerColumns} hasCheckBox={false} />
        </CardContent>
      </Card>
    </div>
  );
}
