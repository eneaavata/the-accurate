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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
  items: number;
}

const initialSalesOrders: Order[] = [
  {
    id: 'SO-1234',
    customer: 'Acme Corporation',
    date: '2026-01-17',
    amount: '$2,450',
    status: 'Completed',
    items: 12,
  },
  {
    id: 'SO-1233',
    customer: 'TechStart Inc',
    date: '2026-01-17',
    amount: '$5,200',
    status: 'Shipped',
    items: 8,
  },
  {
    id: 'SO-1232',
    customer: 'Global Traders',
    date: '2026-01-16',
    amount: '$1,850',
    status: 'Confirmed',
    items: 15,
  },
  {
    id: 'SO-1231',
    customer: 'StartUp LLC',
    date: '2026-01-16',
    amount: '$890',
    status: 'Draft',
    items: 4,
  },
];

const initialPurchaseOrders: Order[] = [
  {
    id: 'PO-0456',
    customer: 'Tech Supplies Inc',
    date: '2026-01-17',
    amount: '$8,950',
    status: 'Confirmed',
    items: 45,
  },
  {
    id: 'PO-0455',
    customer: 'Office Goods Ltd',
    date: '2026-01-16',
    amount: '$2,340',
    status: 'Draft',
    items: 18,
  },
  {
    id: 'PO-0454',
    customer: 'Hardware Direct',
    date: '2026-01-15',
    amount: '$12,450',
    status: 'Received',
    items: 67,
  },
];

export default function OrdersPage() {
  const [salesOrders, setSalesOrders] = useState<Order[]>(initialSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState<Order[]>(initialPurchaseOrders);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sales');
  const [formData, setFormData] = useState({ customer: '', items: '1', amount: '' });

  const handleCreate = () => {
    const newOrder: Order = {
      id:
        activeTab === 'sales'
          ? `SO-${1235 + salesOrders.length}`
          : `PO-${457 + purchaseOrders.length}`,
      customer: formData.customer,
      date: new Date().toISOString().split('T')[0],
      amount: `$${formData.amount}`,
      status: 'Draft',
      items: parseInt(formData.items) || 1,
    };
    if (activeTab === 'sales') setSalesOrders([newOrder, ...salesOrders]);
    else setPurchaseOrders([newOrder, ...purchaseOrders]);
    setShowCreateDialog(false);
    setFormData({ customer: '', items: '1', amount: '' });
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      Completed: 'default',
      Received: 'default',
      Shipped: 'outline',
      Confirmed: 'secondary',
      Draft: 'secondary',
    };
    return variants[status] || 'secondary';
  };

  const filteredOrders =
    activeTab === 'sales'
      ? salesOrders.filter(
          (o) =>
            o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : purchaseOrders.filter(
          (o) =>
            o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const orderColumns: Column<Order>[] = [
    { key: 'id', label: 'Order ID', sortable: true, width: 'w-32' },
    {
      key: 'customer',
      label: activeTab === 'sales' ? 'Customer' : 'Supplier',
      sortable: true,
      width: 'min-w-48',
    },
    { key: 'date', label: 'Date', sortable: true, width: 'w-32' },
    { key: 'items', label: 'Items', sortable: true, width: 'w-24' },
    { key: 'amount', label: 'Amount', sortable: true, width: 'w-28' },
    {
      key: 'status',
      label: 'Status',
      width: 'w-32',
      render: (order) => <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your purchase and sales orders</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create New {activeTab === 'sales' ? 'Sales' : 'Purchase'} Order
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{activeTab === 'sales' ? 'Customer' : 'Supplier'}</Label>
                <Input
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Items</Label>
                <Input
                  type="number"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredOrders} columns={orderColumns} hasCheckBox={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="purchase">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredOrders} columns={orderColumns} hasCheckBox={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
