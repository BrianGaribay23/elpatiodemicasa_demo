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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  CreditCard,
  Info,
  Users,
  User,
  CheckCircle,
  Coins,
  CalendarPlus,
} from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface UseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: string;
    name: string;
    level: string;
    credits: number;
  };
  onSchedule: (data: any) => void;
}

const scheduleSchema = z.object({
  classType: z.enum(["individual", "group"]),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona un horario"),
  creditsToUse: z.number().min(1).max(10),
  teacher: z.string().optional(),
  topic: z.string().optional(),
  notifyStudent: z.boolean().default(true),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

// Mock available slots
const getAvailableSlots = (date: Date, classType: string) => {
  // In a real app, this would fetch from an API
  const baseSlots = [
    { time: "09:00", teacher: "María González", available: true },
    { time: "10:00", teacher: "Carlos Ruiz", available: true },
    { time: "11:00", teacher: "Ana Martín", available: false },
    { time: "14:00", teacher: "Sofia López", available: true },
    { time: "15:00", teacher: "María González", available: true },
    { time: "16:00", teacher: "Diego Fernandez", available: true },
    { time: "17:00", teacher: "Roberto Torres", available: false },
    { time: "18:00", teacher: "Carlos Ruiz", available: true },
  ];

  return baseSlots.filter(slot => slot.available);
};

export default function UseCreditsDialog({
  open,
  onOpenChange,
  student,
  onSchedule,
}: UseCreditsDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      classType: "individual",
      date: "",
      time: "",
      creditsToUse: 1,
      notifyStudent: true,
    },
  });

  const classType = form.watch("classType");
  const creditsRequired = classType === "individual" ? 1 : 1; // Both use 1 credit per hour

  const handleDateChange = (dateString: string) => {
    form.setValue("date", dateString);
    const date = new Date(dateString);
    setSelectedDate(date);
    const slots = getAvailableSlots(date, form.getValues("classType"));
    setAvailableSlots(slots);
    form.setValue("time", ""); // Reset time selection
  };

  const handleSubmit = (data: ScheduleFormData) => {
    const scheduleData = {
      ...data,
      studentId: student.id,
      studentName: student.name,
      scheduledAt: new Date(),
    };

    onSchedule(scheduleData);
    onOpenChange(false);
  };

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Programar Clase con Créditos
          </DialogTitle>
          <DialogDescription>
            Usa tus créditos disponibles para programar clases adicionales
          </DialogDescription>
        </DialogHeader>

        {/* Credits Info */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Coins className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">{student.name}</p>
                  <p className="text-sm text-green-700">Nivel {student.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-800">{student.credits}</p>
                <p className="text-xs text-green-600">créditos disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Class Type */}
            <FormField
              control={form.control}
              name="classType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de clase</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="individual"
                          id="individual"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="individual"
                          className="flex items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Individual</p>
                              <p className="text-xs text-muted-foreground">
                                Clase personalizada 1 a 1
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">1 crédito</Badge>
                        </Label>
                      </div>
                      
                      <div className="relative">
                        <RadioGroupItem
                          value="group"
                          id="group"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="group"
                          className="flex items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Grupal</p>
                              <p className="text-xs text-muted-foreground">
                                Máximo 4 estudiantes
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">1 crédito</Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de la clase</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Puedes programar clases hasta 30 días en adelante
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Slots */}
            {selectedDate && availableSlots.length > 0 && (
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horarios disponibles</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map((slot) => (
                        <div
                          key={slot.time}
                          className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all ${
                            field.value === slot.time
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            form.setValue("time", slot.time);
                            form.setValue("teacher", slot.teacher);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {slot.time}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Prof. {slot.teacher}
                              </p>
                            </div>
                            {field.value === slot.time && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Topic (optional) */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema específico (opcional)</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="Ej: Práctica de conversación, Gramática del subjuntivo..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Indica si hay algún tema específico que quieras trabajar
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Notifications */}
            <FormField
              control={form.control}
              name="notifyStudent"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Notificar al estudiante
                    </FormLabel>
                    <FormDescription>
                      Enviar confirmación por email y SMS
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

            {/* Summary */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Resumen de la clase</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Tipo: Clase {classType === "individual" ? "Individual" : "Grupal"}</li>
                  {form.watch("date") && (
                    <li>• Fecha: {format(new Date(form.watch("date")), "d 'de' MMMM 'de' yyyy", { locale: es })}</li>
                  )}
                  {form.watch("time") && (
                    <li>• Hora: {form.watch("time")}</li>
                  )}
                  <li>• Créditos a usar: {creditsRequired}</li>
                  <li>• Créditos restantes: {student.credits - creditsRequired}</li>
                </ul>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={student.credits < creditsRequired}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Usar {creditsRequired} crédito{creditsRequired > 1 ? "s" : ""} y programar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}