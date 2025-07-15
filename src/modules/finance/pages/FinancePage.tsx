import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Search,
  Plus,
  Receipt,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CreditPackages from "../components/CreditPackages";
import InvoiceGenerator from "../components/InvoiceGenerator";
import StudentCredits from "../components/StudentCredits";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);

  // Mock data
  const stats = {
    monthlyRevenue: 125400,
    monthlyRevenueChange: 12.5,
    activePackages: 156,
    activePackagesChange: 8,
    pendingPayments: 12,
    pendingAmount: 15600,
    creditsInCirculation: 1245,
    creditsUsedThisMonth: 456,
  };

  const recentTransactions = [
    {
      id: 1,
      student: "Emma Wilson",
      type: "purchase",
      package: "20 Clases",
      amount: 8000,
      credits: 20,
      date: new Date(2025, 0, 15),
      status: "completed",
      invoice: "FAC-2025-001",
    },
    {
      id: 2,
      student: "Carlos Chen",
      type: "purchase",
      package: "10 Clases",
      amount: 4500,
      credits: 10,
      date: new Date(2025, 0, 14),
      status: "completed",
      invoice: "FAC-2025-002",
    },
    {
      id: 3,
      student: "Ana García",
      type: "renewal",
      package: "50 Clases",
      amount: 18000,
      credits: 50,
      date: new Date(2025, 0, 13),
      status: "pending",
      invoice: null,
    },
  ];

  const lowBalanceStudents = [
    { id: 1, name: "Michael Brown", credits: 2, lastPurchase: "Hace 3 semanas", country: "🇺🇸" },
    { id: 2, name: "Sophie Martin", credits: 1, lastPurchase: "Hace 1 mes", country: "🇫🇷" },
    { id: 3, name: "Liu Wei", credits: 3, lastPurchase: "Hace 2 semanas", country: "🇨🇳" },
    { id: 4, name: "Jennifer Martinez", credits: 2, lastPurchase: "Hace 3 semanas", country: "🇺🇸" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Finanzas</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gestiona créditos, pagos y facturación
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button 
            className="bg-[var(--primary-green)] hover:opacity-90 text-white"
            onClick={() => setShowInvoiceGenerator(true)}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="packages">Paquetes</TabsTrigger>
          <TabsTrigger value="students">Créditos por Estudiante</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-[var(--primary-green)]">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stats.monthlyRevenueChange}% vs mes anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paquetes Activos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activePackages}</div>
                <div className="flex items-center text-xs text-[var(--primary-green)]">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stats.activePackagesChange}% más que el mes pasado
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                <p className="text-xs text-muted-foreground">
                  Por ${stats.pendingAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Créditos en Circulación</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.creditsInCirculation}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.creditsUsedThisMonth} usados este mes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'purchase' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'purchase' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.student}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.package} • {transaction.credits} créditos
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                          {transaction.invoice && (
                            <Button variant="ghost" size="sm">
                              <Receipt className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Balance Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[var(--accent-orange)]" />
                  Saldo Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowBalanceStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{student.country}</span>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.lastPurchase}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">{student.credits} créditos</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Enviar Recordatorios
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="mt-6">
          <CreditPackages />
        </TabsContent>

        {/* Students Credits Tab */}
        <TabsContent value="students" className="mt-6">
          <StudentCredits />
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial de Transacciones</CardTitle>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Buscar por estudiante..." 
                    className="w-64"
                    icon={<Search className="h-4 w-4" />}
                  />
                  <Button variant="outline">Filtrar</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3">Fecha</th>
                      <th className="pb-3">Estudiante</th>
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Paquete</th>
                      <th className="pb-3">Créditos</th>
                      <th className="pb-3">Monto</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Factura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentTransactions.concat(recentTransactions).map((transaction, idx) => (
                      <tr key={`${transaction.id}-${idx}`} className="text-sm">
                        <td className="py-3">
                          {format(transaction.date, "d MMM yyyy", { locale: es })}
                        </td>
                        <td className="py-3">{transaction.student}</td>
                        <td className="py-3">
                          <Badge variant="outline">
                            {transaction.type === 'purchase' ? 'Compra' : 'Renovación'}
                          </Badge>
                        </td>
                        <td className="py-3">{transaction.package}</td>
                        <td className="py-3">{transaction.credits}</td>
                        <td className="py-3 font-medium">${transaction.amount.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {transaction.invoice ? (
                            <Button variant="ghost" size="sm">
                              <Receipt className="h-4 w-4 mr-1" />
                              {transaction.invoice}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              Generar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Generator Dialog */}
      {showInvoiceGenerator && (
        <InvoiceGenerator
          open={showInvoiceGenerator}
          onOpenChange={setShowInvoiceGenerator}
          onGenerate={(data) => {
            console.log("Factura generada:", data);
            // Aquí se implementaría la lógica para guardar la factura
            setShowInvoiceGenerator(false);
          }}
        />
      )}
    </div>
  );
}