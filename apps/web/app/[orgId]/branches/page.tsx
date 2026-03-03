import { Plus, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const branches = [
  {
    id: 1,
    name: 'Main Office',
    location: '123 Business St, New York',
    warehouses: 2,
    users: 15,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Downtown Branch',
    location: '456 Commerce Ave, Brooklyn',
    warehouses: 1,
    users: 8,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Warehouse District',
    location: '789 Industrial Rd, Queens',
    warehouses: 3,
    users: 12,
    status: 'Active',
  },
];

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage your business locations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{b.name}</CardTitle>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{b.location}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Warehouses</p>
                <Badge variant="outline">{b.warehouses}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Users</p>
                <Badge variant="outline">{b.users}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{b.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
