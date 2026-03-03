import { Plus, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const warehouses = [
  {
    id: 1,
    name: 'Central Warehouse',
    location: '123 Storage Lane',
    capacity: '50,000 sq ft',
    stock: '6,320 items',
    utilization: 78,
  },
  {
    id: 2,
    name: 'North Storage',
    location: '456 North St',
    capacity: '25,000 sq ft',
    stock: '3,150 items',
    utilization: 62,
  },
  {
    id: 3,
    name: 'South Depot',
    location: '789 South Ave',
    capacity: '40,000 sq ft',
    stock: '4,890 items',
    utilization: 71,
  },
];

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations and stock</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((w) => (
          <Card key={w.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{w.name}</CardTitle>
                <Warehouse className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{w.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium">{w.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-sm font-medium">{w.stock}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <div className="mt-1">
                  <Badge variant={w.utilization > 75 ? 'destructive' : 'default'}>
                    {w.utilization}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
