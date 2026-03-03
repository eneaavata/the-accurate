'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const inventoryData = [
  { category: 'Electronics', stock: 1250 },
  { category: 'Furniture', stock: 850 },
  { category: 'Clothing', stock: 2100 },
  { category: 'Tools', stock: 670 },
  { category: 'Books', stock: 1450 },
];

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="category" className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
