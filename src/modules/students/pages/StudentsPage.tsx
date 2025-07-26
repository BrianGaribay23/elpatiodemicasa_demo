import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Users, 
  BookOpen, 
  Globe, 
  Mail,
  Phone,
  Filter,
  Download,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  Award,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronLeft,
  MapPin,
  CalendarDays
} from "lucide-react";
import { format } from "date-fns";
import ClassScheduler from "../components/ClassScheduler";
import AddStudentDialog from "../components/AddStudentDialog";
import GroupReenrollmentDialog from "../components/GroupReenrollmentDialog";
import StudentDetailsModal from "../components/StudentDetailsModal";

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerGroup, setSchedulerGroup] = useState<any>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isReenrollmentOpen, setIsReenrollmentOpen] = useState(false);
  const [reenrollmentGroup, setReenrollmentGroup] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Emma Wilson",
      country: "🇺🇸",
      email: "emma.wilson@email.com",
      phone: "+1 555 123 4567",
      enrollmentDate: "2024-01-15",
      status: "active",
      credits: 8,
      classesAttended: 45,
      level: "B2",
      nativeLanguage: "Inglés",
      objective: "Conversación",
      group: "B2 Conversación Avanzada",
      totalClasses: 50,
      nextClass: "Hoy, 14:00",
      teacher: "Sofia López"
    },
    {
      id: 2,
      name: "Liu Wei",
      country: "🇨🇳",
      email: "liu.wei@email.com",
      phone: "+86 138 0000 0000",
      enrollmentDate: "2024-02-20",
      status: "active",
      credits: 5,
      classesAttended: 28,
      level: "A2",
      nativeLanguage: "Mandarín",
      objective: "Estudios",
      group: "A2 Gramática Intensiva",
      totalClasses: 35,
      nextClass: "Mañana, 10:00",
      teacher: "Carlos Ruiz"
    },
    {
      id: 3,
      name: "Michael Chen",
      country: "🇺🇸",
      email: "michael.chen@email.com",
      phone: "+1 555 234 5678",
      enrollmentDate: "2024-01-10",
      status: "active",
      credits: 10,
      classesAttended: 52,
      level: "B1",
      nativeLanguage: "Inglés",
      objective: "Trabajo",
      group: "B1 Intermedio",
      totalClasses: 60,
      nextClass: "Hoy, 11:00",
      teacher: "Ana Martín"
    },
    {
      id: 4,
      name: "Zhang Wei",
      country: "🇨🇳",
      email: "zhang.wei@email.com",
      phone: "+86 139 1111 2222",
      enrollmentDate: "2024-03-05",
      status: "active",
      credits: 12,
      classesAttended: 15,
      level: "A1",
      nativeLanguage: "Mandarín",
      objective: "Personal",
      group: "A1 Principiantes",
      totalClasses: 20,
      nextClass: "Hoy, 16:00",
      teacher: "María González"
    },
    {
      id: 5,
      name: "Jennifer Martinez",
      country: "🇺🇸",
      email: "jennifer.m@email.com",
      phone: "+1 555 345 6789",
      enrollmentDate: "2024-02-01",
      status: "active",
      credits: 15,
      classesAttended: 38,
      level: "B1",
      nativeLanguage: "Inglés",
      objective: "Viaje",
      group: "B1 Intermedio",
      totalClasses: 45,
      nextClass: "Mañana, 11:00",
      teacher: "Ana Martín"
    },
    {
      id: 6,
      name: "Wang Xiaoming",
      country: "🇨🇳",
      email: "wang.xm@email.com",
      phone: "+86 137 3333 4444",
      enrollmentDate: "2024-01-20",
      status: "active",
      credits: 3,
      classesAttended: 42,
      level: "B2",
      nativeLanguage: "Mandarín",
      objective: "Estudios",
      group: "B2 Conversación Avanzada",
      totalClasses: 48,
      nextClass: "Hoy, 18:00",
      teacher: "Sofia López"
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
      students: 3,
      studentsList: ["Emma Wilson", "Liu Wei", "Pierre Martin"],
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Hoy 16:00",
      description: "Curso mensual para principiantes absolutos",
      avgAttendance: 92,
      location: "Aula 101"
    },
    {
      id: 2,
      name: "A2 Gramática Intensiva",
      level: "A2",
      teacher: "Carlos Ruiz",
      schedule: "Mar/Jue 10:00-11:30",
      students: 4,
      studentsList: ["James Wilson", "Marie Dubois", "Hans Mueller", "Chen Wei"],
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Mañana 10:00",
      description: "Enfoque en estructuras gramaticales básicas",
      avgAttendance: 88,
      location: "Aula 203"
    },
    {
      id: 3,
      name: "B1 Intermedio",
      level: "B1",
      teacher: "Ana Martín",
      schedule: "Lun/Mié 11:00-12:30",
      students: 2,
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Hoy 11:00",
      description: "Desarrollo de habilidades comunicativas intermedias",
      avgAttendance: 94,
      location: "Aula 102"
    },
    {
      id: 4,
      name: "B2 Conversación Avanzada",
      level: "B2",
      teacher: "Sofia López",
      schedule: "Mar/Jue 18:00-19:30",
      students: 3,
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Mañana 18:00",
      description: "Práctica intensiva de conversación y debate",
      avgAttendance: 96,
      location: "Aula 301"
    },
    {
      id: 5,
      name: "C1 Preparación DELE",
      level: "C1",
      teacher: "María González",
      schedule: "Sáb 09:00-12:00",
      students: 1,
      studentsList: ["Sophie Anderson"],
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Sábado 09:00",
      description: "Preparación intensiva para el examen DELE C1",
      avgAttendance: 98,
      location: "Aula 401"
    },
    {
      id: 6,
      name: "C2 Perfeccionamiento",
      level: "C2",
      teacher: "Diego Fernandez",
      schedule: "Vie 14:00-16:00",
      students: 4,
      maxStudents: 4,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      progress: 75,
      nextClass: "Viernes 14:00",
      description: "Perfeccionamiento avanzado del idioma",
      avgAttendance: 100,
      location: "Aula 501"
    },
  ];

  const getLevelBadge = (level: string) => {
    const colors = {
      "A1": "bg-[#EAF2ED] text-[var(--primary-green)]",
      "A2": "bg-[#EAF0F6] text-[var(--secondary-blue)]",
      "B1": "bg-[#FEF5EC] text-[var(--accent-orange)]",
      "B2": "bg-[#EAF2ED] text-[var(--primary-green)]",
      "C1": "bg-[#EAF0F6] text-[var(--secondary-blue)]",
      "C2": "bg-[#EDEDEE] text-[var(--neutral-gray)]"
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EAF2ED] text-[var(--primary-green)]">
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FEF5EC] text-[var(--accent-orange)]">
        En Pausa
      </span>
    );
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.level.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectedGroupData = groups.find(g => g.id === selectedGroup);
  const groupStudents = selectedGroup ? students.filter(s => s.group === selectedGroupData?.name) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-[var(--secondary-blue)] text-3xl font-bold leading-tight">Estudiantes</h2>
          <p className="text-[var(--neutral-gray)] mt-1">Gestiona tu lista de estudiantes y sigue su progreso.</p>
        </div>
        <Button 
          className="bg-[var(--primary-green)] hover:opacity-90 text-white"
          onClick={() => setIsAddStudentOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Estudiante
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--primary-green)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Total Estudiantes</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">156</p>
          <p className="text-sm text-[var(--text-secondary)]">De 15 países</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--secondary-blue)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Grupos Activos</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">12</p>
          <p className="text-sm text-[var(--text-secondary)]">A1 hasta C2</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--accent-orange)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Tasa de Asistencia</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">94%</p>
          <p className="text-sm text-[var(--text-secondary)]">Promedio mensual</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--neutral-gray)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Nuevos este Mes</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">12</p>
          <p className="text-sm text-[var(--text-secondary)]">+20% vs mes anterior</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            type="text"
            placeholder="Buscar estudiantes o grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[var(--border-color)]"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[var(--border-color)]">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" className="border-[var(--border-color)]">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
              Estudiantes
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
              Grupos
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-6">
            <Card className="shadow-md border-[var(--border-color)]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-[var(--border-color)]">
                      <tr className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">
                        <th className="px-6 py-4 text-left">Estudiante</th>
                        <th className="px-6 py-4 text-left">País/Nivel</th>
                        <th className="px-6 py-4 text-left">Contacto</th>
                        <th className="px-6 py-4 text-left">Grupo</th>
                        <th className="px-6 py-4 text-left">Créditos</th>
                        <th className="px-6 py-4 text-left">Asistencia</th>
                        <th className="px-6 py-4 text-left">Estado</th>
                        <th className="px-6 py-4 text-left"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{student.country}</span>
                              <div>
                                <p className="font-medium text-[var(--text-primary)]">{student.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{student.nativeLanguage}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getLevelBadge(student.level)} font-semibold`}>
                              {student.level}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                <Mail className="h-3 w-3 mr-1" />
                                {student.email}
                              </div>
                              <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                <Target className="h-3 w-3 mr-1" />
                                {student.objective}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{student.group}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="font-medium">{student.credits}</span>
                              <span className="text-xs text-[var(--text-secondary)] ml-1">disponibles</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="font-medium">{student.classesAttended}</span>
                              <span className="text-xs text-[var(--text-secondary)] ml-1">clases</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(student.status)}
                          </td>
                          <td className="px-6 py-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[var(--secondary-blue)]"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsStudentDetailsOpen(true);
                              }}
                            >
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="mt-6 space-y-4">
            {selectedGroup === null ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-[var(--border-color)]"
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">{group.name}</CardTitle>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{group.teacher}</p>
                          </div>
                          <Badge className={`${getLevelBadge(group.level)} font-semibold shadow-sm`}>
                            {group.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-[var(--neutral-gray)]" />
                            {group.schedule}
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-[var(--neutral-gray)]" />
                            {group.students}/4 estudiantes
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-[var(--neutral-gray)]" />
                            Próxima clase: {group.nextClass}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-[var(--neutral-gray)]" />
                            {group.location}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Progreso del curso</span>
                            <span className="font-medium">{group.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[var(--secondary-blue)] h-2 rounded-full transition-all"
                              style={{ width: `${group.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm">
                            <span className="text-[var(--text-secondary)]">Asistencia: </span>
                            <span className="font-medium">{group.avgAttendance}%</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[var(--secondary-blue)]" />
                        </div>

                        <div className="pt-3 border-t border-[var(--border-color)] flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReenrollmentGroup(group);
                              setIsReenrollmentOpen(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Reinscribir Grupo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card className="hover:shadow-lg transition-shadow border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Crear Nuevo Grupo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full border-[var(--primary-green)] text-[var(--primary-green)] hover:bg-[var(--primary-green)] hover:text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Grupo
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : selectedGroupData && (
              // Group Detail View
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedGroup(null)}
                  className="mb-4 text-[var(--secondary-blue)]"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver a grupos
                </Button>
                
                {/* Group Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="lg:col-span-2 shadow-md border-[var(--border-color)]">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl font-bold text-[var(--text-primary)]">{selectedGroupData.name}</CardTitle>
                          <p className="text-[var(--text-secondary)] mt-1">{selectedGroupData.description}</p>
                        </div>
                        <Badge className={`${getLevelBadge(selectedGroupData.level)} text-lg px-3 py-1 font-semibold`}>
                          Nivel {selectedGroupData.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-[var(--text-secondary)]">Profesor</p>
                          <p className="font-medium">{selectedGroupData.teacher}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--text-secondary)]">Horario</p>
                          <p className="font-medium">{selectedGroupData.schedule}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--text-secondary)]">Duración</p>
                          <p className="font-medium">
                            {format(new Date(selectedGroupData.startDate), 'dd/MM')} - {format(new Date(selectedGroupData.endDate), 'dd/MM')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--text-secondary)]">Próxima clase</p>
                          <p className="font-medium">{selectedGroupData.nextClass}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[var(--text-secondary)]">Progreso del curso</span>
                            <span className="font-medium">{selectedGroupData.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-[var(--primary-green)] h-3 rounded-full transition-all"
                              style={{ width: `${selectedGroupData.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Users className="h-5 w-5 mx-auto mb-1 text-[var(--secondary-blue)]" />
                            <p className="text-2xl font-bold">{selectedGroupData.students}</p>
                            <p className="text-xs text-[var(--text-secondary)]">Estudiantes</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <UserCheck className="h-5 w-5 mx-auto mb-1 text-[var(--primary-green)]" />
                            <p className="text-2xl font-bold">{selectedGroupData.avgAttendance}%</p>
                            <p className="text-xs text-[var(--text-secondary)]">Asistencia</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Award className="h-5 w-5 mx-auto mb-1 text-[var(--accent-orange)]" />
                            <p className="text-2xl font-bold">4.8</p>
                            <p className="text-xs text-[var(--text-secondary)]">Satisfacción</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <Card className="shadow-md border-[var(--border-color)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Resumen Rápido</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Capacidad</span>
                          <div className="flex items-center">
                            <span className="font-medium">{selectedGroupData.students}/4</span>
                            {selectedGroupData.students >= 4 && (
                              <Badge className="ml-2 text-xs bg-[var(--neutral-gray)] text-white">Lleno</Badge>
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
                    
                    <Card className="shadow-md border-[var(--border-color)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Próximas Clases</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--secondary-blue)] mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Clase {selectedGroupData.level}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{selectedGroupData.nextClass}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--primary-green)] mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Clase {selectedGroupData.level}</p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {selectedGroupData.schedule.includes("Lun/Mié") ? "Mié " + selectedGroupData.schedule.split(" ")[1] : 
                               selectedGroupData.schedule.includes("Mar/Jue") ? "Jue " + selectedGroupData.schedule.split(" ")[1] :
                               "Próx. " + selectedGroupData.schedule.split(" ")[0] + " " + selectedGroupData.schedule.split(" ")[1]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)] mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Última clase del mes</p>
                            <p className="text-xs text-[var(--text-secondary)]">29 Nov - Evaluación final</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Students List */}
                <Card className="shadow-md border-[var(--border-color)]">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Estudiantes del Grupo</CardTitle>
                      <Button size="sm" className="bg-[var(--primary-green)] hover:opacity-90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Estudiante
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-[var(--border-color)]">
                          <tr className="text-xs font-medium uppercase tracking-wider text-[var(--neutral-gray)]">
                            <th className="px-6 py-4 text-left">Estudiante</th>
                            <th className="px-6 py-4 text-left">Contacto</th>
                            <th className="px-6 py-4 text-left">Asistencia</th>
                            <th className="px-6 py-4 text-left">Progreso</th>
                            <th className="px-6 py-4 text-left">Última Clase</th>
                            <th className="px-6 py-4 text-left"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                          {groupStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl">{student.country}</span>
                                  <div>
                                    <p className="font-medium text-[var(--text-primary)]">{student.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{student.nativeLanguage}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="text-sm">{student.email}</p>
                                  <p className="text-xs text-[var(--text-secondary)]">{student.phone}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  {student.classesAttended > 40 ? (
                                    <TrendingUp className="h-4 w-4 text-[var(--primary-green)]" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-[var(--accent-orange)]" />
                                  )}
                                  <span className="font-medium">
                                    {Math.round((student.classesAttended / student.totalClasses) * 100)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="w-[60px] bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-[var(--primary-green)] h-2 rounded-full transition-all"
                                    style={{ width: `${(student.classesAttended / student.totalClasses) * 100}%` }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                Hace 2 días
                              </td>
                              <td className="px-6 py-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-[var(--secondary-blue)]"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setIsStudentDetailsOpen(true);
                                  }}
                                >
                                  Ver perfil
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Activities */}
                <Card className="shadow-md border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Actividad Reciente del Grupo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAF2ED] flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-[var(--primary-green)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Emma Wilson</span> completó la tarea de vocabulario
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAF0F6] flex items-center justify-center">
                          <Award className="h-4 w-4 text-[var(--secondary-blue)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">3 estudiantes</span> aprobaron el examen de la Unidad 4
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">Ayer</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#FEF5EC] flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-[var(--accent-orange)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">2 estudiantes</span> faltaron a la clase del martes
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">Hace 2 días</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Class Scheduler Dialog */}
      {schedulerGroup && (
        <ClassScheduler
          open={isSchedulerOpen}
          onOpenChange={setIsSchedulerOpen}
          group={schedulerGroup}
          onSchedule={(classes) => {
            console.log("Clases programadas:", classes);
            // Aquí se implementaría la lógica para guardar las clases
            // Por ahora solo mostramos en consola
            alert(`Se han programado ${classes.length} clases para el grupo ${schedulerGroup.name}`);
          }}
        />
      )}

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        groups={groups}
        onSubmit={(data) => {
          console.log("Nuevo estudiante:", data);
          // Aquí se implementaría la lógica para guardar el estudiante
          // Por ahora solo mostramos en consola
          alert(`Estudiante ${data.name} agregado exitosamente`);
          setIsAddStudentOpen(false);
        }}
      />
      
      {/* Group Reenrollment Dialog */}
      {reenrollmentGroup && (
        <GroupReenrollmentDialog
          open={isReenrollmentOpen}
          onOpenChange={setIsReenrollmentOpen}
          group={reenrollmentGroup}
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          open={isStudentDetailsOpen}
          onOpenChange={setIsStudentDetailsOpen}
          student={selectedStudent}
        />
      )}
    </div>
  );
}