import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, Phone } from "lucide-react";
import NewTeacherDialog from "../components/NewTeacherDialog";

export default function TeachersPage() {
  const [isNewTeacherDialogOpen, setIsNewTeacherDialogOpen] = useState(false);
  // Mock teacher data
  const teachers = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@elpatiodemicasa.com",
      phone: "+52 555 111 2222",
      assignedLevels: ["A1", "A2", "B1"],
      totalClasses: 320,
      status: "Activo",
      schedule: "L-V 7:00-12:00",
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      email: "carlos.ruiz@elpatiodemicasa.com",
      phone: "+52 555 333 4444",
      assignedLevels: ["A2", "B1", "B2"],
      totalClasses: 180,
      status: "Activo",
      schedule: "L-S 15:00-20:00",
    },
    {
      id: 3,
      name: "Ana Martín",
      email: "ana.martin@elpatiodemicasa.com",
      phone: "+52 555 555 6666",
      assignedLevels: ["B1", "B2", "C1"],
      totalClasses: 120,
      status: "Activo",
      schedule: "M-J-S 18:00-21:00",
    },
    {
      id: 4,
      name: "Sofia López",
      email: "sofia.lopez@elpatiodemicasa.com",
      phone: "+52 555 777 8888",
      assignedLevels: ["B2", "C1", "C2"],
      totalClasses: 450,
      status: "Vacaciones",
      schedule: "L-V 6:00-10:00",
    },
    {
      id: 5,
      name: "Diego Fernandez",
      email: "diego.fernandez@elpatiodemicasa.com",
      phone: "+52 555 999 0000",
      assignedLevels: ["A1", "A2", "B1", "B2"],
      totalClasses: 280,
      status: "Activo",
      schedule: "L-V 14:00-19:00",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-[var(--secondary-blue)] text-3xl font-bold leading-tight">Profesores</h2>
          <p className="text-[var(--neutral-gray)] mt-1">Gestiona el equipo de profesores y sus horarios.</p>
        </div>
        <div className="text-[var(--primary-green)] opacity-20">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="px-4 flex justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Buscar profesores..."
            className="pl-10 border-[var(--border-color)]"
          />
        </div>
        <Button className="bg-[var(--primary-green)] hover:opacity-90 text-white" onClick={() => setIsNewTeacherDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Profesor
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--primary-green)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Total Profesores</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">24</p>
          <p className="text-sm text-[var(--text-secondary)]">+2 este mes</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--secondary-blue)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Profesores Activos</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">22</p>
          <p className="text-sm text-[var(--text-secondary)]">92% disponibles</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--accent-orange)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Clases Hoy</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">18</p>
          <p className="text-sm text-[var(--text-secondary)]">6 profesores activos</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--neutral-gray)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Calificación Promedio</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">4.7</p>
          <p className="text-sm text-[var(--text-secondary)]">De 5.0 estrellas</p>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="px-4">
        <Card className="shadow-md border-[var(--border-color)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Lista de Profesores</CardTitle>
          </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-[var(--border-color)]">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Profesor</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Niveles Asignados</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Contacto</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Total Clases</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Horario</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <span className="font-medium text-[var(--text-primary)]">{teacher.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.assignedLevels.map((level) => (
                        <Badge key={level} className="bg-[var(--secondary-blue)] text-white text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        {teacher.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.totalClasses}</TableCell>
                  <TableCell className="text-sm">{teacher.schedule}</TableCell>
                  <TableCell>
                    {teacher.status === "Activo" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EAF2ED] text-[var(--primary-green)]">
                        {teacher.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EDEDEE] text-[var(--neutral-gray)]">
                        {teacher.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        </Card>
      </div>

      {/* New Teacher Dialog */}
      <NewTeacherDialog
        open={isNewTeacherDialogOpen}
        onOpenChange={setIsNewTeacherDialogOpen}
        onSubmit={(data) => {
          console.log("Nuevo profesor:", data);
          // Aquí se implementaría la lógica para guardar el profesor
          // Por ahora solo mostramos en consola
        }}
      />
    </div>
  );
}