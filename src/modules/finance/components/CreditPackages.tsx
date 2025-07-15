import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Plus, Edit, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: number;
  validityDays: number;
  description: string;
  popular?: boolean;
  discount?: number;
  active: boolean;
  soldCount: number;
}

export default function CreditPackages() {
  const [packages, setPackages] = useState<CreditPackage[]>([
    {
      id: 1,
      name: "Paquete Básico",
      credits: 10,
      price: 4500,
      validityDays: 30,
      description: "Ideal para estudiantes nuevos",
      active: true,
      soldCount: 45,
    },
    {
      id: 2,
      name: "Paquete Estándar",
      credits: 20,
      price: 8000,
      validityDays: 60,
      description: "El más popular entre nuestros estudiantes",
      popular: true,
      discount: 11,
      active: true,
      soldCount: 128,
    },
    {
      id: 3,
      name: "Paquete Premium",
      credits: 50,
      price: 18000,
      validityDays: 90,
      description: "Mejor valor por clase",
      discount: 20,
      active: true,
      soldCount: 67,
    },
    {
      id: 4,
      name: "Paquete Intensivo",
      credits: 100,
      price: 32000,
      validityDays: 120,
      description: "Para estudiantes comprometidos",
      discount: 29,
      active: true,
      soldCount: 23,
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);

  const calculatePricePerClass = (price: number, credits: number) => {
    return Math.round(price / credits);
  };

  const handleEditPackage = (pkg: CreditPackage) => {
    setEditingPackage(pkg);
    setIsEditDialogOpen(true);
  };

  const handleSavePackage = () => {
    if (editingPackage) {
      setPackages(packages.map(pkg => 
        pkg.id === editingPackage.id ? editingPackage : pkg
      ));
    }
    setIsEditDialogOpen(false);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paquetes de Créditos</h2>
          <p className="text-muted-foreground">Configura y gestiona los paquetes disponibles</p>
        </div>
        <Button className="bg-[var(--primary-green)] hover:opacity-90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Paquete
        </Button>
      </div>

      {/* Package Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paquetes Activos</p>
                <p className="text-2xl font-bold">{packages.filter(p => p.active).length}</p>
              </div>
              <Package className="h-8 w-8 text-[var(--primary-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendidos</p>
                <p className="text-2xl font-bold">{packages.reduce((acc, p) => acc + p.soldCount, 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[var(--secondary-blue)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Más Popular</p>
                <p className="text-lg font-bold">20 Clases</p>
              </div>
              <Users className="h-8 w-8 text-[var(--accent-orange)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precio Promedio</p>
                <p className="text-2xl font-bold">$425</p>
                <p className="text-xs text-muted-foreground">por clase</p>
              </div>
              <DollarSign className="h-8 w-8 text-[var(--neutral-gray)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-[var(--primary-green)]' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[var(--primary-green)] text-white">Más Popular</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 border-y">
                <p className="text-3xl font-bold">{pkg.credits}</p>
                <p className="text-sm text-muted-foreground">clases</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Precio total</span>
                  <span className="font-bold">${pkg.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Por clase</span>
                  <span className="font-medium">
                    ${calculatePricePerClass(pkg.price, pkg.credits)}
                  </span>
                </div>
                {pkg.discount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ahorro</span>
                    <Badge variant="secondary" className="text-[var(--primary-green)]">
                      {pkg.discount}% descuento
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vigencia</span>
                  <span className="text-sm">{pkg.validityDays} días</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Vendidos este mes</span>
                  <span className="font-medium">{pkg.soldCount}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEditPackage(pkg)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paquete</DialogTitle>
          </DialogHeader>
          {editingPackage && (
            <div className="space-y-4">
              <div>
                <Label>Nombre del paquete</Label>
                <Input 
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número de clases</Label>
                  <Input 
                    type="number"
                    value={editingPackage.credits}
                    onChange={(e) => setEditingPackage({...editingPackage, credits: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Precio (MXN)</Label>
                  <Input 
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label>Vigencia (días)</Label>
                <Input 
                  type="number"
                  value={editingPackage.validityDays}
                  onChange={(e) => setEditingPackage({...editingPackage, validityDays: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input 
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({...editingPackage, description: e.target.value})}
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Select 
                  value={editingPackage.active ? "active" : "inactive"}
                  onValueChange={(value) => setEditingPackage({...editingPackage, active: value === "active"})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePackage}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}