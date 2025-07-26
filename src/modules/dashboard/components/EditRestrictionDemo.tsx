import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Edit, 
  X, 
  Check, 
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EditRestrictionDemo() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Example classes
  const classes = [
    {
      id: 1,
      title: "Español B2 - Grupo Avanzado",
      date: today,
      time: "14:00 - 15:30",
      teacher: "María González",
      students: 3,
      canEdit: false,
      reason: "Las clases del día actual no pueden editarse",
      status: "today"
    },
    {
      id: 2,
      title: "Español A1 - Principiantes",
      date: today,
      time: "18:00 - 19:30",
      teacher: "Carlos Ruiz",
      students: 4,
      canEdit: false,
      reason: "Las clases del día actual no pueden editarse",
      status: "today"
    },
    {
      id: 3,
      title: "Español B1 - Intermedio",
      date: tomorrow,
      time: "10:00 - 11:30",
      teacher: "Ana Martín",
      students: 2,
      canEdit: true,
      reason: "Puedes editar esta clase",
      status: "tomorrow"
    },
    {
      id: 4,
      title: "Conversación C1",
      date: dayAfterTomorrow,
      time: "16:00 - 17:30",
      teacher: "Sofia López",
      students: 3,
      canEdit: true,
      reason: "Puedes editar esta clase",
      status: "future"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "today":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Clock className="h-3 w-3 mr-1" />
            Hoy
          </Badge>
        );
      case "tomorrow":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Calendar className="h-3 w-3 mr-1" />
            Mañana
          </Badge>
        );
      case "future":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Calendar className="h-3 w-3 mr-1" />
            {format(dayAfterTomorrow, "d MMM", { locale: es })}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--secondary-blue)] mb-2">
          Demostración: Restricciones de Edición
        </h2>
        <p className="text-[var(--text-secondary)]">
          Las clases del día actual no se pueden editar. Solo puedes editar clases a partir de mañana.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Case 1: Today's Classes - Cannot Edit */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--primary-green)] mb-4 flex items-center">
            <X className="h-5 w-5 mr-2 text-red-500" />
            Caso 1: Clases de Hoy (No Editables)
          </h3>
          <div className="space-y-4">
            {classes.filter(c => c.status === "today").map(classItem => (
              <Card key={classItem.id} className="border-red-200 bg-red-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{classItem.title}</CardTitle>
                    {getStatusBadge(classItem.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--neutral-gray)]" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)]">
                        {classItem.teacher} • {classItem.students} estudiantes
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Clase
                    </Button>
                    <span className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No editable hoy
                    </span>
                  </div>
                  
                  <div className="mt-3 p-3 bg-red-100 rounded-lg">
                    <p className="text-xs text-red-800">
                      <strong>Restricción:</strong> {classItem.reason}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Para cambios urgentes, contacta al coordinador.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Case 2: Tomorrow's Classes - Can Edit */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--primary-green)] mb-4 flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            Caso 2: Clases de Mañana en Adelante (Editables)
          </h3>
          <div className="space-y-4">
            {classes.filter(c => c.status !== "today").map(classItem => (
              <Card key={classItem.id} className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{classItem.title}</CardTitle>
                    {getStatusBadge(classItem.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--neutral-gray)]" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)]">
                        {classItem.teacher} • {classItem.students} estudiantes
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-green-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Clase
                    </Button>
                    <span className="text-xs text-green-600 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Editable
                    </span>
                  </div>
                  
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-800">
                      <strong>Permitido:</strong> {classItem.reason}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Puedes cambiar fecha, hora, profesor o estudiantes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-3">Resumen de Reglas de Edición</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Clases del día actual</p>
                <p className="text-xs text-gray-600">
                  No se pueden editar ni cancelar. Contacta al coordinador para cambios urgentes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Clases a partir de mañana</p>
                <p className="text-xs text-gray-600">
                  Pueden editarse libremente: fecha, hora, profesor y estudiantes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                <strong>Contacto de emergencia para hoy:</strong> Coordinación +52 555 000 0000 • WhatsApp +52 555 111 2222
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}