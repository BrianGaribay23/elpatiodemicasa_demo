import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  Send,
  Copy,
  Video,
  X
} from "lucide-react";
import { format, isBefore, startOfDay, addDays, differenceInHours } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CancelClassDialog from "./CancelClassDialog";
import "../styles/EditClassDialog.css";

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
  zoomPassword?: string;
  zoomMeetingId?: string;
  description?: string;
  creditValue: number;
}

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classDetails: ClassDetails | null;
  onSave: (data: any) => void;
}

// Available students for the group (mock data)
const availableStudents = [
  { id: "1", name: "Emma Wilson", email: "emma@email.com", level: "B2", country: "🇺🇸" },
  { id: "2", name: "Liu Wei", email: "liu@email.com", level: "A2", country: "🇨🇳" },
  { id: "3", name: "Pierre Martin", email: "pierre@email.com", level: "B1", country: "🇫🇷" },
  { id: "4", name: "Ana Silva", email: "ana@email.com", level: "B2", country: "🇧🇷" },
  { id: "5", name: "Yuki Tanaka", email: "yuki@email.com", level: "A1", country: "🇯🇵" },
];

// Available teachers (mock data)
const availableTeachers = [
  { id: "1", name: "María González", email: "maria@escuela.com", phone: "+52 555 123 4567", specialties: ["A1", "A2", "B1", "B2", "C1"] },
  { id: "2", name: "Carlos Ruiz", email: "carlos@escuela.com", phone: "+52 555 234 5678", specialties: ["A1", "A2", "B1", "B2"] },
  { id: "3", name: "Ana Martín", email: "ana@escuela.com", phone: "+52 555 345 6789", specialties: ["B1", "B2", "C1", "C2"] },
  { id: "4", name: "Sofia López", email: "sofia@escuela.com", phone: "+52 555 456 7890", specialties: ["A1", "A2", "B1"] },
];

const editClassSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de fin es requerida"),
  teacherId: z.string().min(1, "Selecciona un profesor"),
  students: z.array(z.string()).min(1, "Debe haber al menos un estudiante"),
  classroom: z.string().min(1, "El aula es requerida"),
  description: z.string().optional(),
  notifyChanges: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
  notifyTeacher: z.boolean().default(true),
  customMessage: z.string().optional(),
});

type EditClassFormData = z.infer<typeof editClassSchema>;

export default function EditClassDialog({
  open,
  onOpenChange,
  classDetails,
  onSave,
}: EditClassDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [zoomConflicts, setZoomConflicts] = useState<any[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const form = useForm<EditClassFormData>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      date: classDetails?.date || new Date(),
      startTime: classDetails?.startTime || "",
      endTime: classDetails?.endTime || "",
      teacherId: classDetails?.teacherId || "",
      students: classDetails?.students || [],
      classroom: classDetails?.classroom || "",
      description: classDetails?.description || "",
      notifyChanges: true,
      notifyStudents: true,
      notifyTeacher: true,
      customMessage: "",
    },
  });

  // Check if the class can be edited (not same day)
  const canEdit = () => {
    if (!classDetails) return false;
    const classDate = new Date(classDetails.date);
    const today = startOfDay(new Date());
    const classDay = startOfDay(classDate);
    
    // Cannot edit if class is today or in the past
    return classDay > today;
  };

  // Get edit restriction message
  const getEditRestrictionMessage = () => {
    if (!classDetails) return "";
    const classDate = new Date(classDetails.date);
    const today = startOfDay(new Date());
    const classDay = startOfDay(classDate);
    
    if (classDay < today) {
      return "Esta clase ya ocurrió";
    } else if (classDay.getTime() === today.getTime()) {
      return "Las clases del día actual no pueden editarse";
    }
    return "";
  };

  // Calculate time until class
  const getTimeUntilClass = () => {
    if (!classDetails) return "";
    const now = new Date();
    const classDateTime = new Date(classDetails.date);
    
    // Set the class time
    const [hours, minutes] = classDetails.startTime.split(':').map(Number);
    classDateTime.setHours(hours, minutes, 0, 0);
    
    const diffInMillis = classDateTime.getTime() - now.getTime();
    const hoursUntil = differenceInHours(classDateTime, now);
    
    if (diffInMillis < 0) {
      return "Clase pasada";
    } else if (hoursUntil < 1) {
      const minutesUntil = Math.floor(diffInMillis / 60000);
      if (minutesUntil === 0) {
        return "menos de 1 minuto";
      }
      return `${minutesUntil} ${minutesUntil === 1 ? 'minuto' : 'minutos'}`;
    } else if (hoursUntil < 24) {
      return `${hoursUntil} ${hoursUntil === 1 ? 'hora' : 'horas'}`;
    }
    
    const daysUntil = Math.floor(hoursUntil / 24);
    return `${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`;
  };

  // Check for teacher availability
  const checkTeacherAvailability = (teacherId: string, date: Date, startTime: string) => {
    // Mock implementation - check if teacher is available
    const conflicts = [
      { time: "14:00", class: "Grupo B1 Intermedio" },
      { time: "16:00", class: "Clase Individual - John Smith" },
    ];
    return conflicts.filter(c => c.time === startTime);
  };

  // Check Zoom room availability
  const checkZoomAvailability = (date: Date, startTime: string, endTime: string) => {
    // Mock implementation
    const conflicts = [
      { room: "Sala 2", time: "14:00-15:30", class: "Grupo A2" },
    ];
    setZoomConflicts(conflicts.filter(c => c.time.includes(startTime)));
  };

  // Get available students for the level
  const getAvailableStudentsForLevel = () => {
    const level = classDetails?.level || "B2";
    return availableStudents.filter(s => 
      s.level === level && !form.watch("students").includes(s.name)
    );
  };

  const handleSubmit = (data: EditClassFormData) => {
    // Prepare notification data
    const changes = {
      dateChanged: data.date !== classDetails?.date,
      timeChanged: data.startTime !== classDetails?.startTime,
      teacherChanged: data.teacherId !== classDetails?.teacherId,
      studentsChanged: JSON.stringify(data.students) !== JSON.stringify(classDetails?.students),
    };

    const finalData = {
      ...data,
      changes,
      originalClass: classDetails,
    };

    onSave(finalData);
    onOpenChange(false);
  };

  if (!canEdit()) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">No se puede editar</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Alert className="border-red-200 bg-red-50 edit-warning-alert">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <span className="font-medium">{getEditRestrictionMessage()}</span>
                <br />
                {getTimeUntilClass() !== "Clase pasada" && (
                  <span className="text-sm">
                    Esta clase comienza en {getTimeUntilClass()}.
                  </span>
                )}
              </AlertDescription>
            </Alert>
            
            {/* Only show emergency contact for today's classes */}
            {startOfDay(new Date()).getTime() === startOfDay(classDetails?.date || new Date()).getTime() && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">
                  ⚠️ Cambios de último minuto
                </p>
                <p className="text-sm text-amber-800">
                  Para cambios urgentes en clases de hoy, contacta directamente:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">📞 Coordinación: +52 555 000 0000</p>
                  <p className="text-sm font-medium">📧 Email: urgencias@escuela.com</p>
                  <p className="text-sm font-medium">💬 WhatsApp: +52 555 111 2222</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Editar Clase
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {classDetails?.title} - {classDetails?.groupName}
              </p>
            </div>
            <Badge variant="outline" className="ml-4">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeUntilClass() === "Clase pasada" 
                ? "Clase pasada" 
                : `Faltan ${getTimeUntilClass()}`}
            </Badge>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full edit-class-tabs">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="general" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="participants" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Participantes
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Notificaciones
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[450px] p-6">
                <TabsContent value="general" className="space-y-4 mt-0">
                  {/* Date and Time */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona fecha</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = startOfDay(new Date());
                                  const selectedDay = startOfDay(date);
                                  // Disable today and past dates
                                  return selectedDay <= today;
                                }}
                                initialFocus
                                locale={es}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Solo puedes seleccionar fechas a partir de mañana
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de inicio</FormLabel>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de fin</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona hora" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 14 }, (_, i) => i + 9).map((hour) => (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {`${hour}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Teacher Selection */}
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profesor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un profesor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTeachers
                              .filter(t => t.specialties.includes(classDetails?.level || "B2"))
                              .map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{teacher.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {teacher.specialties.join(", ")}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Solo profesores certificados para nivel {classDetails?.level}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Classroom */}
                  <FormField
                    control={form.control}
                    name="classroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aula / Sala Virtual</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej: Aula Virtual 1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas / Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Notas adicionales sobre la clase..."
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Zoom Availability Check */}
                  {zoomConflicts.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        <span className="font-medium">Conflicto de Sala Zoom:</span>
                        <br />
                        {zoomConflicts.map((conflict, idx) => (
                          <span key={idx} className="text-sm">
                            {conflict.room} ocupada de {conflict.time} ({conflict.class})
                          </span>
                        ))}
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="participants" className="space-y-4 mt-0">
                  {/* Current Students */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">
                        Estudiantes Actuales ({form.watch("students").length}/{classDetails?.maxStudents})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStudentSearch(!showStudentSearch)}
                        className="add-student-btn"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar Estudiante
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {form.watch("students").map((student, index) => (
                        <Card key={index} className="p-3 student-card">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{student}</p>
                                <p className="text-xs text-muted-foreground">
                                  Nivel {classDetails?.level}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newStudents = form.watch("students").filter((_, i) => i !== index);
                                form.setValue("students", newStudents);
                              }}
                              className="remove-student-btn"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Add Students */}
                  {showStudentSearch && (
                    <Card className="p-4 border-dashed">
                      <div className="space-y-3">
                        <Input
                          placeholder="Buscar estudiantes disponibles..."
                          value={studentSearchTerm}
                          onChange={(e) => setStudentSearchTerm(e.target.value)}
                          className="w-full"
                        />
                        
                        <ScrollArea className="h-[150px]">
                          <div className="space-y-2">
                            {getAvailableStudentsForLevel()
                              .filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
                              .map((student) => (
                                <div
                                  key={student.id}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer available-student-item"
                                  onClick={() => {
                                    const currentStudents = form.watch("students");
                                    if (currentStudents.length < (classDetails?.maxStudents || 4)) {
                                      form.setValue("students", [...currentStudents, student.name]);
                                      setStudentSearchTerm("");
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{student.country}</span>
                                    <div>
                                      <p className="font-medium">{student.name}</p>
                                      <p className="text-xs text-muted-foreground">{student.email}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{student.level}</Badge>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </Card>
                  )}

                  {/* Group Capacity Warning */}
                  {form.watch("students").length === classDetails?.maxStudents && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        El grupo ha alcanzado su capacidad máxima de {classDetails.maxStudents} estudiantes.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 mt-0">
                  {/* Notification Settings */}
                  <Card className="p-4">
                    <h3 className="text-sm font-medium mb-3">Notificar Cambios</h3>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="notifyStudents"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-normal">
                                Notificar a estudiantes
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Enviar email a todos los estudiantes de la clase
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
                              <FormLabel className="text-sm font-normal">
                                Notificar al profesor
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Enviar email al profesor asignado
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
                    </div>
                  </Card>

                  {/* Custom Message */}
                  <FormField
                    control={form.control}
                    name="customMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje Personalizado (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Añade un mensaje personalizado para incluir en las notificaciones..."
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Este mensaje se incluirá en todos los emails de notificación
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notification Preview */}
                  <Card className="p-4 bg-gray-50 notification-preview">
                    <h4 className="text-sm font-medium mb-2">Vista Previa de Notificación</h4>
                    <div className="text-xs space-y-2 text-muted-foreground">
                      <p className="font-medium">Asunto: Cambios en tu clase de español</p>
                      <div className="border-l-2 border-gray-300 pl-3 space-y-1">
                        <p>Hola [Nombre],</p>
                        <p>Te informamos que ha habido cambios en tu clase:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          {form.watch("date") !== classDetails?.date && (
                            <li>Nueva fecha: {format(form.watch("date"), "PPP", { locale: es })}</li>
                          )}
                          {form.watch("startTime") !== classDetails?.startTime && (
                            <li>Nuevo horario: {form.watch("startTime")} - {form.watch("endTime")}</li>
                          )}
                          {form.watch("teacherId") !== classDetails?.teacherId && (
                            <li>Nuevo profesor: {availableTeachers.find(t => t.id === form.watch("teacherId"))?.name}</li>
                          )}
                        </ul>
                        {form.watch("customMessage") && (
                          <p className="mt-2 italic">{form.watch("customMessage")}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="p-6 pt-0 flex justify-between border-t">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar Clase
                </Button>
              </div>
              
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <CheckCircle className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* Cancel Class Dialog */}
      <CancelClassDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        classDetails={classDetails}
        onCancel={(data) => {
          console.log("Clase cancelada:", data);
          // Aquí iría la lógica para cancelar la clase
          setIsCancelDialogOpen(false);
          onOpenChange(false); // Cerrar ambos diálogos
        }}
      />
    </Dialog>
  );
}