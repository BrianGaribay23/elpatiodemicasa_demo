import React, { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, Users, AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GroupInfo {
  id: number;
  name: string;
  level: string;
  teacher: string;
  schedule: string; // e.g., "Lun/Mié 16:00-17:30"
  students: number;
  classroom: string;
}

interface ClassSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupInfo;
  onSchedule: (classes: ScheduledClass[]) => void;
}

interface ScheduledClass {
  date: Date;
  startTime: string;
  endTime: string;
  groupId: number;
  groupName: string;
  teacher: string;
  classroom: string;
  level: string;
}

const DAYS_MAP: { [key: string]: number } = {
  "Dom": 0,
  "Lun": 1,
  "Mar": 2,
  "Mié": 3,
  "Jue": 4,
  "Vie": 5,
  "Sáb": 6,
};

// Mexican holidays 2025
const HOLIDAYS_2025 = [
  new Date(2025, 0, 1), // Año Nuevo
  new Date(2025, 1, 3), // Día de la Constitución
  new Date(2025, 2, 17), // Natalicio de Benito Juárez
  new Date(2025, 4, 1), // Día del Trabajo
  new Date(2025, 8, 16), // Día de la Independencia
  new Date(2025, 10, 17), // Revolución Mexicana
  new Date(2025, 11, 25), // Navidad
];

export default function ClassScheduler({
  open,
  onOpenChange,
  group,
  onSchedule,
}: ClassSchedulerProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Parse schedule to get days and times
  const parseSchedule = (schedule: string) => {
    // Example: "Lun/Mié 16:00-17:30"
    const [daysStr, timeStr] = schedule.split(" ");
    const days = daysStr.split("/").map(day => DAYS_MAP[day]);
    const [startTime, endTime] = timeStr.split("-");
    return { days, startTime, endTime };
  };

  // Generate recurring dates for the month
  const generateRecurringDates = () => {
    const { days, startTime, endTime } = parseSchedule(group.schedule);
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const recurringDates = allDays.filter(date => {
      const dayOfWeek = getDay(date);
      return days.includes(dayOfWeek) && !isHoliday(date);
    });

    setSelectedDates(recurringDates);
    setExcludedDates([]);
  };

  // Check if date is a holiday
  const isHoliday = (date: Date) => {
    return HOLIDAYS_2025.some(holiday => 
      holiday.getDate() === date.getDate() && 
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
    );
  };

  // Toggle date selection
  const toggleDate = (date: Date) => {
    if (excludedDates.some(d => d.getTime() === date.getTime())) {
      setExcludedDates(excludedDates.filter(d => d.getTime() !== date.getTime()));
    } else {
      setExcludedDates([...excludedDates, date]);
    }
  };

  // Get final selected dates (excluding manually deselected ones)
  const getFinalDates = () => {
    return selectedDates.filter(date => 
      !excludedDates.some(excluded => excluded.getTime() === date.getTime())
    );
  };

  // Create scheduled classes
  const createScheduledClasses = (): ScheduledClass[] => {
    const { startTime, endTime } = parseSchedule(group.schedule);
    const finalDates = getFinalDates();

    return finalDates.map(date => ({
      date,
      startTime,
      endTime,
      groupId: group.id,
      groupName: group.name,
      teacher: group.teacher,
      classroom: group.classroom,
      level: group.level,
    }));
  };

  // Handle schedule confirmation
  const handleSchedule = () => {
    const scheduledClasses = createScheduledClasses();
    onSchedule(scheduledClasses);
    onOpenChange(false);
    // Reset state
    setSelectedDates([]);
    setExcludedDates([]);
    setShowPreview(false);
  };

  // Render calendar
  const renderCalendar = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const startDate = addDays(monthStart, -getDay(monthStart));
    const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    return (
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              const isCurrentMonth = isSameMonth(date, selectedMonth);
              const isSelected = selectedDates.some(d => d.getTime() === date.getTime());
              const isExcluded = excludedDates.some(d => d.getTime() === date.getTime());
              const isHolidayDate = isHoliday(date);
              const isScheduleDay = parseSchedule(group.schedule).days.includes(getDay(date));

              return (
                <div
                  key={dayIndex}
                  className={`
                    relative p-2 text-center rounded-md cursor-pointer transition-colors
                    ${!isCurrentMonth ? 'text-muted-foreground' : ''}
                    ${isSelected && !isExcluded ? 'bg-primary text-primary-foreground' : ''}
                    ${isExcluded ? 'bg-muted line-through' : ''}
                    ${isHolidayDate ? 'bg-red-100 text-red-600' : ''}
                    ${isScheduleDay && isCurrentMonth && !isHolidayDate ? 'ring-2 ring-primary/50' : ''}
                  `}
                  onClick={() => {
                    if (isCurrentMonth && isSelected) {
                      toggleDate(date);
                    }
                  }}
                >
                  <div className="text-sm">{format(date, 'd')}</div>
                  {isHolidayDate && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programar Clases - {group.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Profesor: {group.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Horario: {group.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{group.level}</Badge>
                  <span>{group.students} estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Aula: {group.classroom}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Month selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Seleccionar Mes:</span>
            </div>
            <Select
              value={format(selectedMonth, 'yyyy-MM')}
              onValueChange={(value) => {
                const [year, month] = value.split('-');
                setSelectedMonth(new Date(parseInt(year), parseInt(month) - 1));
                setSelectedDates([]);
                setExcludedDates([]);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2].map(offset => {
                  const month = addMonths(new Date(), offset);
                  return (
                    <SelectItem key={offset} value={format(month, 'yyyy-MM')}>
                      {format(month, 'MMMM yyyy', { locale: es })}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Generate button */}
          {selectedDates.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haz clic en "Generar Clases" para crear automáticamente las clases según el horario del grupo.
                Los días festivos serán excluidos automáticamente.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={generateRecurringDates} 
            className="w-full"
            variant={selectedDates.length > 0 ? "outline" : "default"}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {selectedDates.length > 0 ? "Regenerar Clases" : "Generar Clases del Mes"}
          </Button>

          {/* Calendar */}
          {selectedDates.length > 0 && (
            <>
              <div className="border rounded-lg p-4">
                {renderCalendar()}
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Se programarán {getFinalDates().length} clases. 
                  Puedes hacer clic en las fechas seleccionadas para excluirlas.
                </AlertDescription>
              </Alert>

              {/* Preview */}
              {showPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-3">Vista Previa de Clases:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getFinalDates().map((date, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{format(date, "EEEE d 'de' MMMM", { locale: es })}</span>
                          <span className="text-muted-foreground">{group.schedule.split(" ")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {selectedDates.length > 0 && !showPreview && (
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Vista Previa
            </Button>
          )}
          {selectedDates.length > 0 && (
            <Button onClick={handleSchedule}>
              Programar {getFinalDates().length} Clases
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}