import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Ban,
  Calendar,
  Clock,
  CreditCard,
  Info,
  Mail,
  MessageSquare,
  RefreshCw,
  User,
  Users,
  X,
  AlertCircle,
  CheckCircle,
  Phone,
  DollarSign
} from "lucide-react";
import { format, differenceInHours, startOfDay, isBefore, isToday } from "date-fns";
import { es } from "date-fns/locale";
import "../styles/CancelClassDialog.css";

interface ClassDetails {
  id: string;
  title: string;
  teacher: string;
  teacherId: string;
  date: Date;
  startTime: string;
  endTime: string;
  level: string;
  groupName: string;
  students: string[];
  maxStudents: number;
  classroom: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  zoomLink?: string;
  isGroupClass: boolean;
  creditValue: number; // Credits to refund per student
}

interface CancelClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classDetails: ClassDetails | null;
  onCancel: (data: any) => void;
}

const cancelClassSchema = z.object({
  reason: z.string().min(1, "Selecciona un motivo de cancelación"),
  customReason: z.string().optional(),
  notifyStudents: z.boolean().default(true),
  notifyTeacher: z.boolean().default(true),
  refundCredits: z.boolean().default(true),
  rescheduleOption: z.enum(["no", "suggest", "mandatory"]).default("suggest"),
  suggestedDate: z.string().optional(),
  suggestedTime: z.string().optional(),
  additionalMessage: z.string().optional(),
});

type CancelClassFormData = z.infer<typeof cancelClassSchema>;

// Predefined cancellation reasons
const cancellationReasons = [
  { value: "teacher_sick", label: "Profesor enfermo", severity: "high" },
  { value: "teacher_emergency", label: "Emergencia del profesor", severity: "high" },
  { value: "technical_issues", label: "Problemas técnicos", severity: "medium" },
  { value: "holiday", label: "Día festivo", severity: "low" },
  { value: "low_attendance", label: "Pocos estudiantes confirmados", severity: "medium" },
  { value: "weather", label: "Condiciones climáticas", severity: "medium" },
  { value: "other", label: "Otro motivo", severity: "low" },
];

export default function CancelClassDialog({
  open,
  onOpenChange,
  classDetails,
  onCancel,
}: CancelClassDialogProps) {
  const [showRescheduleOptions, setShowRescheduleOptions] = useState(false);
  const [calculatingRefund, setCalculatingRefund] = useState(false);

  const form = useForm<CancelClassFormData>({
    resolver: zodResolver(cancelClassSchema),
    defaultValues: {
      reason: "",
      customReason: "",
      notifyStudents: true,
      notifyTeacher: true,
      refundCredits: true,
      rescheduleOption: "suggest",
      additionalMessage: "",
    },
  });

  if (!classDetails) return null;

  // Check if cancellation is allowed
  const canCancel = () => {
    const classDate = new Date(classDetails.date);
    const today = startOfDay(new Date());
    const classDay = startOfDay(classDate);
    
    // Cannot cancel if class is today or in the past
    return classDay > today;
  };

  // Calculate hours until class
  const getHoursUntilClass = () => {
    const now = new Date();
    const classDateTime = new Date(classDetails.date);
    const [hours, minutes] = classDetails.startTime.split(':').map(Number);
    classDateTime.setHours(hours, minutes, 0, 0);
    
    return differenceInHours(classDateTime, now);
  };

  // Calculate credits - Business rule: cancelled classes convert to credits for future use
  const calculateCredits = () => {
    const totalCredits = classDetails.creditValue * classDetails.students.length;
    
    // Business rule: Cancelled classes become available credits for future classes
    return {
      totalCredits,
      creditsToBank: totalCredits, // Credits that will be available for future use
      creditsLost: 0, // No credits are lost
    };
  };

  const creditInfo = calculateCredits();

  const handleSubmit = (data: CancelClassFormData) => {
    const cancellationData = {
      ...data,
      classDetails,
      creditInfo,
      cancellationTime: new Date(),
      hoursUntilClass: getHoursUntilClass(),
    };

    onCancel(cancellationData);
    onOpenChange(false);
  };

  // Show restriction dialog if cannot cancel
  if (!canCancel()) {
    const isClassToday = isToday(classDetails.date);
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">No se puede cancelar</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Alert className="border-red-200 bg-red-50 cancel-restriction-alert">
              <Ban className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Restricción de cancelación</AlertTitle>
              <AlertDescription className="text-red-700 mt-2">
                {isClassToday ? (
                  <>
                    <strong>Las clases del día actual no pueden cancelarse.</strong>
                    <br />
                    La clase comienza en {getHoursUntilClass()} horas.
                  </>
                ) : (
                  <>
                    <strong>Esta clase ya ocurrió y no puede cancelarse.</strong>
                  </>
                )}
              </AlertDescription>
            </Alert>

            {isClassToday && (
              <>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Opciones para clases de hoy
                  </h4>
                  <div className="space-y-2 text-sm text-amber-800">
                    <p>• El profesor puede marcar asistencia parcial</p>
                    <p>• Los estudiantes ausentes no perderán créditos</p>
                    <p>• Se puede reprogramar individualmente</p>
                  </div>
                </div>

                <Card className="mt-4 border-orange-200 bg-orange-50">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-orange-900 mb-2">
                      Contacto de emergencia:
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
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Main cancellation dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">
            Cancelar Clase
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se notificará a todos los participantes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Class Information */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Información de la clase</span>
                  <Badge variant="destructive">
                    <X className="h-3 w-3 mr-1" />
                    A cancelar
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{classDetails.title}</p>
                    <p className="text-muted-foreground">{classDetails.groupName}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(classDetails.date, "d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {classDetails.startTime} - {classDetails.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {classDetails.teacher}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {classDetails.students.length} estudiantes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Motivo de cancelación *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cancellationReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          <div className="flex items-center gap-2">
                            {reason.severity === "high" && (
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                            {reason.severity === "medium" && (
                              <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            )}
                            {reason.severity === "low" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <span>{reason.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom reason if "other" selected */}
            {form.watch("reason") === "other" && (
              <FormField
                control={form.control}
                name="customReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifica el motivo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe el motivo de cancelación..."
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Credit Policy Information */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Política de créditos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-green-200 bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Créditos a favor</AlertTitle>
                    <AlertDescription className="text-green-700">
                      <strong>Las clases canceladas se convierten en créditos a favor.</strong> 
                      <br />
                      Podrás usar estos créditos para programar futuras clases.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2 p-3 bg-white rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Tiempo hasta la clase:</span>
                      <Badge variant="outline">{getHoursUntilClass()} horas</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Créditos de la clase:</span>
                      <span className="font-medium">{creditInfo.totalCredits}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium text-green-600">Créditos a favor:</span>
                      <span className="font-bold text-green-600">
                        +{creditInfo.creditsToBank} créditos
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-2">
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                      Estos créditos quedarán disponibles en tu cuenta para futuras clases
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">
                      ¿Cómo usar tus créditos?
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Al programar una nueva clase, podrás usar tus créditos disponibles</li>
                      <li>• Los créditos no tienen fecha de vencimiento</li>
                      <li>• Puedes acumular créditos de varias cancelaciones</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reschedule Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Opciones de reprogramación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="rescheduleOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setShowRescheduleOptions(value === "suggest");
                          }}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="no" id="no-reschedule" />
                            <Label htmlFor="no-reschedule" className="space-y-1">
                              <span className="font-medium">No reprogramar</span>
                              <p className="text-xs text-muted-foreground">
                                Solo cancelar la clase sin ofrecer alternativa
                              </p>
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="suggest" id="suggest-reschedule" />
                            <Label htmlFor="suggest-reschedule" className="space-y-1">
                              <span className="font-medium">Sugerir nueva fecha</span>
                              <p className="text-xs text-muted-foreground">
                                Proponer una fecha alternativa a los estudiantes
                              </p>
                            </Label>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value="mandatory" id="mandatory-reschedule" />
                            <Label htmlFor="mandatory-reschedule" className="space-y-1">
                              <span className="font-medium">Reprogramación obligatoria</span>
                              <p className="text-xs text-muted-foreground">
                                La clase se moverá automáticamente a la nueva fecha
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showRescheduleOptions && (
                  <div className="mt-4 space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="suggestedDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Fecha sugerida</FormLabel>
                            <FormControl>
                              <input
                                type="date"
                                {...field}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="suggestedTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Hora sugerida</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona hora" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {`${hour}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="notifyStudents"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Notificar a estudiantes</FormLabel>
                        <FormDescription className="text-xs">
                          {classDetails.students.length} estudiantes recibirán email y SMS
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifyTeacher"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Notificar al profesor</FormLabel>
                        <FormDescription className="text-xs">
                          {classDetails.teacher} será notificado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Mensaje adicional (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Mensaje personalizado para incluir en las notificaciones..."
                          className="min-h-[60px] text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Warning Alert */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle>Confirmación importante</AlertTitle>
              <AlertDescription>
                Al cancelar esta clase:
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Se liberará la sala de Zoom asignada</li>
                  <li>Se actualizará el calendario de todos los participantes</li>
                  <li>Se generarán {creditInfo.creditsToBank} créditos a favor</li>
                  <li>Los estudiantes serán notificados de la cancelación</li>
                  <li>Los créditos quedarán disponibles para futuras clases</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </AlertDescription>
            </Alert>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Volver
              </Button>
              
              <Button
                type="submit"
                variant="destructive"
                className="cancel-confirm-button"
              >
                <Ban className="h-4 w-4 mr-2" />
                Confirmar Cancelación
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}