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

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  teacherId: string;
  teacherName: string;
  type: "individual" | "group";
  students: string[];
  color: string;
}

const CalendarView = ({ events = mockEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

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

  // Generate time slots for the week view
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  // Filter events for the current week
  const currentEvents = events.filter((event) => {
    if (view === "week") {
      return event.start >= weekStart && event.start <= weekEnd;
    }
    // Month view filtering would go here
    return true;
  });

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return currentEvents.filter((event) => {
      const eventHour = event.start.getHours();
      return isSameDay(event.start, day) && eventHour === hour;
    });
  };

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Calendario de Clases
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "week" | "month")}
            className="mr-4"
          >
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por profesor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los profesores</SelectItem>
              <SelectItem value="1">María González</SelectItem>
              <SelectItem value="2">Juan Pérez</SelectItem>
              <SelectItem value="3">Ana Rodríguez</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {view === "week" ? (
                <span>
                  {format(weekStart, "dd MMM")} -{" "}
                  {format(weekEnd, "dd MMM yyyy")}
                </span>
              ) : (
                <span>{format(currentDate, "MMMM yyyy")}</span>
              )}
            </div>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {view === "week" ? (
          <div className="border rounded-md">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 font-medium text-center border-r">Hora</div>
              {daysInWeek.map((day) => (
                <div
                  key={day.toString()}
                  className="p-2 font-medium text-center border-r last:border-r-0"
                >
                  <div>{format(day, "EEEE")}</div>
                  <div className="text-sm">{format(day, "dd/MM")}</div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 border-b last:border-b-0"
              >
                <div className="p-2 text-center border-r">{hour}:00</div>

                {daysInWeek.map((day) => {
                  const cellEvents = getEventsForDayAndHour(day, hour);

                  return (
                    <div
                      key={day.toString()}
                      className="p-1 border-r last:border-r-0 min-h-[80px]"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day, hour)}
                    >
                      {cellEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-1 mb-1 rounded-md text-xs cursor-move"
                          style={{ backgroundColor: event.color }}
                          draggable
                          onDragStart={() => handleDragStart(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span>
                              {format(event.start, "HH:mm")} -{" "}
                              {format(event.end, "HH:mm")}
                            </span>
                            <div className="flex items-center">
                              {event.type === "individual" ? (
                                <User className="h-3 w-3 mr-1" />
                              ) : (
                                <Users className="h-3 w-3 mr-1" />
                              )}
                              <span>{event.teacherName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-md p-4">
            <div className="text-center text-lg mb-4">Vista Mensual</div>
            <div className="grid grid-cols-7 gap-1">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}

              {/* Placeholder for month view - would be implemented with proper date calculations */}
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-md p-2 min-h-[100px] bg-gray-50"
                >
                  <div className="text-right text-sm text-gray-500">
                    {i + 1}
                  </div>
                  {i % 7 === 3 && (
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        3 clases
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
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
              <span className="text-sm">Clases de prueba</span>
            </div>
          </div>

          <Button variant="outline" className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Exportar calendario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Clase de Español Básico",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["John Smith"],
    color: "#BBDEFB", // Light blue
  },
  {
    id: "2",
    title: "Grupo Intermedio",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    teacherId: "2",
    teacherName: "Juan P.",
    type: "group",
    students: ["Alice Brown", "Bob Johnson", "Carol White"],
    color: "#C8E6C9", // Light green
  },
  {
    id: "3",
    title: "Clase de Prueba",
    start: new Date(new Date().setHours(16, 0, 0, 0)),
    end: new Date(new Date().setHours(17, 0, 0, 0)),
    teacherId: "3",
    teacherName: "Ana R.",
    type: "individual",
    students: ["New Student"],
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "4",
    title: "Conversación Avanzada",
    start: addDays(new Date(new Date().setHours(11, 0, 0, 0)), 1),
    end: addDays(new Date(new Date().setHours(12, 30, 0, 0)), 1),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["David Miller", "Emma Wilson"],
    color: "#C8E6C9", // Light green
  },
];

export default CalendarView;
