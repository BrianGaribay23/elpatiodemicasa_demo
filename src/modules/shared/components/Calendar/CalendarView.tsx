import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  User,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import "../../styles/CalendarAnimations.css";
import { CalendarEvent, mockEvents } from "./mockEvents";
import { exportCalendarToPDF } from "../../utils/calendarPdfExport";

interface CalendarViewProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const CalendarView = ({ events = mockEvents, onEventClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Today's date
  const [view, setView] = useState<"week" | "month">("week");
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevious = () => {
    if (view === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      // Handle month view
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      // Handle month view
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDrop = (day: Date, hour: number) => {
    if (!draggedEvent) return;

    // Here you would implement the logic to update the event time
    // and check for conflicts
    console.log(
      `Moved event ${draggedEvent.id} to ${format(day, "yyyy-MM-dd")} at ${hour}:00`,
    );

    // Reset dragged event
    setDraggedEvent(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventHour = event.start.getHours();
      const eventDate = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate(),
      );
      const compareDate = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );
      return (
        eventDate.getTime() === compareDate.getTime() &&
        eventHour === hour &&
        (selectedTeacher === "all" || event.teacherId === selectedTeacher)
      );
    });
  };

  const teachers = [
    { id: "all", name: "Todos los profesores" },
    { id: "1", name: "María González" },
    { id: "2", name: "Carlos Ruiz" },
    { id: "3", name: "Ana Martín" },
    { id: "4", name: "Sofia López" },
  ];

  // Calculate event duration and position
  const getEventStyle = (event: CalendarEvent) => {
    const durationHours =
      (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
    const minutes = event.start.getMinutes();
    const topOffset = (minutes / 60) * 100;

    return {
      height: `${durationHours * 100}%`,
      top: `${topOffset}%`,
      backgroundColor: event.color || "#BBDEFB",
    };
  };

  return (
    <Card className="border-[var(--border-color)]">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-[var(--primary-green)]">
              Calendario de Clases
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Tabs value={view} onValueChange={setView as any}>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mes</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="hover:bg-[var(--primary-green)] hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-[var(--text-primary)]">
                {view === "week"
                  ? `${format(weekStart, "d MMM", { locale: es })} - ${format(
                      weekEnd,
                      "d MMM yyyy",
                      { locale: es },
                    )}`
                  : format(currentDate, "MMMM yyyy", { locale: es })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="hover:bg-[var(--primary-green)] hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="hover:bg-[var(--secondary-blue)] hover:text-white transition-colors"
            >
              Hoy
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {view === "week" && (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time labels and day columns */}
              <div className="grid grid-cols-8 border-t">
                {/* Time column */}
                <div className="sticky left-0 bg-white z-10">
                  <div className="h-12 border-b border-r"></div>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-20 border-b border-r px-2 py-1 text-xs text-[var(--text-secondary)]"
                    >
                      {`${hour}:00`}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {daysInWeek.map((day) => (
                  <div key={day.toISOString()} className="relative">
                    <div className="h-12 border-b border-r p-2 text-center bg-gray-50">
                      <div className="font-medium text-[var(--text-primary)]">
                        {format(day, "EEE", { locale: es })}
                      </div>
                      <div
                        className={`text-sm ${
                          isSameDay(day, new Date())
                            ? "bg-[var(--primary-green)] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>

                    {/* Hour slots */}
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-20 border-b border-r relative"
                        onDrop={() => handleDrop(day, hour)}
                        onDragOver={handleDragOver}
                      >
                        {getEventsForDayAndHour(day, hour).map((event) => (
                          <div
                            key={event.id}
                            className="absolute inset-x-1 calendar-event-card rounded p-1 cursor-pointer overflow-hidden text-xs hover-lift"
                            style={getEventStyle(event)}
                            draggable
                            onDragStart={() => handleDragStart(event)}
                            onClick={() => onEventClick && onEventClick(event)}
                          >
                            <div className="flex flex-col h-full">
                              <span className="font-medium truncate">
                                {event.title}
                              </span>
                              {event.type === "group" && (
                                <span className="text-[10px] opacity-80 truncate">
                                  {event.students.length} estudiantes
                                </span>
                              )}
                              {event.type === "individual" && (
                                <span className="text-[10px] opacity-80 truncate">
                                  {event.students[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "month" && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Month view header */}
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-2 text-center font-medium text-sm text-[var(--text-primary)]"
                >
                  {day}
                </div>
              ))}

              {/* Month view days */}
              {(() => {
                const monthStart = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                );
                const monthEnd = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0,
                );
                const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
                const days = eachDayOfInterval({ start: startDate, end: endDate });

                return days.map((day) => {
                  const dayEvents = events.filter((event) => {
                    const eventDate = new Date(
                      event.start.getFullYear(),
                      event.start.getMonth(),
                      event.start.getDate(),
                    );
                    const compareDate = new Date(
                      day.getFullYear(),
                      day.getMonth(),
                      day.getDate(),
                    );
                    return (
                      eventDate.getTime() === compareDate.getTime() &&
                      (selectedTeacher === "all" ||
                        event.teacherId === selectedTeacher)
                    );
                  });

                  return (
                    <div
                      key={day.toISOString()}
                      className={`bg-white p-2 min-h-[100px] ${
                        day.getMonth() !== currentDate.getMonth()
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isSameDay(day, new Date())
                              ? "bg-[var(--primary-green)] text-white rounded-full w-6 h-6 flex items-center justify-center"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="text-[10px] p-1 rounded cursor-pointer truncate calendar-event-small"
                              style={{
                                backgroundColor: event.color || "#BBDEFB",
                              }}
                              onClick={() => onEventClick && onEventClick(event)}
                            >
                              <span className="calendar-event-content">
                                {format(event.start, 'HH:mm')} {event.title}
                              </span>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <Badge className="text-xs px-1 py-0" variant="secondary">
                              +{dayEvents.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-sm">Clases individuales</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm">Clases grupales</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-sm">Clases muestra</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => exportCalendarToPDF(events, currentDate, view)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Exportar calendario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;