import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  History,
  CreditCard,
  Filter,
  X,
  Globe,
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  countryFlag: string;
  level: string;
  group: string;
  teacher: string;
  credits: number;
  lastClass: string;
  nextClass: string;
  attendance: number;
  status: "active" | "inactive" | "warning";
  enrollmentDate: string;
  totalClasses: number;
}

// Mock data de estudiantes
const mockStudents: Student[] = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 555 123 4567",
    country: "Estados Unidos",
    countryFlag: "🇺🇸",
    level: "B2",
    group: "B2 Conversación Avanzada",
    teacher: "Sofia López",
    credits: 8,
    lastClass: "Hace 2 días",
    nextClass: "Hoy, 14:00",
    attendance: 94,
    status: "active",
    enrollmentDate: "2024-01-15",
    totalClasses: 45,
  },
  {
    id: 2,
    name: "Liu Wei",
    email: "liu.wei@email.com",
    phone: "+86 138 0000 0000",
    country: "China",
    countryFlag: "🇨🇳",
    level: "A2",
    group: "A2 Gramática Intensiva",
    teacher: "Carlos Ruiz",
    credits: 5,
    lastClass: "Hace 1 semana",
    nextClass: "Mañana, 10:00",
    attendance: 88,
    status: "active",
    enrollmentDate: "2024-02-20",
    totalClasses: 28,
  },
  {
    id: 3,
    name: "Pierre Dubois",
    email: "pierre.dubois@email.com",
    phone: "+33 1 23 45 67 89",
    country: "Francia",
    countryFlag: "🇫🇷",
    level: "B1",
    group: "B1 Intermedio",
    teacher: "Ana Martín",
    credits: 2,
    lastClass: "Hace 3 días",
    nextClass: "Sin programar",
    attendance: 76,
    status: "warning",
    enrollmentDate: "2024-01-10",
    totalClasses: 52,
  },
  {
    id: 4,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@email.com",
    phone: "+81 3 1234 5678",
    country: "Japón",
    countryFlag: "🇯🇵",
    level: "A1",
    group: "A1 Principiantes",
    teacher: "María González",
    credits: 12,
    lastClass: "Ayer",
    nextClass: "Hoy, 16:00",
    attendance: 96,
    status: "active",
    enrollmentDate: "2024-03-01",
    totalClasses: 20,
  },
  {
    id: 5,
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+55 11 98765 4321",
    country: "Brasil",
    countryFlag: "🇧🇷",
    level: "B2",
    group: "B2 Conversación Avanzada",
    teacher: "Sofia López",
    credits: 0,
    lastClass: "Hace 2 semanas",
    nextClass: "Sin créditos",
    attendance: 82,
    status: "inactive",
    enrollmentDate: "2023-11-15",
    totalClasses: 65,
  },
];

const levels = ["Todos", "A1", "A2", "B1", "B2", "C1", "C2"];
const countries = ["Todos", "Estados Unidos", "China", "Francia", "Japón", "Brasil", "Alemania", "Italia"];
const teachers = ["Todos", "María González", "Carlos Ruiz", "Ana Martín", "Sofia López"];

interface QuickStudentSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickStudentSearchDialog({
  open,
  onOpenChange,
}: QuickStudentSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [teacherFilter, setTeacherFilter] = useState("Todos");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filtrar estudiantes
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);
      
      const matchesLevel = levelFilter === "Todos" || student.level === levelFilter;
      const matchesCountry = countryFilter === "Todos" || student.country === countryFilter;
      const matchesTeacher = teacherFilter === "Todos" || student.teacher === teacherFilter;

      return matchesSearch && matchesLevel && matchesCountry && matchesTeacher;
    });
  }, [searchTerm, levelFilter, countryFilter, teacherFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "warning": return "bg-yellow-100 text-yellow-700";
      case "inactive": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Activo";
      case "warning": return "Requiere atención";
      case "inactive": return "Sin créditos";
      default: return status;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLevelFilter("Todos");
    setCountryFilter("Todos");
    setTeacherFilter("Todos");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-[var(--primary-green)]">
              Búsqueda Rápida de Estudiantes
            </DialogTitle>
            <Badge variant="outline" className="text-sm">
              {filteredStudents.length} estudiantes encontrados
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                <SelectTrigger className="w-[180px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Profesor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(levelFilter !== "Todos" || countryFilter !== "Todos" || teacherFilter !== "Todos") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="h-[400px] pr-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron estudiantes con los filtros aplicados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{student.countryFlag}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)]">{student.name}</h4>
                          <p className="text-sm text-[var(--text-secondary)]">{student.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              Nivel {student.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {student.teacher}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {student.credits} créditos
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusText(student.status)}
                        </Badge>
                        {student.nextClass !== "Sin programar" && student.nextClass !== "Sin créditos" && (
                          <p className="text-xs text-[var(--text-secondary)]">
                            Próxima: {student.nextClass}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Enviando mensaje a ${student.name}`);
                        }}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Mensaje
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Programando clase para ${student.name}`);
                        }}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Programar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Ver historial de ${student.name}`);
                        }}
                      >
                        <History className="h-3 w-3 mr-1" />
                        Historial
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{selectedStudent.countryFlag}</span>
                  {selectedStudent.name}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="classes">Clases</TabsTrigger>
                  <TabsTrigger value="actions">Acciones</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{selectedStudent.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">País</p>
                        <p className="font-medium">{selectedStudent.country}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nivel</p>
                        <p className="font-medium">{selectedStudent.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grupo</p>
                        <p className="font-medium">{selectedStudent.group}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Profesor</p>
                        <p className="font-medium">{selectedStudent.teacher}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <Badge className={`mt-1 ${getStatusColor(selectedStudent.status)}`}>
                          {getStatusText(selectedStudent.status)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Fecha de inscripción</p>
                        <p className="font-medium">{selectedStudent.enrollmentDate}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="text-2xl font-bold">{selectedStudent.totalClasses}</span>
                      </div>
                      <p className="text-sm text-gray-600">Clases totales</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <span className="text-2xl font-bold">{selectedStudent.credits}</span>
                      </div>
                      <p className="text-sm text-gray-600">Créditos restantes</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">Asistencia promedio</span>
                      <span className="font-semibold text-blue-700">{selectedStudent.attendance}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">Última clase</span>
                      <span className="font-medium">{selectedStudent.lastClass}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">Próxima clase</span>
                      <span className="font-medium">{selectedStudent.nextClass}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar mensaje
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar clase
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <History className="h-4 w-4 mr-2" />
                    Ver historial completo
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar créditos
                  </Button>
                  {selectedStudent.status === "warning" && (
                    <Button className="w-full justify-start bg-yellow-500 hover:bg-yellow-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Contactar urgente
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}