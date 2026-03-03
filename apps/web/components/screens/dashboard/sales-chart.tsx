'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4500, orders: 45 },
  { month: 'Feb', sales: 5200, orders: 52 },
  { month: 'Mar', sales: 4800, orders: 48 },
  { month: 'Apr', sales: 6100, orders: 61 },
  { month: 'May', sales: 7200, orders: 72 },
  { month: 'Jun', sales: 6800, orders: 68 },
];

export function SalesTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales & Orders Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Sales ($)"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
