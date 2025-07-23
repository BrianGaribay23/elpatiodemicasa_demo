import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  Ban, 
  X, 
  Check, 
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  CreditCard,
  RefreshCw,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CancelRestrictionDemo() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Example classes
  const classes = [
    {
      id: 1,
      title: "Español B2 - Grupo Avanzado",
      date: today,
      time: "14:00 - 15:30",
      teacher: "María González",
      students: 3,
      canCancel: false,
      hoursUntil: 2,
      status: "today",
      creditValue: 10
    },
    {
      id: 2,
      title: "Español A1 - Principiantes",
      date: today,
      time: "18:00 - 19:30",
      teacher: "Carlos Ruiz",
      students: 4,
      canCancel: false,
      hoursUntil: 6,
      status: "today",
      creditValue: 10
    },
    {
      id: 3,
      title: "Español B1 - Intermedio",
      date: tomorrow,
      time: "10:00 - 11:30",
      teacher: "Ana Martín",
      students: 2,
      canCancel: true,
      hoursUntil: 26,
      status: "tomorrow",
      creditValue: 10
    },
    {
      id: 4,
      title: "Conversación C1",
      date: dayAfterTomorrow,
      time: "16:00 - 17:30",
      teacher: "Sofia López",
      students: 3,
      canCancel: true,
      hoursUntil: 50,
      status: "future",
      creditValue: 10
    },
    {
      id: 5,
      title: "Español de Negocios",
      date: nextWeek,
      time: "19:00 - 20:30",
      teacher: "Diego Fernandez",
      students: 2,
      canCancel: true,
      hoursUntil: 174,
      status: "nextWeek",
      creditValue: 15
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "today":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <Clock className="h-3 w-3 mr-1" />
            Hoy
          </Badge>
        );
      case "tomorrow":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Calendar className="h-3 w-3 mr-1" />
            Mañana
          </Badge>
        );
      case "future":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Calendar className="h-3 w-3 mr-1" />
            {format(dayAfterTomorrow, "d MMM", { locale: es })}
          </Badge>
        );
      case "nextWeek":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Calendar className="h-3 w-3 mr-1" />
            {format(nextWeek, "d MMM", { locale: es })}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCreditBadge = () => {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-300">
        <X className="h-3 w-3 mr-1" />
        Créditos consumidos
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--secondary-blue)] mb-2">
          Demostración: Política de Cancelación
        </h2>
        <p className="text-[var(--text-secondary)]">
          Las clases canceladas consumen créditos sin reembolso - Restricciones según el tiempo
        </p>
      </div>

      {/* Policy Summary */}
      <Card className="bg-amber-50 border-amber-200 mb-8">
        <CardHeader>
          <CardTitle className="text-amber-900">Política de Cancelación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-2">Regla de Negocio Importante</h4>
                <p className="text-amber-800 font-medium mb-2">
                  Las clases canceladas cuentan como un crédito usado.
                </p>
                <div className="space-y-2 text-sm text-amber-700">
                  <p>• No se realizan reembolsos por cancelaciones</p>
                  <p>• Los créditos se consumen sin importar el tiempo de anticipación</p>
                  <p>• Las clases del día actual NO pueden cancelarse</p>
                  <p>• Se recomienda reprogramar en lugar de cancelar cuando sea posible</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case 1: Cannot Cancel (Today's Classes) */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--primary-green)] mb-4 flex items-center">
            <Ban className="h-5 w-5 mr-2 text-red-500" />
            Caso 1: Clases de Hoy (No Cancelables)
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[var(--neutral-gray)]" />
                          <span>{classItem.time}</span>
                        </div>
                        <p className="text-[var(--text-secondary)]">
                          {classItem.teacher} • {classItem.students} estudiantes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {classItem.hoursUntil} horas
                        </p>
                        <p className="text-xs text-red-500">hasta la clase</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-red-200">
                      <div className="flex items-center justify-between mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="opacity-50"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancelar Clase
                        </Button>
                        {getCreditBadge()}
                      </div>
                      
                      <Alert className="border-red-200 bg-red-100">
                        <Ban className="h-4 w-4" />
                        <AlertTitle className="text-sm">Restricción activa</AlertTitle>
                        <AlertDescription className="text-xs">
                          Las clases del día actual no pueden cancelarse. 
                          Total en riesgo: {classItem.creditValue * classItem.students} créditos
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Emergency Contact for Today */}
            <Card className="border-orange-200 bg-orange-50 emergency-contact-card">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-orange-900 mb-2">
                  Contacto de emergencia para hoy:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    Coordinación: +52 555 000 0000
                  </p>
                  <p className="flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    WhatsApp: +52 555 111 2222
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    urgencias@escuela.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Case 2: Can Cancel (Future Classes) */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--primary-green)] mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Caso 2: Clases Futuras (Cancelables con Consumo de Créditos)
          </h3>
          <div className="space-y-4">
            {classes.filter(c => c.status !== "today").map(classItem => (
              <Card key={classItem.id} className="border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{classItem.title}</CardTitle>
                    {getStatusBadge(classItem.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[var(--neutral-gray)]" />
                          <span>{classItem.time}</span>
                        </div>
                        <p className="text-[var(--text-secondary)]">
                          {classItem.teacher} • {classItem.students} estudiantes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {classItem.hoursUntil} horas
                        </p>
                        <p className="text-xs text-green-500">hasta la clase</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Cancelar Clase
                        </Button>
                        {getCreditBadge()}
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Créditos de la clase:</span>
                            <span className="font-medium">{classItem.creditValue * classItem.students}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>Créditos a consumir:</span>
                            <span className="font-medium">
                              {classItem.creditValue * classItem.students}
                            </span>
                          </div>
                          <div className="text-amber-600 pt-1 border-t">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            Sin reembolso - Regla de negocio
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Se recomienda reprogramar en lugar de cancelar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Opciones Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Reprogramación (Recomendado)</p>
                <p className="text-xs text-gray-600">Es mejor reprogramar que cancelar para no perder créditos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Notificaciones Automáticas</p>
                <p className="text-xs text-gray-600">Los participantes serán notificados inmediatamente</p>
              </div>
            </div>
          </div>
          
          <Alert className="mt-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-700">
              <strong>Recordatorio:</strong> Al cancelar una clase, los créditos se consumen automáticamente. 
              Por favor, considere reprogramar como primera opción.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}