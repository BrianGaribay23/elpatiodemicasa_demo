import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Globe,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  X,
  CreditCard,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import StudentCreditsCard from "./StudentCreditsCard";
import UseCreditsDialog from "./UseCreditsDialog";

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: number;
    name: string;
    country: string;
    email: string;
    phone: string;
    enrollmentDate: string;
    status: string;
    credits: number;
    classesAttended: number;
    level: string;
    nativeLanguage: string;
    objective: string;
    group: string;
    totalClasses: number;
    nextClass: string;
    teacher: string;
  };
}

// Mock credit transactions
const mockCreditTransactions = [
  {
    id: "1",
    date: new Date("2024-11-20"),
    type: "earned" as const,
    amount: 3,
    description: "Clase cancelada - B2 Conversación",
    classDate: new Date("2024-11-22"),
  },
  {
    id: "2",
    date: new Date("2024-11-15"),
    type: "used" as const,
    amount: 2,
    description: "Clase adicional programada",
    classDate: new Date("2024-11-16"),
  },
  {
    id: "3",
    date: new Date("2024-11-10"),
    type: "earned" as const,
    amount: 1,
    description: "Clase grupal cancelada",
    classDate: new Date("2024-11-12"),
  },
  {
    id: "4",
    date: new Date("2024-11-05"),
    type: "earned" as const,
    amount: 2,
    description: "Reprogramación por feriado",
    classDate: new Date("2024-11-07"),
  },
];

export default function StudentDetailsModal({
  open,
  onOpenChange,
  student,
}: StudentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isUseCreditsOpen, setIsUseCreditsOpen] = useState(false);

  const getLevelColor = (level: string) => {
    const colors = {
      A1: "text-green-600 bg-green-50",
      A2: "text-blue-600 bg-blue-50",
      B1: "text-orange-600 bg-orange-50",
      B2: "text-green-600 bg-green-50",
      C1: "text-blue-600 bg-blue-50",
      C2: "text-gray-600 bg-gray-50",
    };
    return colors[level as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  const attendanceRate = Math.round((student.classesAttended / student.totalClasses) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{student.country}</span>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {student.name}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {student.nativeLanguage} • Estudiante desde{" "}
                  {format(new Date(student.enrollmentDate), "MMMM yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
            <Badge
              className={`${getLevelColor(student.level)} text-lg px-3 py-1`}
            >
              Nivel {student.level}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="credits">Créditos</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Objetivo: {student.objective}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Información Académica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grupo actual</span>
                    <span className="text-sm font-medium">{student.group}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profesor</span>
                    <span className="text-sm font-medium">{student.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Próxima clase</span>
                    <Badge variant="outline" className="text-xs">
                      {student.nextClass}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Asistencia</p>
                      <p className="text-2xl font-bold">{attendanceRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {student.classesAttended} de {student.totalClasses} clases
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Créditos</p>
                      <p className="text-2xl font-bold">{student.credits}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Disponibles para usar
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className="text-2xl font-bold">Activo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sin ausencias recientes
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-orange-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="credits" className="mt-6">
            <StudentCreditsCard
              studentId={student.id.toString()}
              studentName={student.name}
              totalCredits={student.credits}
              transactions={mockCreditTransactions}
              onUseCredits={() => {
                setIsUseCreditsOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="progress" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progreso del Nivel {student.level}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso general</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Habilidades</h4>
                    {[
                      { skill: "Gramática", progress: 85 },
                      { skill: "Vocabulario", progress: 70 },
                      { skill: "Comprensión Oral", progress: 65 },
                      { skill: "Expresión Escrita", progress: 80 },
                    ].map((item) => (
                      <div key={item.skill}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{item.skill}</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Logros Recientes</h4>
                    <div className="space-y-2">
                      {[
                        { achievement: "10 clases consecutivas", icon: Award },
                        { achievement: "Examen B1 aprobado", icon: CheckCircle },
                        { achievement: "Proyecto completado", icon: BookOpen },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <item.icon className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-sm">{item.achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de Clases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "2024-11-22",
                      time: "16:00",
                      type: "Grupal",
                      topic: "Subjuntivo presente",
                      status: "completed",
                      attendance: true,
                    },
                    {
                      date: "2024-11-20",
                      time: "16:00",
                      type: "Grupal",
                      topic: "Conectores del discurso",
                      status: "completed",
                      attendance: true,
                    },
                    {
                      date: "2024-11-18",
                      time: "16:00",
                      type: "Individual",
                      topic: "Práctica de conversación",
                      status: "completed",
                      attendance: true,
                    },
                    {
                      date: "2024-11-15",
                      time: "16:00",
                      type: "Grupal",
                      topic: "Tiempos verbales",
                      status: "missed",
                      attendance: false,
                    },
                  ].map((class_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            class_.attendance ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">{class_.topic}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(class_.date), "d 'de' MMMM", {
                              locale: es,
                            })} • {class_.time} • {class_.type}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={class_.attendance ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {class_.attendance ? "Asistió" : "Faltó"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Use Credits Dialog */}
      <UseCreditsDialog
        open={isUseCreditsOpen}
        onOpenChange={setIsUseCreditsOpen}
        student={{
          id: student.id.toString(),
          name: student.name,
          level: student.level,
          credits: student.credits,
        }}
        onSchedule={(data) => {
          console.log("Scheduling class with credits:", data);
          // Here we would call an API to schedule the class
          // and update the student's credit balance
          setIsUseCreditsOpen(false);
        }}
      />
    </Dialog>
  );
}