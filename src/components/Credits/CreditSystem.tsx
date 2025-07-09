import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";

interface Credit {
  id: string;
  studentId: string;
  studentName: string;
  balance: number;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  type: "add" | "deduct" | "refund";
  amount: number;
  reason: string;
  date: string;
}

const CreditSystem = () => {
  const [activeTab, setActiveTab] = useState("balances");
  const [searchQuery, setSearchQuery] = useState("");
  const [addCreditDialogOpen, setAddCreditDialogOpen] = useState(false);

  // Mock data for student credit balances
  const creditBalances: Credit[] = [
    {
      id: "1",
      studentId: "S001",
      studentName: "Ana García",
      balance: 8,
      lastUpdated: "2023-06-15",
    },
    {
      id: "2",
      studentId: "S002",
      studentName: "Carlos Rodríguez",
      balance: 12,
      lastUpdated: "2023-06-18",
    },
    {
      id: "3",
      studentId: "S003",
      studentName: "Elena Martínez",
      balance: 4,
      lastUpdated: "2023-06-10",
    },
    {
      id: "4",
      studentId: "S004",
      studentName: "David López",
      balance: 0,
      lastUpdated: "2023-06-05",
    },
    {
      id: "5",
      studentId: "S005",
      studentName: "María Sánchez",
      balance: 16,
      lastUpdated: "2023-06-20",
    },
  ];

  // Mock data for credit transactions
  const transactions: Transaction[] = [
    {
      id: "T001",
      studentId: "S001",
      studentName: "Ana García",
      type: "add",
      amount: 10,
      reason: "Compra de paquete",
      date: "2023-06-01",
    },
    {
      id: "T002",
      studentId: "S001",
      studentName: "Ana García",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-05",
    },
    {
      id: "T003",
      studentId: "S001",
      studentName: "Ana García",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-12",
    },
    {
      id: "T004",
      studentId: "S002",
      studentName: "Carlos Rodríguez",
      type: "add",
      amount: 15,
      reason: "Compra de paquete",
      date: "2023-06-10",
    },
    {
      id: "T005",
      studentId: "S002",
      studentName: "Carlos Rodríguez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-15",
    },
    {
      id: "T006",
      studentId: "S002",
      studentName: "Carlos Rodríguez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-17",
    },
    {
      id: "T007",
      studentId: "S002",
      studentName: "Carlos Rodríguez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-18",
    },
    {
      id: "T008",
      studentId: "S003",
      studentName: "Elena Martínez",
      type: "add",
      amount: 5,
      reason: "Compra de paquete",
      date: "2023-06-08",
    },
    {
      id: "T009",
      studentId: "S003",
      studentName: "Elena Martínez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-10",
    },
    {
      id: "T010",
      studentId: "S005",
      studentName: "María Sánchez",
      type: "add",
      amount: 20,
      reason: "Compra de paquete",
      date: "2023-06-15",
    },
    {
      id: "T011",
      studentId: "S005",
      studentName: "María Sánchez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-16",
    },
    {
      id: "T012",
      studentId: "S005",
      studentName: "María Sánchez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-18",
    },
    {
      id: "T013",
      studentId: "S005",
      studentName: "María Sánchez",
      type: "deduct",
      amount: 1,
      reason: "Clase realizada",
      date: "2023-06-20",
    },
    {
      id: "T014",
      studentId: "S005",
      studentName: "María Sánchez",
      type: "refund",
      amount: 1,
      reason: "Cancelación a tiempo",
      date: "2023-06-19",
    },
  ];

  // Filter credits based on search query
  const filteredCredits = creditBalances.filter(
    (credit) =>
      credit.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credit.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sistema de Créditos
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar alumno..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setAddCreditDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Añadir Créditos
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="balances"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="balances">Balances de Créditos</TabsTrigger>
          <TabsTrigger value="transactions">
            Historial de Transacciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Balances de Créditos por Alumno</CardTitle>
              <CardDescription>
                Visualización de créditos disponibles para cada alumno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Alumno</TableHead>
                      <TableHead className="text-center">
                        Créditos Disponibles
                      </TableHead>
                      <TableHead>Última Actualización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCredits.length > 0 ? (
                      filteredCredits.map((credit) => (
                        <TableRow key={credit.id}>
                          <TableCell className="font-medium">
                            {credit.studentId}
                          </TableCell>
                          <TableCell>{credit.studentName}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                credit.balance === 0
                                  ? "destructive"
                                  : credit.balance < 3
                                    ? "outline"
                                    : "default"
                              }
                              className="px-3 py-1"
                            >
                              {credit.balance}
                            </Badge>
                          </TableCell>
                          <TableCell>{credit.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Ver Detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No se encontraron resultados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredCredits.length} de {creditBalances.length}{" "}
                alumnos
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>
                Registro de movimientos de créditos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Fecha</TableHead>
                      <TableHead>Alumno</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.studentName}</TableCell>
                          <TableCell>
                            {transaction.type === "add" && (
                              <div className="flex items-center text-green-600">
                                <ArrowUpRight className="mr-1 h-4 w-4" />{" "}
                                Añadido
                              </div>
                            )}
                            {transaction.type === "deduct" && (
                              <div className="flex items-center text-red-600">
                                <ArrowDownRight className="mr-1 h-4 w-4" />{" "}
                                Descontado
                              </div>
                            )}
                            {transaction.type === "refund" && (
                              <div className="flex items-center text-blue-600">
                                <ArrowUpRight className="mr-1 h-4 w-4" />{" "}
                                Reembolsado
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                transaction.type === "deduct"
                                  ? "outline"
                                  : "default"
                              }
                              className={`px-3 py-1 ${transaction.type === "deduct" ? "text-red-600 border-red-300" : transaction.type === "refund" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                            >
                              {transaction.type === "add" ||
                              transaction.type === "refund"
                                ? "+"
                                : "-"}
                              {transaction.amount}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.reason}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No se encontraron resultados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredTransactions.length} de {transactions.length}{" "}
                transacciones
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  Exportar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addCreditDialogOpen} onOpenChange={setAddCreditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Créditos</DialogTitle>
            <DialogDescription>
              Añade créditos a la cuenta de un alumno.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                Alumno
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar alumno" />
                </SelectTrigger>
                <SelectContent>
                  {creditBalances.map((credit) => (
                    <SelectItem key={credit.id} value={credit.studentId}>
                      {credit.studentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Créditos
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                defaultValue="5"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Select defaultValue="package">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Compra de paquete</SelectItem>
                  <SelectItem value="compensation">Compensación</SelectItem>
                  <SelectItem value="promotion">Promoción</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddCreditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditSystem;
