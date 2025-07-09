import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  Award,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function AcademicPage() {
  // Mock class data
  const classes = [
    {
      id: 1,
      name: "Yoga Matutino",
      teacher: "María González",
      schedule: "L-M-V 7:00-8:00",
      enrolled: 15,
      capacity: 20,
      status: "Activa",
      price: "$350/mes",
    },
    {
      id: 2,
      name: "CrossFit Intensivo",
      teacher: "Juan Pérez",
      schedule: "L-M-V 18:00-19:00",
      enrolled: 20,
      capacity: 20,
      status: "Llena",
      price: "$450/mes",
    },
    {
      id: 3,
      name: "Zumba Fitness",
      teacher: "Sofia Ramírez",
      schedule: "M-J 19:00-20:00",
      enrolled: 12,
      capacity: 25,
      status: "Activa",
      price: "$300/mes",
    },
    {
      id: 4,
      name: "Natación Principiantes",
      teacher: "Roberto Torres",
      schedule: "S-D 9:00-10:00",
      enrolled: 8,
      capacity: 12,
      status: "Activa",
      price: "$500/mes",
    },
  ];

  // Mock programs data
  const programs = [
    {
      id: 1,
      name: "Programa de Pérdida de Peso",
      duration: "3 meses",
      students: 25,
      completion: 72,
      status: "En curso",
    },
    {
      id: 2,
      name: "Entrenamiento Funcional Avanzado",
      duration: "6 meses",
      students: 18,
      completion: 45,
      status: "En curso",
    },
    {
      id: 3,
      name: "Yoga para Principiantes",
      duration: "2 meses",
      students: 30,
      completion: 90,
      status: "Por completar",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Activas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">8 disciplinas diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programas Activos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">73 estudiantes inscritos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,400</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="classes">Clases</TabsTrigger>
          <TabsTrigger value="programs">Programas</TabsTrigger>
          <TabsTrigger value="schedule">Horarios</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestión de Clases</h3>
            <Button>Nueva Clase</Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clase</TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Ocupación</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((class_) => (
                    <TableRow key={class_.id}>
                      <TableCell className="font-medium">{class_.name}</TableCell>
                      <TableCell>{class_.teacher}</TableCell>
                      <TableCell>{class_.schedule}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(class_.enrolled / class_.capacity) * 100} 
                            className="w-[60px]"
                          />
                          <span className="text-sm text-muted-foreground">
                            {class_.enrolled}/{class_.capacity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{class_.price}</TableCell>
                      <TableCell>
                        <Badge variant={class_.status === "Llena" ? "secondary" : "default"}>
                          {class_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Programas Académicos</h3>
            <Button>Nuevo Programa</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="text-base">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duración:</span>
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estudiantes:</span>
                      <span>{program.students}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso:</span>
                        <span>{program.completion}%</span>
                      </div>
                      <Progress value={program.completion} />
                    </div>
                    <Badge variant={program.status === "En curso" ? "default" : "secondary"}>
                      {program.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horario Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">
                    Conflicto de horario detectado: 2 clases programadas en el mismo horario el Martes 15:00
                  </span>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                    <div key={day} className="font-semibold text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  Vista de calendario en desarrollo
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reportes Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Reporte de Asistencia Mensual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Análisis de Ocupación de Clases
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Reporte Financiero
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Rendimiento de Profesores
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasa de Retención</span>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfacción del Cliente</span>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">4.7/5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clases Canceladas</span>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-semibold">3 este mes</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nuevas Inscripciones</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">+28 este mes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}