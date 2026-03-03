'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  warehouse: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialProducts: Product[] = [
  {
    id: 1,
    sku: 'PROD-001',
    name: 'Wireless Mouse',
    category: 'Electronics',
    stock: 245,
    price: '$29.99',
    warehouse: 'Central',
    status: 'In Stock',
  },
  {
    id: 2,
    sku: 'PROD-002',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    stock: 156,
    price: '$89.99',
    warehouse: 'Central',
    status: 'In Stock',
  },
  {
    id: 3,
    sku: 'PROD-003',
    name: 'USB-C Cable',
    category: 'Accessories',
    stock: 8,
    price: '$12.99',
    warehouse: 'North',
    status: 'Low Stock',
  },
  {
    id: 4,
    sku: 'PROD-004',
    name: 'Office Chair',
    category: 'Furniture',
    stock: 45,
    price: '$249.99',
    warehouse: 'South',
    status: 'In Stock',
  },
  {
    id: 5,
    sku: 'PROD-005',
    name: 'Desk Lamp',
    category: 'Furniture',
    stock: 5,
    price: '$34.99',
    warehouse: 'Central',
    status: 'Low Stock',
  },
  {
    id: 6,
    sku: 'PROD-006',
    name: 'Monitor Stand',
    category: 'Accessories',
    stock: 89,
    price: '$45.99',
    warehouse: 'North',
    status: 'In Stock',
  },
  {
    id: 7,
    sku: 'PROD-007',
    name: 'Webcam HD',
    category: 'Electronics',
    stock: 0,
    price: '$79.99',
    warehouse: 'Central',
    status: 'Out of Stock',
  },
  {
    id: 8,
    sku: 'PROD-008',
    name: 'Notebook Set',
    category: 'Stationery',
    stock: 324,
    price: '$15.99',
    warehouse: 'South',
    status: 'In Stock',
  },
];

function getStatusVariant(status: Product['status']) {
  const variants = {
    'In Stock': 'default' as const,
    'Low Stock': 'secondary' as const,
    'Out of Stock': 'outline' as const,
  };
  return variants[status];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    warehouse: 'Central',
  });

  const productColumns: Column<Product>[] = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      width: 'w-32',
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      width: 'min-w-48',
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: 'w-32',
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      width: 'w-24',
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      width: 'w-24',
    },
    {
      key: 'warehouse',
      label: 'Warehouse',
      sortable: true,
      width: 'w-32',
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-32',
      render: (product) => (
        <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 'w-24',
      actions: [
        {
          icon: <Edit className="h-4 w-4\" />,
          label: 'Edit',
          onClick: (product) => openEditDialog(product),
          className: 'text-info hover:bg-info/10',
        },
        {
          icon: <Trash2 className="h-4 w-4\" />,
          label: 'Delete',
          onClick: (product) => handleDelete(product.id),
          className: 'text-destructive hover:bg-destructive/10',
        },
      ],
    },
  ];

  const handleAdd = () => {
    const stockNum = parseInt(formData.stock) || 0;
    const status: Product['status'] =
      stockNum > 50 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock';

    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      stock: stockNum,
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      warehouse: formData.warehouse,
      status,
    };

    setProducts([...products, newProduct]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedProduct) return;

    const stockNum = parseInt(formData.stock) || 0;
    const status: Product['status'] =
      stockNum > 50 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock';

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              sku: formData.sku,
              name: formData.name,
              category: formData.category,
              price: `$${parseFloat(formData.price).toFixed(2)}`,
              stock: stockNum,
              warehouse: formData.warehouse,
              status,
            }
          : p
      )
    );

    setShowEditDialog(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price.replace('$', ''),
      stock: product.stock.toString(),
      warehouse: product.warehouse,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      warehouse: 'Central',
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.status === 'In Stock').length,
    lowStock: products.filter((p) => p.status === 'Low Stock').length,
    outOfStock: products.filter((p) => p.status === 'Out of Stock').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAdd}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <div className="h-3 w-3 rounded-full bg-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <div className="h-3 w-3 rounded-full bg-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <div className="h-3 w-3 rounded-full bg-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={filteredProducts} columns={productColumns} hasCheckBox={false} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            onCancel={() => {
              setShowEditDialog(false);
              setSelectedProduct(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProductFormProps {
  formData: {
    sku: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    warehouse: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      sku: string;
      name: string;
      category: string;
      price: string;
      stock: string;
      warehouse: string;
    }>
  >;
  onSubmit: () => void;
  onCancel: () => void;
}

function ProductForm({ formData, setFormData, onSubmit, onCancel }: ProductFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            placeholder="PROD-XXX"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Stationery">Stationery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="warehouse">Warehouse</Label>
        <Select
          value={formData.warehouse}
          onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
        >
          <SelectTrigger id="warehouse">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Central">Central Warehouse</SelectItem>
            <SelectItem value="North">North Storage</SelectItem>
            <SelectItem value="South">South Depot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save Product</Button>
      </div>
    </div>
  );
}
