import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, Phone, Calendar } from "lucide-react";

export default function StudentsPage() {
  // Mock student data
  const students = [
    {
      id: 1,
      name: "Ana Martínez",
      email: "ana@email.com",
      phone: "+52 555 123 4567",
      enrollmentDate: "2024-01-15",
      status: "Activo",
      credits: 8,
      classesAttended: 12,
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@email.com",
      phone: "+52 555 234 5678",
      enrollmentDate: "2024-02-20",
      status: "Activo",
      credits: 5,
      classesAttended: 8,
    },
    {
      id: 3,
      name: "Laura García",
      email: "laura@email.com",
      phone: "+52 555 345 6789",
      enrollmentDate: "2024-01-10",
      status: "Inactivo",
      credits: 0,
      classesAttended: 15,
    },
    {
      id: 4,
      name: "Roberto Sánchez",
      email: "roberto@email.com",
      phone: "+52 555 456 7890",
      enrollmentDate: "2024-03-05",
      status: "Activo",
      credits: 12,
      classesAttended: 5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiantes..."
            className="flex-1"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Estudiante
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">91% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+20% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Créditos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5</div>
            <p className="text-xs text-muted-foreground">Por estudiante</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fecha de Inscripción</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Clases Asistidas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        {student.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>{student.credits}</TableCell>
                  <TableCell>{student.classesAttended}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Activo" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver detalles</Button>
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

// Import missing icons
import { Users, UserCheck, CreditCard } from "lucide-react";