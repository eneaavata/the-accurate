'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, Column } from '@/components/ui/Table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 45000, cost: 28000 },
  { month: 'Feb', revenue: 52000, cost: 31000 },
  { month: 'Mar', revenue: 48000, cost: 29000 },
  { month: 'Apr', revenue: 61000, cost: 35000 },
  { month: 'May', revenue: 72000, cost: 42000 },
  { month: 'Jun', revenue: 68000, cost: 39000 },
];

interface TopProduct {
  id: string;
  product: string;
  sku: string;
  sold: number;
  revenue: string;
}

const topProducts: TopProduct[] = [
  { id: '1', product: 'Wireless Mouse', sku: 'PROD-001', sold: 1245, revenue: '$37,350' },
  { id: '2', product: 'Mechanical Keyboard', sku: 'PROD-002', sold: 856, revenue: '$77,041' },
  { id: '3', product: 'USB-C Cable', sku: 'PROD-003', sold: 2134, revenue: '$27,721' },
];

const productColumns: Column<TopProduct>[] = [
  { key: 'product', label: 'Product', sortable: true, width: 'min-w-48' },
  { key: 'sku', label: 'SKU', sortable: true, width: 'w-32' },
  { key: 'sold', label: 'Units Sold', sortable: true, width: 'w-28' },
  { key: 'revenue', label: 'Revenue', sortable: true, width: 'w-28' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and export business analytics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={topProducts} columns={productColumns} hasCheckBox={false} />
        </CardContent>
      </Card>
    </div>
  );
}
