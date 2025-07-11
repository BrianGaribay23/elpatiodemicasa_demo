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

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  teacherId: string;
  teacherName: string;
  type: "individual" | "group" | "trial";
  students: string[];
  color: string;
  level?: string;
}

const CalendarView = ({ events = mockEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 7)); // July 7, 2025
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

  // Generate time slots for the week view
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  // Filter events for the current week and by teacher
  const currentEvents = events.filter((event) => {
    const teacherMatch = selectedTeacher === "all" || event.teacherId === selectedTeacher;
    if (view === "week") {
      return event.start >= weekStart && event.start <= weekEnd && teacherMatch;
    }
    // Month view filtering would go here
    return teacherMatch;
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

          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por profesor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los profesores</SelectItem>
              <SelectItem value="1">María González</SelectItem>
              <SelectItem value="2">Carlos Ruiz</SelectItem>
              <SelectItem value="3">Ana Martín</SelectItem>
              <SelectItem value="4">Sofia López</SelectItem>
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
                  <div className="capitalize">{format(day, "EEEE", { locale: es })}</div>
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
                          <div className="font-medium">
                            {event.title}
                            {event.level && (
                              <Badge className="ml-1 text-xs px-1 py-0" variant="outline">
                                {event.level}
                              </Badge>
                            )}
                          </div>
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
                              <span className="ml-1">{event.teacherName}</span>
                            </div>
                          </div>
                          {event.type === "group" && (
                            <div className="text-xs mt-1 opacity-80">
                              {event.students.length} estudiantes
                            </div>
                          )}
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
            <div className="grid grid-cols-7 gap-1">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div key={day} className="text-center font-medium p-2 text-sm">
                  {day}
                </div>
              ))}

              {/* Month view with proper date calculations */}
              {(() => {
                const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const startDate = startOfWeek(firstDay, { weekStartsOn: 1 });
                const endDate = endOfWeek(lastDay, { weekStartsOn: 1 });
                const days = eachDayOfInterval({ start: startDate, end: endDate });

                return days.map((day, i) => {
                  const dayEvents = events.filter(event => 
                    isSameDay(event.start, day) && 
                    (selectedTeacher === "all" || event.teacherId === selectedTeacher)
                  );
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div
                      key={i}
                      className={`border rounded-md p-2 min-h-[100px] ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isSameDay(day, new Date()) ? 'border-primary border-2' : ''}`}
                    >
                      <div className={`text-right text-sm mb-1 ${
                        isCurrentMonth ? 'text-gray-700 font-medium' : 'text-gray-400'
                      }`}>
                        {day.getDate()}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-1 rounded truncate"
                              style={{ backgroundColor: event.color }}
                            >
                              {format(event.start, 'HH:mm')} {event.title}
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

          <Button variant="outline" className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Exportar calendario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for demonstration - July 7-13, 2025
const mockEvents: CalendarEvent[] = [
  // Lunes - July 7, 2025
  {
    id: "1",
    title: "Español Individual",
    start: new Date(2025, 6, 7, 9, 0, 0),
    end: new Date(2025, 6, 7, 10, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["John Smith 🇺🇸"],
    level: "B1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "2",
    title: "Clase Muestra",
    start: new Date(2025, 6, 7, 10, 0, 0),
    end: new Date(2025, 6, 7, 11, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "trial",
    students: ["Liu Wei 🇨🇳"],
    level: "A1",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "3",
    title: "Grupo Conversación",
    start: new Date(2025, 6, 7, 11, 0, 0),
    end: new Date(2025, 6, 7, 12, 30, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Emma Wilson 🇺🇸", "Pierre Martin 🇫🇷", "Yuki Tanaka 🇯🇵", "Ana Silva 🇧🇷"],
    level: "B2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "4",
    title: "Español de Negocios",
    start: new Date(2025, 6, 7, 14, 0, 0),
    end: new Date(2025, 6, 7, 15, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["Michael Brown 🇺🇸"],
    level: "C1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "5",
    title: "Grupo Principiantes",
    start: new Date(2025, 6, 7, 16, 0, 0),
    end: new Date(2025, 6, 7, 17, 30, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["James Wilson 🇬🇧", "Marie Dubois 🇫🇷", "Hans Mueller 🇩🇪"],
    level: "A1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "6",
    title: "Preparación DELE",
    start: new Date(2025, 6, 7, 18, 0, 0),
    end: new Date(2025, 6, 7, 19, 30, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Chen Wei 🇨🇳", "Kim Lee 🇰🇷", "Ahmed Hassan 🇪🇬"],
    level: "B2",
    color: "#C8E6C9", // Light green
  },
  // Martes - July 8, 2025
  {
    id: "7",
    title: "Clase Muestra",
    start: new Date(2025, 6, 8, 9, 0, 0),
    end: new Date(2025, 6, 8, 10, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "trial",
    students: ["Sophie Anderson 🇬🇧"],
    level: "A2",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "8",
    title: "Gramática Intensiva",
    start: new Date(2025, 6, 8, 10, 0, 0),
    end: new Date(2025, 6, 8, 11, 30, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["David Chen 🇺🇸", "Laura Schmidt 🇩🇪", "Marco Rossi 🇮🇹"],
    level: "B1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "9",
    title: "Español Individual",
    start: new Date(2025, 6, 8, 14, 0, 0),
    end: new Date(2025, 6, 8, 15, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "individual",
    students: ["Natasha Petrova 🇷🇺"],
    level: "A2",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "10",
    title: "Cultura Hispana",
    start: new Date(2025, 6, 8, 16, 0, 0),
    end: new Date(2025, 6, 8, 17, 30, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Tom Williams 🇺🇸", "Julia Brown 🇬🇧", "Paulo Santos 🇧🇷", "Li Ming 🇨🇳"],
    level: "B2",
    color: "#C8E6C9", // Light green
  },
  // Miércoles - July 9, 2025
  {
    id: "11",
    title: "Español Individual",
    start: new Date(2025, 6, 9, 8, 0, 0),
    end: new Date(2025, 6, 9, 9, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["Robert Johnson 🇺🇸"],
    level: "C1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "12",
    title: "Grupo Intermedio",
    start: new Date(2025, 6, 9, 11, 0, 0),
    end: new Date(2025, 6, 9, 12, 30, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Sarah Davis 🇺🇸", "Jean Dupont 🇫🇷", "Kenji Yamamoto 🇯🇵"],
    level: "B1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "13",
    title: "Clase Muestra",
    start: new Date(2025, 6, 9, 15, 0, 0),
    end: new Date(2025, 6, 9, 16, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "trial",
    students: ["Alexander Ivanov 🇷🇺"],
    level: "A1",
    color: "#FFF9C4", // Light yellow
  },
  // Jueves - July 10, 2025
  {
    id: "14",
    title: "Taller de Pronunciación",
    start: new Date(2025, 6, 10, 10, 0, 0),
    end: new Date(2025, 6, 10, 11, 30, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Ming Zhang 🇨🇳", "Hiroshi Tanaka 🇯🇵", "Kim Park 🇰🇷", "Thai Nguyen 🇻🇳"],
    level: "A2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "15",
    title: "Español Avanzado",
    start: new Date(2025, 6, 10, 14, 0, 0),
    end: new Date(2025, 6, 10, 15, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["Catherine Miller 🇺🇸"],
    level: "C2",
    color: "#BBDEFB", // Light blue
  },
  // Viernes - July 11, 2025
  {
    id: "16",
    title: "Grupo DELE B2",
    start: new Date(2025, 6, 11, 9, 0, 0),
    end: new Date(2025, 6, 11, 10, 30, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Lisa Wong 🇸🇬", "Ahmed Ali 🇪🇬", "Maria Costa 🇧🇷"],
    level: "B2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "17",
    title: "Clase Muestra",
    start: new Date(2025, 6, 11, 11, 0, 0),
    end: new Date(2025, 6, 11, 12, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "trial",
    students: ["Jennifer Lee 🇺🇸"],
    level: "A1",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "18",
    title: "Español Individual",
    start: new Date(2025, 6, 11, 12, 0, 0),
    end: new Date(2025, 6, 11, 13, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "individual",
    students: ["François Dubois 🇫🇷"],
    level: "B2",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "19",
    title: "Conversación Libre",
    start: new Date(2025, 6, 11, 16, 0, 0),
    end: new Date(2025, 6, 11, 17, 30, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Various students"],
    level: "Mixto",
    color: "#C8E6C9", // Light green
  },
  {
    id: "20",
    title: "Español para Viajeros",
    start: new Date(2025, 6, 11, 18, 0, 0),
    end: new Date(2025, 6, 11, 19, 30, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Thomas Anderson 🇬🇧", "Eva Schmidt 🇩🇪", "Lucas Silva 🇧🇷"],
    level: "A2",
    color: "#C8E6C9", // Light green
  },
  // Sábado - July 12, 2025
  {
    id: "21",
    title: "Taller Intensivo A1",
    start: new Date(2025, 6, 12, 9, 0, 0),
    end: new Date(2025, 6, 12, 12, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Group of 8 students"],
    level: "A1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "22",
    title: "Club de Lectura",
    start: new Date(2025, 6, 12, 10, 0, 0),
    end: new Date(2025, 6, 12, 11, 30, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Book club members"],
    level: "C1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "23",
    title: "Preparación SIELE",
    start: new Date(2025, 6, 12, 14, 0, 0),
    end: new Date(2025, 6, 12, 16, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Wang Lei 🇨🇳", "Akiko Tanaka 🇯🇵", "Min Park 🇰🇷"],
    level: "B2",
    color: "#C8E6C9", // Light green
  },
  // Domingo - July 13, 2025
  {
    id: "24",
    title: "Español Familiar",
    start: new Date(2025, 6, 13, 10, 0, 0),
    end: new Date(2025, 6, 13, 11, 30, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Johnson Family 🇺🇸", "Mueller Family 🇩🇪"],
    level: "A1-A2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "25",
    title: "Cine y Conversación",
    start: new Date(2025, 6, 13, 16, 0, 0),
    end: new Date(2025, 6, 13, 18, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Cinema club members"],
    level: "B1-B2",
    color: "#C8E6C9", // Light green
  },
  // Más clases durante la semana - Lunes
  {
    id: "26",
    title: "Español Médico",
    start: new Date(2025, 6, 7, 8, 0, 0),
    end: new Date(2025, 6, 7, 9, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["Dr. James Wilson 🇺🇸"],
    level: "B2",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "27",
    title: "Clase Muestra",
    start: new Date(2025, 6, 7, 13, 0, 0),
    end: new Date(2025, 6, 7, 14, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "trial",
    students: ["Isabella Martinez 🇦🇷"],
    level: "A1",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "28",
    title: "Español Online",
    start: new Date(2025, 6, 7, 15, 0, 0),
    end: new Date(2025, 6, 7, 16, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "individual",
    students: ["Remote student 🌍"],
    level: "B1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "29",
    title: "Refuerzo Gramática",
    start: new Date(2025, 6, 7, 19, 0, 0),
    end: new Date(2025, 6, 7, 20, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Grammar review group"],
    level: "A2",
    color: "#C8E6C9", // Light green
  },
  // Martes adicionales
  {
    id: "30",
    title: "Español Ejecutivo",
    start: new Date(2025, 6, 8, 8, 0, 0),
    end: new Date(2025, 6, 8, 9, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["CEO Michael Chen 🇸🇬"],
    level: "B2",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "31",
    title: "Clase Muestra",
    start: new Date(2025, 6, 8, 13, 0, 0),
    end: new Date(2025, 6, 8, 14, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "trial",
    students: ["Olga Petrova 🇷🇺"],
    level: "A2",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "32",
    title: "Conversación Avanzada",
    start: new Date(2025, 6, 8, 18, 0, 0),
    end: new Date(2025, 6, 8, 19, 30, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Advanced conversation group"],
    level: "C1-C2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "33",
    title: "Español para Niños",
    start: new Date(2025, 6, 8, 17, 0, 0),
    end: new Date(2025, 6, 8, 18, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Kids group 6-10 years"],
    level: "Niños",
    color: "#C8E6C9", // Light green
  },
  // Miércoles adicionales
  {
    id: "34",
    title: "Escritura Creativa",
    start: new Date(2025, 6, 9, 18, 0, 0),
    end: new Date(2025, 6, 9, 19, 30, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Creative writing students"],
    level: "C1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "35",
    title: "Fonética y Pronunciación",
    start: new Date(2025, 6, 9, 13, 0, 0),
    end: new Date(2025, 6, 9, 14, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Asian students group"],
    level: "A2-B1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "36",
    title: "Español Turístico",
    start: new Date(2025, 6, 9, 10, 0, 0),
    end: new Date(2025, 6, 9, 11, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "individual",
    students: ["Hotel Manager 🇨🇦"],
    level: "B1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "37",
    title: "Preparación Entrevista",
    start: new Date(2025, 6, 9, 19, 0, 0),
    end: new Date(2025, 6, 9, 20, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["Job seeker 🇺🇸"],
    level: "B2",
    color: "#BBDEFB", // Light blue
  },
  // Jueves adicionales
  {
    id: "38",
    title: "Español Jurídico",
    start: new Date(2025, 6, 10, 8, 0, 0),
    end: new Date(2025, 6, 10, 9, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["Lawyer Sarah Johnson 🇬🇧"],
    level: "C1",
    color: "#BBDEFB", // Light blue
  },
  {
    id: "39",
    title: "Clase Muestra",
    start: new Date(2025, 6, 10, 12, 0, 0),
    end: new Date(2025, 6, 10, 13, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "trial",
    students: ["Ahmed Hassan 🇪🇬"],
    level: "A1",
    color: "#FFF9C4", // Light yellow
  },
  {
    id: "40",
    title: "Español Académico",
    start: new Date(2025, 6, 10, 16, 0, 0),
    end: new Date(2025, 6, 10, 17, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["University students"],
    level: "B2-C1",
    color: "#C8E6C9", // Light green
  },
  {
    id: "41",
    title: "Club de Debate",
    start: new Date(2025, 6, 10, 18, 0, 0),
    end: new Date(2025, 6, 10, 19, 30, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Debate club members"],
    level: "C1-C2",
    color: "#C8E6C9", // Light green
  },
  {
    id: "42",
    title: "Español Básico",
    start: new Date(2025, 6, 10, 20, 0, 0),
    end: new Date(2025, 6, 10, 21, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Evening beginners"],
    level: "A1",
    color: "#C8E6C9", // Light green
  },
  // Más clases para llenar todos los horarios
  // Lunes adicionales
  {
    id: "43",
    title: "Español Intensivo",
    start: new Date(2025, 6, 7, 12, 0, 0),
    end: new Date(2025, 6, 7, 13, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["Fast learner 🇺🇸"],
    level: "A2",
    color: "#BBDEFB",
  },
  {
    id: "44",
    title: "Taller de Escritura",
    start: new Date(2025, 6, 7, 17, 0, 0),
    end: new Date(2025, 6, 7, 18, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Writing workshop"],
    level: "B1",
    color: "#C8E6C9",
  },
  {
    id: "45",
    title: "Español Nocturno",
    start: new Date(2025, 6, 7, 20, 0, 0),
    end: new Date(2025, 6, 7, 21, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Night class students"],
    level: "A1",
    color: "#C8E6C9",
  },
  // Martes adicionales
  {
    id: "46",
    title: "Preparación DELE A2",
    start: new Date(2025, 6, 8, 11, 0, 0),
    end: new Date(2025, 6, 8, 12, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["DELE prep students"],
    level: "A2",
    color: "#C8E6C9",
  },
  {
    id: "47",
    title: "Español Individual",
    start: new Date(2025, 6, 8, 12, 0, 0),
    end: new Date(2025, 6, 8, 13, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["Private student 🇫🇷"],
    level: "B1",
    color: "#BBDEFB",
  },
  {
    id: "48",
    title: "Conversación Libre",
    start: new Date(2025, 6, 8, 19, 0, 0),
    end: new Date(2025, 6, 8, 20, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Open conversation"],
    level: "B2-C1",
    color: "#C8E6C9",
  },
  {
    id: "49",
    title: "Español Online",
    start: new Date(2025, 6, 8, 20, 0, 0),
    end: new Date(2025, 6, 8, 21, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "individual",
    students: ["Remote 🌍"],
    level: "A2",
    color: "#BBDEFB",
  },
  // Miércoles adicionales
  {
    id: "50",
    title: "Clase Muestra",
    start: new Date(2025, 6, 9, 9, 0, 0),
    end: new Date(2025, 6, 9, 10, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "trial",
    students: ["New prospect 🇩🇪"],
    level: "A1",
    color: "#FFF9C4",
  },
  {
    id: "51",
    title: "Español Técnico",
    start: new Date(2025, 6, 9, 14, 0, 0),
    end: new Date(2025, 6, 9, 15, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "individual",
    students: ["Engineer 🇯🇵"],
    level: "B1",
    color: "#BBDEFB",
  },
  {
    id: "52",
    title: "Club de Cine",
    start: new Date(2025, 6, 9, 17, 0, 0),
    end: new Date(2025, 6, 9, 18, 30, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Movie club"],
    level: "B1-B2",
    color: "#C8E6C9",
  },
  {
    id: "53",
    title: "Refuerzo Individual",
    start: new Date(2025, 6, 9, 20, 0, 0),
    end: new Date(2025, 6, 9, 21, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "individual",
    students: ["Extra support 🇺🇸"],
    level: "A2",
    color: "#BBDEFB",
  },
  // Jueves adicionales
  {
    id: "54",
    title: "Español Matutino",
    start: new Date(2025, 6, 10, 9, 0, 0),
    end: new Date(2025, 6, 10, 10, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Morning group"],
    level: "A1",
    color: "#C8E6C9",
  },
  {
    id: "55",
    title: "Práctica DELE",
    start: new Date(2025, 6, 10, 13, 0, 0),
    end: new Date(2025, 6, 10, 14, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["DELE practice"],
    level: "B2",
    color: "#C8E6C9",
  },
  {
    id: "56",
    title: "Español Corporativo",
    start: new Date(2025, 6, 10, 17, 0, 0),
    end: new Date(2025, 6, 10, 18, 0, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Corporate team 🏢"],
    level: "B1-B2",
    color: "#C8E6C9",
  },
  // Viernes adicionales
  {
    id: "57",
    title: "Español Práctico",
    start: new Date(2025, 6, 11, 8, 0, 0),
    end: new Date(2025, 6, 11, 9, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "individual",
    students: ["Practical Spanish 🇬🇧"],
    level: "A2",
    color: "#BBDEFB",
  },
  {
    id: "58",
    title: "Conversación Intermedia",
    start: new Date(2025, 6, 11, 10, 0, 0),
    end: new Date(2025, 6, 11, 11, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Intermediate conversation"],
    level: "B1",
    color: "#C8E6C9",
  },
  {
    id: "59",
    title: "Preparación Examen",
    start: new Date(2025, 6, 11, 13, 0, 0),
    end: new Date(2025, 6, 11, 14, 30, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Exam prep group"],
    level: "B2",
    color: "#C8E6C9",
  },
  {
    id: "60",
    title: "Español Vespertino",
    start: new Date(2025, 6, 11, 19, 0, 0),
    end: new Date(2025, 6, 11, 20, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Evening class"],
    level: "A1-A2",
    color: "#C8E6C9",
  },
  {
    id: "61",
    title: "Tutoría Individual",
    start: new Date(2025, 6, 11, 20, 0, 0),
    end: new Date(2025, 6, 11, 21, 0, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "individual",
    students: ["Private tutoring 🇺🇸"],
    level: "B1",
    color: "#BBDEFB",
  },
  // Sábado adicionales
  {
    id: "62",
    title: "Español Intensivo Sábado",
    start: new Date(2025, 6, 12, 8, 0, 0),
    end: new Date(2025, 6, 12, 9, 0, 0),
    teacherId: "4",
    teacherName: "Sofia L.",
    type: "group",
    students: ["Saturday intensive"],
    level: "A2",
    color: "#C8E6C9",
  },
  {
    id: "63",
    title: "Conversación Sabatina",
    start: new Date(2025, 6, 12, 11, 30, 0),
    end: new Date(2025, 6, 12, 13, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "group",
    students: ["Weekend conversation"],
    level: "B1-B2",
    color: "#C8E6C9",
  },
  {
    id: "64",
    title: "Taller Cultural",
    start: new Date(2025, 6, 12, 16, 0, 0),
    end: new Date(2025, 6, 12, 17, 30, 0),
    teacherId: "2",
    teacherName: "Carlos R.",
    type: "group",
    students: ["Cultural workshop"],
    level: "Todos",
    color: "#C8E6C9",
  },
  // Domingo adicionales
  {
    id: "65",
    title: "Brunch en Español",
    start: new Date(2025, 6, 13, 11, 0, 0),
    end: new Date(2025, 6, 13, 12, 30, 0),
    teacherId: "3",
    teacherName: "Ana M.",
    type: "group",
    students: ["Sunday brunch group"],
    level: "B1-C1",
    color: "#C8E6C9",
  },
  {
    id: "66",
    title: "Preparación Semanal",
    start: new Date(2025, 6, 13, 18, 0, 0),
    end: new Date(2025, 6, 13, 19, 0, 0),
    teacherId: "1",
    teacherName: "María G.",
    type: "individual",
    students: ["Weekly prep 🇺🇸"],
    level: "A2",
    color: "#BBDEFB",
  },
];

export default CalendarView;
