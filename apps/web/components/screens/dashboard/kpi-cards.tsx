'use client';

import { DollarSign, Package, ShoppingCart, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
}

function KPICard({ title, value, change, changeType, icon: Icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: '+20.1% from last month',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Total Orders',
    value: '346',
    change: '+12.5% from last month',
    changeType: 'positive' as const,
    icon: ShoppingCart,
  },
  {
    title: 'Products in Stock',
    value: '6,320',
    change: '-5.2% from last month',
    changeType: 'negative' as const,
    icon: Package,
  },
  {
    title: 'Growth Rate',
    value: '23.5%',
    change: '+4.3% from last month',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
];

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
