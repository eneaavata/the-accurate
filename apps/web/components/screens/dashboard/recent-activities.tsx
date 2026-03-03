import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentActivities = [
  {
    id: 'ORD-1234',
    type: 'Sales Order',
    customer: 'Acme Corp',
    amount: '$2,450',
    status: 'Completed',
    time: '2 mins ago',
  },
  {
    id: 'ORD-1233',
    type: 'Purchase Order',
    customer: 'Tech Supplies Inc',
    amount: '$5,200',
    status: 'Pending',
    time: '15 mins ago',
  },
  {
    id: 'TRF-0089',
    type: 'Stock Transfer',
    customer: 'Warehouse A → B',
    amount: '250 units',
    status: 'In Transit',
    time: '1 hour ago',
  },
  {
    id: 'ORD-1232',
    type: 'Sales Order',
    customer: 'Global Traders',
    amount: '$1,850',
    status: 'Completed',
    time: '2 hours ago',
  },
  {
    id: 'ORD-1231',
    type: 'Sales Order',
    customer: 'StartUp LLC',
    amount: '$890',
    status: 'Shipped',
    time: '3 hours ago',
  },
];

function getStatusVariant(status: string) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    Completed: 'default',
    Pending: 'secondary',
    'In Transit': 'outline',
    Shipped: 'outline',
  };
  return variants[status] || 'secondary';
}

export function RecentActivities() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Customer/Ref</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium">{activity.id}</td>
                  <td className="py-3 text-sm">{activity.type}</td>
                  <td className="py-3 text-sm">{activity.customer}</td>
                  <td className="py-3 text-sm font-medium">{activity.amount}</td>
                  <td className="py-3">
                    <Badge variant={getStatusVariant(activity.status)}>{activity.status}</Badge>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
