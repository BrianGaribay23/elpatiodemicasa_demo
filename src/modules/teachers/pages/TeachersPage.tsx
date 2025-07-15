import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Mail, Phone, Calendar, Clock, Star, Users, UserCheck } from "lucide-react";
import NewTeacherDialog from "../components/NewTeacherDialog";

export default function TeachersPage() {
  const [isNewTeacherDialogOpen, setIsNewTeacherDialogOpen] = useState(false);
  // Mock teacher data
  const teachers = [
    {
      id: 1,
      name: "María González",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      email: "maria.gonzalez@elpatiodemicasa.com",
      phone: "+52 555 111 2222",
      specialties: ["Yoga", "Pilates"],
      experience: "5 años",
      rating: 4.8,
      totalClasses: 320,
      status: "Activo",
      schedule: "L-V 7:00-12:00",
    },
    {
      id: 2,
      name: "Juan Pérez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
      email: "juan.perez@elpatiodemicasa.com",
      phone: "+52 555 333 4444",
      specialties: ["CrossFit", "Funcional"],
      experience: "3 años",
      rating: 4.6,
      totalClasses: 180,
      status: "Activo",
      schedule: "L-S 15:00-20:00",
    },
    {
      id: 3,
      name: "Sofia Ramírez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
      email: "sofia.ramirez@elpatiodemicasa.com",
      phone: "+52 555 555 6666",
      specialties: ["Zumba", "Baile"],
      experience: "2 años",
      rating: 4.9,
      totalClasses: 120,
      status: "Activo",
      schedule: "M-J-S 18:00-21:00",
    },
    {
      id: 4,
      name: "Roberto Torres",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto",
      email: "roberto.torres@elpatiodemicasa.com",
      phone: "+52 555 777 8888",
      specialties: ["Natación"],
      experience: "7 años",
      rating: 4.7,
      totalClasses: 450,
      status: "Vacaciones",
      schedule: "L-V 6:00-10:00",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profesores..."
            className="flex-1"
          />
        </div>
        <Button onClick={() => setIsNewTeacherDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Profesor
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesores Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">92% disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">6 profesores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesor</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Experiencia</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Total Clases</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
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
                  <TableCell>{teacher.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {teacher.rating}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.totalClasses}</TableCell>
                  <TableCell className="text-sm">{teacher.schedule}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === "Activo" ? "default" : "secondary"}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver perfil</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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