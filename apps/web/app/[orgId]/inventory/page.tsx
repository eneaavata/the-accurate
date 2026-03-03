'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/ui/Table';

interface InventoryItem {
  id: string;
  sku: string;
  product: string;
  location: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastRestocked: string;
}

const inventoryData: InventoryItem[] = [
  {
    id: '1',
    sku: 'PROD-001',
    product: 'Wireless Mouse',
    location: 'Central Warehouse',
    currentStock: 245,
    minStock: 50,
    maxStock: 500,
    status: 'In Stock',
    lastRestocked: '2026-01-25',
  },
  {
    id: '2',
    sku: 'PROD-002',
    product: 'Mechanical Keyboard',
    location: 'Central Warehouse',
    currentStock: 156,
    minStock: 30,
    maxStock: 300,
    status: 'In Stock',
    lastRestocked: '2026-01-24',
  },
  {
    id: '3',
    sku: 'PROD-003',
    product: 'USB-C Cable',
    location: 'North Storage',
    currentStock: 8,
    minStock: 20,
    maxStock: 200,
    status: 'Low Stock',
    lastRestocked: '2026-01-15',
  },
  {
    id: '4',
    sku: 'PROD-004',
    product: 'Office Chair',
    location: 'South Depot',
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    status: 'In Stock',
    lastRestocked: '2026-01-20',
  },
  {
    id: '5',
    sku: 'PROD-005',
    product: 'Desk Lamp',
    location: 'Central Warehouse',
    currentStock: 5,
    minStock: 15,
    maxStock: 150,
    status: 'Low Stock',
    lastRestocked: '2026-01-10',
  },
  {
    id: '6',
    sku: 'PROD-006',
    product: 'Monitor Stand',
    location: 'North Storage',
    currentStock: 89,
    minStock: 25,
    maxStock: 200,
    status: 'In Stock',
    lastRestocked: '2026-01-26',
  },
  {
    id: '7',
    sku: 'PROD-007',
    product: 'Webcam HD',
    location: 'Central Warehouse',
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    status: 'Out of Stock',
    lastRestocked: '2025-12-28',
  },
  {
    id: '8',
    sku: 'PROD-008',
    product: 'Notebook Set',
    location: 'South Depot',
    currentStock: 324,
    minStock: 100,
    maxStock: 500,
    status: 'In Stock',
    lastRestocked: '2026-01-27',
  },
  {
    id: '9',
    sku: 'PROD-009',
    product: 'Headphones',
    location: 'North Storage',
    currentStock: 12,
    minStock: 30,
    maxStock: 150,
    status: 'Low Stock',
    lastRestocked: '2026-01-18',
  },
  {
    id: '10',
    sku: 'PROD-010',
    product: 'External SSD 1TB',
    location: 'Central Warehouse',
    currentStock: 67,
    minStock: 15,
    maxStock: 100,
    status: 'In Stock',
    lastRestocked: '2026-01-23',
  },
];

const getStatusVariant = (status: InventoryItem['status']) => {
  const variants = {
    'In Stock': 'default' as const,
    'Low Stock': 'secondary' as const,
    'Out of Stock': 'destructive' as const,
  };
  return variants[status];
};

const inventoryColumns: Column<InventoryItem>[] = [
  { key: 'sku', label: 'SKU', sortable: true, width: 'w-32' },
  { key: 'product', label: 'Product', sortable: true, width: 'min-w-48' },
  { key: 'location', label: 'Location', sortable: true, width: 'min-w-40' },
  { key: 'currentStock', label: 'Current Stock', sortable: true, width: 'w-32' },
  { key: 'minStock', label: 'Min. Stock', sortable: true, width: 'w-28' },
  { key: 'maxStock', label: 'Max. Stock', sortable: true, width: 'w-28' },
  {
    key: 'status',
    label: 'Status',
    width: 'w-32',
    render: (item) => <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>,
  },
  { key: 'lastRestocked', label: 'Last Restocked', sortable: true, width: 'w-36' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Monitor stock levels and manage warehouse inventory
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold mt-2">8,432</p>
              </div>
              <Warehouse className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-3xl font-bold mt-2">23</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Value</p>
                <p className="text-3xl font-bold mt-2">$124K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Current stock levels across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={inventoryData} columns={inventoryColumns} hasCheckBox={false} />
        </CardContent>
      </Card>
    </div>
  );
}
