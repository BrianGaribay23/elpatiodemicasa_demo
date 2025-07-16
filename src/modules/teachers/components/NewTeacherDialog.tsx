import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

// US Time Zones
const US_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)", abbr: "EST/EDT" },
  { value: "America/Chicago", label: "Central Time (CT)", abbr: "CST/CDT" },
  { value: "America/Denver", label: "Mountain Time (MT)", abbr: "MST/MDT" },
  { value: "America/Phoenix", label: "Mountain Time - Arizona", abbr: "MST" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", abbr: "PST/PDT" },
  { value: "America/Anchorage", label: "Alaska Time", abbr: "AKST/AKDT" },
  { value: "Pacific/Honolulu", label: "Hawaii Time", abbr: "HST" },
];


// Form schema
const teacherFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
  timezone: z.string().min(1, "Selecciona una zona horaria"),
  schedule: z.string().min(1, "Ingresa el horario disponible"),
  bio: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherFormSchema>;

interface NewTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TeacherFormData) => void;
}

export default function NewTeacherDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewTeacherDialogProps) {
  const [selectedTimezone, setSelectedTimezone] = React.useState<string>("");
  const [scheduleInput, setScheduleInput] = React.useState<string>("");

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      timezone: "",
      schedule: "",
      bio: "",
    },
  });

  // Function to convert time between timezones
  const convertSchedule = (schedule: string, fromTimezone: string) => {
    // This is a simplified conversion - in production you'd use a library like date-fns-tz
    const timezoneOffsets: { [key: string]: number } = {
      "America/New_York": -5, // EST
      "America/Chicago": -6, // CST
      "America/Denver": -7, // MST
      "America/Phoenix": -7, // MST (no DST)
      "America/Los_Angeles": -8, // PST
      "America/Anchorage": -9, // AKST
      "Pacific/Honolulu": -10, // HST
    };

    // Assuming local timezone is CST (Mexico City)
    const localOffset = -6; // CST
    const teacherOffset = timezoneOffsets[fromTimezone] || -5;
    const hourDifference = localOffset - teacherOffset;

    // Parse schedule (e.g., "L-V 7:00-12:00")
    const timeMatch = schedule.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
    if (!timeMatch) return schedule;

    const [, startHour, startMin, endHour, endMin] = timeMatch;
    const convertedStartHour = (parseInt(startHour) + hourDifference + 24) % 24;
    const convertedEndHour = (parseInt(endHour) + hourDifference + 24) % 24;

    const daysPart = schedule.split(" ")[0];
    return `${daysPart} ${convertedStartHour}:${startMin}-${convertedEndHour}:${endMin}`;
  };


  const handleSubmit = (data: TeacherFormData) => {
    onSubmit(data);
    form.reset();
    setSelectedTimezone("");
    setScheduleInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Profesor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información Personal</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="profesor@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 555 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información Profesional</h3>
              
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona Horaria del Profesor</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTimezone(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la zona horaria del profesor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{tz.label}</span>
                              <span className="text-muted-foreground ml-2">({tz.abbr})</span>
                            </div>
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
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario Disponible</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="L-V 7:00-12:00" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setScheduleInput(e.target.value);
                        }}
                      />
                    </FormControl>
                    {selectedTimezone && scheduleInput && (
                      <FormDescription className="flex items-center gap-2 mt-2">
                        <span className="text-sm">{scheduleInput}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {convertSchedule(scheduleInput, selectedTimezone)} (Hora Local)
                        </span>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descripción del profesor..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agregar Profesor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}