'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  totalPurchases: number;
  totalSpent: string;
  status: 'Active' | 'Inactive';
}

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Tech Supplies Inc',
    email: 'sales@techsupplies.com',
    phone: '+1 (555) 111-2222',
    category: 'Electronics',
    totalPurchases: 78,
    totalSpent: '$456,780',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Office Goods Ltd',
    email: 'orders@officegoods.com',
    phone: '+1 (555) 222-3333',
    category: 'Furniture',
    totalPurchases: 52,
    totalSpent: '$312,450',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Hardware Direct',
    email: 'contact@hardwaredirect.com',
    phone: '+1 (555) 333-4444',
    category: 'Tools',
    totalPurchases: 34,
    totalSpent: '$198,670',
    status: 'Active',
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Electronics',
  });

  const handleAdd = () => {
    setSuppliers([
      ...suppliers,
      {
        id: suppliers.length + 1,
        ...formData,
        totalPurchases: 0,
        totalSpent: '$0',
        status: 'Active',
      },
    ]);
    setShowAddDialog(false);
    setFormData({ name: '', email: '', phone: '', category: 'Electronics' });
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supplierColumns: Column<Supplier>[] = [
    { key: 'name', label: 'Name', sortable: true, width: 'min-w-48' },
    { key: 'category', label: 'Category', sortable: true, width: 'w-32' },
    { key: 'email', label: 'Email', sortable: true, width: 'min-w-48' },
    { key: 'phone', label: 'Phone', width: 'w-36' },
    { key: 'totalPurchases', label: 'Purchases', sortable: true, width: 'w-24' },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, width: 'w-32' },
    {
      key: 'status',
      label: 'Status',
      width: 'w-24',
      render: (s) => (
        <Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>{s.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
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
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add</Button>
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
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filtered} columns={supplierColumns} hasCheckBox={false} />
        </CardContent>
      </Card>
    </div>
  );
}
