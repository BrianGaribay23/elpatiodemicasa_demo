import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  CreditCard,
  AlertCircle,
  TrendingDown,
  Plus,
  History,
  Filter,
} from "lucide-react";

interface StudentCredit {
  id: number;
  name: string;
  country: string;
  email: string;
  currentCredits: number;
  totalPurchased: number;
  totalUsed: number;
  lastPurchase: Date;
  expirationDate: Date | null;
  status: 'active' | 'low' | 'expired';
}

export default function StudentCredits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const students: StudentCredit[] = [
    {
      id: 1,
      name: "Emma Wilson",
      country: "🇺🇸",
      email: "emma.wilson@email.com",
      currentCredits: 12,
      totalPurchased: 40,
      totalUsed: 28,
      lastPurchase: new Date(2025, 0, 5),
      expirationDate: new Date(2025, 2, 5),
      status: 'active',
    },
    {
      id: 2,
      name: "Carlos Chen",
      country: "🇨🇳",
      email: "carlos.chen@email.com",
      currentCredits: 2,
      totalPurchased: 20,
      totalUsed: 18,
      lastPurchase: new Date(2024, 11, 15),
      expirationDate: new Date(2025, 1, 15),
      status: 'low',
    },
    {
      id: 3,
      name: "Sophie Martin",
      country: "🇫🇷",
      email: "sophie.martin@email.com",
      currentCredits: 0,
      totalPurchased: 30,
      totalUsed: 30,
      lastPurchase: new Date(2024, 10, 20),
      expirationDate: new Date(2025, 0, 20),
      status: 'expired',
    },
    {
      id: 4,
      name: "Ana García",
      country: "🇲🇽",
      email: "ana.garcia@email.com",
      currentCredits: 25,
      totalPurchased: 50,
      totalUsed: 25,
      lastPurchase: new Date(2025, 0, 10),
      expirationDate: new Date(2025, 3, 10),
      status: 'active',
    },
    {
      id: 5,
      name: "Michael Brown",
      country: "🇺🇸",
      email: "michael.brown@email.com",
      currentCredits: 3,
      totalPurchased: 60,
      totalUsed: 57,
      lastPurchase: new Date(2024, 11, 28),
      expirationDate: new Date(2025, 1, 28),
      status: 'low',
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, credits: number) => {
    if (status === 'expired' || credits === 0) {
      return <Badge variant="destructive">Sin créditos</Badge>;
    } else if (status === 'low' || credits <= 3) {
      return <Badge variant="secondary" className="bg-[var(--accent-orange)] text-white">Saldo bajo</Badge>;
    }
    return <Badge variant="default" className="bg-[var(--primary-green)] text-white">Activo</Badge>;
  };

  const calculateUsageRate = (used: number, purchased: number) => {
    if (purchased === 0) return 0;
    return Math.round((used / purchased) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Créditos por Estudiante</h2>
          <p className="text-muted-foreground">Gestiona y monitorea el saldo de créditos</p>
        </div>
        <Button className="bg-[var(--primary-green)] hover:opacity-90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Asignar Créditos
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estudiantes</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-[var(--primary-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Con Saldo Bajo</p>
                <p className="text-2xl font-bold">{students.filter(s => s.status === 'low').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-[var(--accent-orange)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sin Créditos</p>
                <p className="text-2xl font-bold">{students.filter(s => s.currentCredits === 0).length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Créditos Totales</p>
                <p className="text-2xl font-bold">{students.reduce((acc, s) => acc + s.currentCredits, 0)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-[var(--secondary-blue)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            Todos
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("active")}
          >
            Activos
          </Button>
          <Button
            variant={filterStatus === "low" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("low")}
          >
            Saldo Bajo
          </Button>
          <Button
            variant={filterStatus === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("expired")}
          >
            Sin Créditos
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Créditos Actuales</TableHead>
                <TableHead>Total Comprados</TableHead>
                <TableHead>Total Usados</TableHead>
                <TableHead>Tasa de Uso</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{student.country}</span>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">{student.currentCredits}</span>
                  </TableCell>
                  <TableCell>{student.totalPurchased}</TableCell>
                  <TableCell>{student.totalUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[var(--secondary-blue)] h-2 rounded-full"
                          style={{ width: `${calculateUsageRate(student.totalUsed, student.totalPurchased)}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {calculateUsageRate(student.totalUsed, student.totalPurchased)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.lastPurchase.toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    {student.expirationDate ? 
                      student.expirationDate.toLocaleDateString('es-MX') : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(student.status, student.currentCredits)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}