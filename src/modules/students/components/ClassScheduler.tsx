import React, { useState, useEffect } from "react";
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
import { Calendar, Clock, Users, AlertCircle, CheckCircle2, X, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zoomLinkManager } from "@/modules/shared/utils/zoomLinkManager";

interface GroupInfo {
  id: number;
  name: string;
  level: string;
  teacher: string;
  schedule: string; // e.g., "Lun/Mié 16:00-17:30"
  students: number;
  studentsList?: string[]; // Lista de nombres de estudiantes
  classroom: string;
}

interface ClassSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupInfo;
  onSchedule: (classes: ScheduledClass[]) => void;
}

interface ScheduledClass {
  id?: string;
  date: Date;
  startTime: string;
  endTime: string;
  groupId: number;
  groupName: string;
  teacher: string;
  classroom: string;
  level: string;
  students?: string[]; // Estudiantes incluidos en esta clase
  zoomRoomId?: string;
  zoomLink?: string;
  zoomPassword?: string;
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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showStudentSelection, setShowStudentSelection] = useState(false);

  // Initialize selected students with all students when component mounts
  useEffect(() => {
    if (group.studentsList) {
      setSelectedStudents([...group.studentsList]);
    }
  }, [group.studentsList]);

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

  // Create scheduled classes with Zoom links
  const createScheduledClasses = (): ScheduledClass[] => {
    const { startTime, endTime } = parseSchedule(group.schedule);
    const finalDates = getFinalDates();
    const scheduledClasses: ScheduledClass[] = [];

    for (const date of finalDates) {
      // Create date objects for start and end times
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const classStartTime = new Date(date);
      classStartTime.setHours(startHour, startMinute, 0, 0);
      
      const classEndTime = new Date(date);
      classEndTime.setHours(endHour, endMinute, 0, 0);

      // Generate unique ID for the class
      const classId = `class-${group.id}-${date.getTime()}-${Math.random().toString(36).substr(2, 9)}`;

      // Try to assign a Zoom room
      const result = zoomLinkManager.assignZoomRoom({
        id: classId,
        startTime: classStartTime,
        endTime: classEndTime,
        teacherId: group.teacher,
        level: group.level,
      });

      if (result.success && result.zoomRoom) {
        scheduledClasses.push({
          id: classId,
          date,
          startTime,
          endTime,
          groupId: group.id,
          groupName: group.name,
          teacher: group.teacher,
          classroom: group.classroom,
          level: group.level,
          students: selectedStudents, // Include selected students
          zoomRoomId: result.zoomRoom.id,
          zoomLink: result.zoomRoom.meetingUrl,
          zoomPassword: result.zoomRoom.passcode,
        });
      } else {
        // If no Zoom room available, still create the class but without Zoom details
        scheduledClasses.push({
          id: classId,
          date,
          startTime,
          endTime,
          groupId: group.id,
          groupName: group.name,
          teacher: group.teacher,
          classroom: group.classroom,
          level: group.level,
          students: selectedStudents, // Include selected students
        });
      }
    }

    return scheduledClasses;
  };

  // Handle schedule confirmation
  const handleSchedule = () => {
    const scheduledClasses = createScheduledClasses();
    onSchedule(scheduledClasses);
    onOpenChange(false);
    // Reset state
    setSelectedDates([]);
    setExcludedDates([]);
    setSelectedStudents(group.studentsList || []);
    setShowPreview(false);
    setShowStudentSelection(false);
  };

  // Toggle student selection
  const toggleStudent = (studentName: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentName)) {
        return prev.filter(s => s !== studentName);
      } else {
        return [...prev, studentName];
      }
    });
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

              {/* Student Selection Section */}
              {group.studentsList && group.studentsList.length > 0 && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <h4 className="font-medium">Estudiantes del Grupo</h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStudentSelection(!showStudentSelection)}
                      >
                        {showStudentSelection ? "Ocultar" : "Seleccionar"} Estudiantes
                      </Button>
                    </div>
                    
                    {showStudentSelection ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-muted-foreground">
                            Selecciona qué estudiantes asistirán a las clases:
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudents([...group.studentsList!])}
                            >
                              Seleccionar todos
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudents([])}
                            >
                              Quitar todos
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {group.studentsList.map((student, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={`student-${index}`}
                                checked={selectedStudents.includes(student)}
                                onCheckedChange={() => toggleStudent(student)}
                              />
                              <label
                                htmlFor={`student-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {student}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {selectedStudents.length} de {group.studentsList.length} estudiantes seleccionados
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Zoom Room Availability Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Asignación de Salas Zoom</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Las salas de Zoom se asignarán automáticamente al confirmar.
                    Sistema con 5 salas disponibles para evitar conflictos.
                  </p>
                </CardContent>
              </Card>

              {/* Preview */}
              {showPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-3">Vista Previa de Clases:</h4>
                    {selectedStudents.length < (group.studentsList?.length || 0) && (
                      <Alert className="mb-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Solo {selectedStudents.length} de {group.studentsList?.length} estudiantes asistirán a estas clases.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getFinalDates().map((date, index) => {
                        // Check Zoom availability for this date/time
                        const { startTime: timeStr } = parseSchedule(group.schedule);
                        const [startHour, startMinute] = timeStr.split(':').map(Number);
                        const classStartTime = new Date(date);
                        classStartTime.setHours(startHour, startMinute, 0, 0);
                        
                        const availability = zoomLinkManager.checkAvailability([{
                          start: classStartTime,
                          end: new Date(classStartTime.getTime() + 90 * 60000) // 90 min class
                        }]);
                        
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{format(date, "EEEE d 'de' MMMM", { locale: es })}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{group.schedule.split(" ")[1]}</span>
                              {availability.available ? (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                  <Video className="h-3 w-3 mr-1" />
                                  Zoom OK
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-300">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Sin Zoom
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
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