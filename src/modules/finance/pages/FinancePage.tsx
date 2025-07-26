import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  Receipt,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CreditPackages from "../components/CreditPackages";
import InvoiceGenerator from "../components/InvoiceGenerator";
import StudentCredits from "../components/StudentCredits";
import InvoiceViewer from "../components/InvoiceViewer";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-[var(--secondary-blue)] text-3xl font-bold leading-tight">Finanzas</h2>
          <p className="text-[var(--neutral-gray)] mt-1">Gestiona créditos, pagos y facturación del sistema.</p>
        </div>
        <div className="text-[var(--primary-green)] opacity-20">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex justify-end gap-2">
        <Button variant="outline" className="border-[var(--border-color)]">
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

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">Resumen</TabsTrigger>
            <TabsTrigger value="packages" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">Paquetes</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">Créditos por Estudiante</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">Transacciones</TabsTrigger>
          </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--primary-green)]">
              <p className="text-[var(--neutral-gray)] text-base font-medium">Ingresos del Mes</p>
              <p className="text-[var(--text-primary)] text-4xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
              <div className="flex items-center text-sm text-[var(--primary-green)]">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stats.monthlyRevenueChange}% vs mes anterior
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--secondary-blue)]">
              <p className="text-[var(--neutral-gray)] text-base font-medium">Paquetes Activos</p>
              <p className="text-[var(--text-primary)] text-4xl font-bold">{stats.activePackages}</p>
              <div className="flex items-center text-sm text-[var(--primary-green)]">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stats.activePackagesChange}% más que el mes pasado
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--accent-orange)]">
              <p className="text-[var(--neutral-gray)] text-base font-medium">Pagos Pendientes</p>
              <p className="text-[var(--text-primary)] text-4xl font-bold">{stats.pendingPayments}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Por ${stats.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--neutral-gray)]">
              <p className="text-[var(--neutral-gray)] text-base font-medium">Créditos en Circulación</p>
              <p className="text-[var(--text-primary)] text-4xl font-bold">{stats.creditsInCirculation}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {stats.creditsUsedThisMonth} usados este mes
              </p>
            </div>
          </div>

          {/* Recent Transactions and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2 shadow-md border-[var(--border-color)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Transacciones Recientes</CardTitle>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(transaction);
                                setShowInvoiceViewer(true);
                              }}
                            >
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
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">
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
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Historial de Transacciones</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                    <Input 
                      placeholder="Buscar por estudiante..." 
                      className="pl-10 border-[var(--border-color)]"
                    />
                  </div>
                  <Button variant="outline" className="border-[var(--border-color)]">Filtrar</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-[var(--border-color)]">
                    <tr className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">
                      <th className="px-6 py-4 text-left">Fecha</th>
                      <th className="px-6 py-4 text-left">Estudiante</th>
                      <th className="px-6 py-4 text-left">Tipo</th>
                      <th className="px-6 py-4 text-left">Paquete</th>
                      <th className="px-6 py-4 text-left">Créditos</th>
                      <th className="px-6 py-4 text-left">Monto</th>
                      <th className="px-6 py-4 text-left">Estado</th>
                      <th className="px-6 py-4 text-left">Factura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {recentTransactions.concat(recentTransactions).map((transaction, idx) => (
                      <tr key={`${transaction.id}-${idx}`} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {format(transaction.date, "d MMM yyyy", { locale: es })}
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{transaction.student}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">
                            {transaction.type === 'purchase' ? 'Compra' : 'Renovación'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{transaction.package}</td>
                        <td className="px-6 py-4">{transaction.credits}</td>
                        <td className="px-6 py-4 font-medium">${transaction.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.invoice ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[var(--secondary-blue)]"
                              onClick={() => {
                                setSelectedInvoice(transaction);
                                setShowInvoiceViewer(true);
                              }}
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              {transaction.invoice}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-[var(--border-color)]">
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
      </div>

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

      {/* Invoice Viewer Dialog */}
      {showInvoiceViewer && selectedInvoice && (
        <InvoiceViewer
          open={showInvoiceViewer}
          onOpenChange={setShowInvoiceViewer}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}