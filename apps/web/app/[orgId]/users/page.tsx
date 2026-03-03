'use client';

import { useState } from 'react';
import { Plus, Search, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@acme.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 mins ago',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@acme.com',
    role: 'Manager',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@acme.com',
    role: 'User',
    status: 'Active',
    lastActive: '3 hours ago',
  },
];

export default function UsersPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = users.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      width: 'min-w-48',
      render: (u) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {u.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{u.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email', sortable: true, width: 'min-w-48' },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      width: 'w-32',
      render: (u) => <Badge variant="outline">{u.role}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-24',
      render: (u) => <Badge>{u.status}</Badge>,
    },
    { key: 'lastActive', label: 'Last Active', width: 'w-32', tdClassName: 'text-gray-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
          <p className="text-muted-foreground">Manage team members and permissions</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="user@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowDialog(false)}>Send Invite</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filtered} columns={userColumns} hasCheckBox={false} />
        </CardContent>
      </Card>
    </div>
  );
}
