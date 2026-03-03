'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  TruckIcon,
  Building2,
  FileText,
  Settings,
  CreditCard,
  LucideIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: Warehouse,
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: Users,
  },
  {
    title: 'Suppliers',
    path: '/suppliers',
    icon: TruckIcon,
  },
  {
    title: 'Branches',
    path: '/branches',
    icon: Building2,
  },
  {
    title: 'Users',
    path: '/users',
    icon: Users,
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: FileText,
  },
  {
    title: 'Billing',
    path: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const orgId = params.orgId as string;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col lg:pt-16">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-4 py-4">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <ul role="list" className="space-y-1">
                  {navItems.map((item) => {
                    const href = `/${orgId}${item.path}`;
                    const isActive = pathname === href;
                    return (
                      <li key={item.title}>
                        <Link
                          href={href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2.5 text-sm font-medium leading-6 transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card">
          {/* Mobile Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <h1 className="text-lg font-bold text-primary">Accurate ERP</h1>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-4 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <ul role="list" className="space-y-1">
                  {navItems.map((item) => {
                    const href = `/${orgId}${item.path}`;
                    const isActive = pathname === href;
                    return (
                      <li key={item.title}>
                        <Link
                          href={href}
                          onClick={onClose}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2.5 text-sm font-medium leading-6 transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
