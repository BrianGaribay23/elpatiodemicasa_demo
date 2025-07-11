import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Mail, Phone, Calendar, Globe, Target, BookOpen, Clock, UserCheck, ChevronRight, Users, Award, TrendingUp, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function StudentsPage() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // Mock student data with Spanish school specifics
  const students = [
    {
      id: 1,
      name: "Emma Wilson",
      country: "🇺🇸",
      email: "emma.wilson@email.com",
      phone: "+1 555 123 4567",
      enrollmentDate: "2024-01-15",
      status: "Activo",
      credits: 8,
      classesAttended: 45,
      level: "B2",
      nativeLanguage: "Inglés",
      objective: "Negocios",
      group: "B2 Conversación Avanzada",
    },
    {
      id: 2,
      name: "Liu Wei",
      country: "🇨🇳",
      email: "liu.wei@email.com",
      phone: "+86 138 0000 0000",
      enrollmentDate: "2024-02-20",
      status: "Activo",
      credits: 5,
      classesAttended: 28,
      level: "A2",
      nativeLanguage: "Mandarín",
      objective: "Estudios",
      group: "A2 Gramática Intensiva",
    },
    {
      id: 3,
      name: "Michael Chen",
      country: "🇺🇸",
      email: "michael.chen@email.com",
      phone: "+1 555 234 5678",
      enrollmentDate: "2024-01-10",
      status: "Activo",
      credits: 10,
      classesAttended: 52,
      level: "B1",
      nativeLanguage: "Inglés",
      objective: "Trabajo",
      group: "B1 Intermedio",
    },
    {
      id: 4,
      name: "Zhang Wei",
      country: "🇨🇳",
      email: "zhang.wei@email.com",
      phone: "+86 139 1111 2222",
      enrollmentDate: "2024-03-05",
      status: "Activo",
      credits: 12,
      classesAttended: 15,
      level: "A1",
      nativeLanguage: "Mandarín",
      objective: "Personal",
      group: "A1 Principiantes",
    },
    {
      id: 5,
      name: "Jennifer Martinez",
      country: "🇺🇸",
      email: "jennifer.m@email.com",
      phone: "+1 555 345 6789",
      enrollmentDate: "2024-02-01",
      status: "Activo",
      credits: 15,
      classesAttended: 38,
      level: "B1",
      nativeLanguage: "Inglés",
      objective: "Viaje",
      group: "B1 Intermedio",
    },
    {
      id: 6,
      name: "Wang Xiaoming",
      country: "🇨🇳",
      email: "wang.xm@email.com",
      phone: "+86 137 3333 4444",
      enrollmentDate: "2024-01-20",
      status: "Activo",
      credits: 3,
      classesAttended: 42,
      level: "B2",
      nativeLanguage: "Mandarín",
      objective: "Estudios",
      group: "B2 Conversación Avanzada",
    },
    {
      id: 7,
      name: "David Thompson",
      country: "🇺🇸",
      email: "david.t@email.com",
      phone: "+1 555 456 7890",
      enrollmentDate: "2024-03-01",
      status: "Activo",
      credits: 20,
      classesAttended: 12,
      level: "A1",
      nativeLanguage: "Inglés",
      objective: "Negocios",
      group: "A1 Principiantes",
    },
    {
      id: 8,
      name: "Li Ming",
      country: "🇨🇳",
      email: "li.ming@email.com",
      phone: "+86 136 5555 6666",
      enrollmentDate: "2024-02-15",
      status: "Activo",
      credits: 7,
      classesAttended: 25,
      level: "A2",
      nativeLanguage: "Mandarín",
      objective: "Trabajo",
      group: "A2 Gramática Intensiva",
    },
    {
      id: 9,
      name: "Robert Anderson",
      country: "🇺🇸",
      email: "robert.a@email.com",
      phone: "+1 555 567 8901",
      enrollmentDate: "2024-01-25",
      status: "Activo",
      credits: 2,
      classesAttended: 48,
      level: "C1",
      nativeLanguage: "Inglés",
      objective: "Certificación",
      group: "C1 Preparación DELE",
    },
    {
      id: 10,
      name: "Marie Dubois",
      country: "🇫🇷",
      email: "marie.d@email.com",
      phone: "+33 6 12 34 56 78",
      enrollmentDate: "2024-03-10",
      status: "Inactivo",
      credits: 0,
      classesAttended: 8,
      level: "A2",
      nativeLanguage: "Francés",
      objective: "Viaje",
      group: "A2 Gramática Intensiva",
    },
  ];

  // Mock groups data
  const groups = [
    {
      id: 1,
      name: "A1 Principiantes",
      level: "A1",
      teacher: "María González",
      schedule: "Lun/Mié 16:00-17:30",
      students: 12,
      maxStudents: 15,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Hoy 16:00",
      description: "Curso mensual para principiantes absolutos",
      avgAttendance: 92,
    },
    {
      id: 2,
      name: "A2 Gramática Intensiva",
      level: "A2",
      teacher: "Carlos Ruiz",
      schedule: "Mar/Jue 10:00-11:30",
      students: 8,
      maxStudents: 12,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Mañana 10:00",
      description: "Enfoque en estructuras gramaticales básicas",
      avgAttendance: 88,
    },
    {
      id: 3,
      name: "B1 Intermedio",
      level: "B1",
      teacher: "Ana Martín",
      schedule: "Lun/Mié 11:00-12:30",
      students: 10,
      maxStudents: 12,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Hoy 11:00",
      description: "Desarrollo de habilidades comunicativas intermedias",
      avgAttendance: 94,
    },
    {
      id: 4,
      name: "B2 Conversación Avanzada",
      level: "B2",
      teacher: "Sofia López",
      schedule: "Mar/Jue 18:00-19:30",
      students: 6,
      maxStudents: 8,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Mañana 18:00",
      description: "Práctica intensiva de conversación y debate",
      avgAttendance: 96,
    },
    {
      id: 5,
      name: "C1 Preparación DELE",
      level: "C1",
      teacher: "María González",
      schedule: "Sáb 09:00-12:00",
      students: 5,
      maxStudents: 6,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Sábado 09:00",
      description: "Preparación intensiva para el examen DELE C1",
      avgAttendance: 98,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiantes o grupos..."
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
            <p className="text-xs text-muted-foreground">De 15 países</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">A1 hasta C2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Asistencia</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Promedio mensual</p>
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
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>País/Nivel</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Asistencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{student.country}</span>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.nativeLanguage}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {student.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {student.email}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Target className="h-3 w-3 mr-1" />
                            {student.objective}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{student.group}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{student.credits}</span>
                          <span className="text-xs text-muted-foreground ml-1">disponibles</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{student.classesAttended}</span>
                          <span className="text-xs text-muted-foreground ml-1">clases</span>
                        </div>
                      </TableCell>
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
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          {selectedGroup === null ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => {
                  const levelColors = {
                    A1: "bg-blue-500",
                    A2: "bg-green-500",
                    B1: "bg-yellow-500",
                    B2: "bg-orange-500",
                    C1: "bg-red-500",
                    C2: "bg-purple-500",
                  };
                  
                  return (
                    <Card 
                      key={group.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{group.teacher}</p>
                          </div>
                          <Badge className={`${levelColors[group.level as keyof typeof levelColors]} text-white`}>
                            {group.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {group.schedule}
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {group.students}/{group.maxStudents} estudiantes
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            Próxima clase: {group.nextClass}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progreso del curso</span>
                            <span className="font-medium">{group.progress}%</span>
                          </div>
                          <Progress value={group.progress} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Asistencia: </span>
                            <span className="font-medium">{group.avgAttendance}%</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Crear Nuevo Grupo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Grupo
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            // Group Detail View
            (() => {
              const group = groups.find(g => g.id === selectedGroup);
              const groupStudents = students.filter(s => s.group === group?.name);
              
              if (!group) return null;
              
              return (
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedGroup(null)}
                    className="mb-4"
                  >
                    ← Volver a grupos
                  </Button>
                  
                  {/* Group Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl">{group.name}</CardTitle>
                            <p className="text-muted-foreground mt-1">{group.description}</p>
                          </div>
                          <Badge className="text-lg px-3 py-1" variant="outline">
                            Nivel {group.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Profesor</p>
                            <p className="font-medium">{group.teacher}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Horario</p>
                            <p className="font-medium">{group.schedule}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duración</p>
                            <p className="font-medium">
                              {format(new Date(group.startDate), 'dd/MM')} - {format(new Date(group.endDate), 'dd/MM')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Próxima clase</p>
                            <p className="font-medium">{group.nextClass}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progreso del curso</span>
                              <span className="font-medium">{group.progress}%</span>
                            </div>
                            <Progress value={group.progress} className="h-3" />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-bold">{group.students}</p>
                              <p className="text-xs text-muted-foreground">Estudiantes</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <UserCheck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-bold">{group.avgAttendance}%</p>
                              <p className="text-xs text-muted-foreground">Asistencia</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <Award className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-bold">4.8</p>
                              <p className="text-xs text-muted-foreground">Satisfacción</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Quick Stats */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Resumen Rápido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Capacidad</span>
                            <div className="flex items-center">
                              <span className="font-medium">{group.students}/{group.maxStudents}</span>
                              {group.students >= group.maxStudents && (
                                <Badge variant="secondary" className="ml-2 text-xs">Lleno</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Clases completadas</span>
                            <span className="font-medium">6/8</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Promedio tareas</span>
                            <span className="font-medium">87%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Certificados listos</span>
                            <span className="font-medium">3</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Próximas Clases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Clase {group.level}</p>
                              <p className="text-xs text-muted-foreground">{group.nextClass}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Clase {group.level}</p>
                              <p className="text-xs text-muted-foreground">
                                {group.schedule.includes("Lun/Mié") ? "Mié " + group.schedule.split(" ")[1] : 
                                 group.schedule.includes("Mar/Jue") ? "Jue " + group.schedule.split(" ")[1] :
                                 "Próx. " + group.schedule.split(" ")[0] + " " + group.schedule.split(" ")[1]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Última clase del mes</p>
                              <p className="text-xs text-muted-foreground">29 Nov - Evaluación final</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Students List */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Estudiantes del Grupo</CardTitle>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Estudiante
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead>Asistencia</TableHead>
                            <TableHead>Progreso</TableHead>
                            <TableHead>Última Clase</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupStudents.length > 0 ? (
                            groupStudents.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{student.country}</span>
                                    <div>
                                      <p className="font-medium">{student.name}</p>
                                      <p className="text-xs text-muted-foreground">{student.nativeLanguage}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="text-sm">{student.email}</p>
                                    <p className="text-xs text-muted-foreground">{student.phone}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {student.classesAttended > 40 ? (
                                      <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                    )}
                                    <span className="font-medium">
                                      {Math.round((student.classesAttended / 50) * 100)}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Progress 
                                    value={Math.round((student.classesAttended / 50) * 100)} 
                                    className="w-[60px]" 
                                  />
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  Hace 2 días
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    Ver perfil
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No hay estudiantes en este grupo
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Activities */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente del Grupo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">Emma Wilson</span> completó la tarea de vocabulario
                            </p>
                            <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Award className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">3 estudiantes</span> aprobaron el examen de la Unidad 4
                            </p>
                            <p className="text-xs text-muted-foreground">Ayer</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">2 estudiantes</span> faltaron a la clase del martes
                            </p>
                            <p className="text-xs text-muted-foreground">Hace 2 días</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

