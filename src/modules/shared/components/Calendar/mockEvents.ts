// Mock events with dynamic dates for demonstration
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export interface CalendarEvent {
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

export const mockEvents: CalendarEvent[] = [
  // Today's classes - Cannot be cancelled
  {
    id: "today-1",
    title: "Español B2 - Conversación",
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30, 0),
    teacherId: "1",
    teacherName: "María González",
    type: "group",
    students: ["Emma Wilson 🇺🇸", "Pierre Martin 🇫🇷", "Yuki Tanaka 🇯🇵"],
    level: "B2",
    color: "#C8E6C9",
  },
  {
    id: "today-2",
    title: "Clase Individual - Negocios",
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0),
    teacherId: "2",
    teacherName: "Carlos Ruiz",
    type: "individual",
    students: ["John Smith 🇺🇸"],
    level: "C1",
    color: "#BBDEFB",
  },
  {
    id: "today-3",
    title: "Clase Muestra",
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0),
    teacherId: "3",
    teacherName: "Ana Martín",
    type: "trial",
    students: ["Liu Wei 🇨🇳"],
    level: "A1",
    color: "#FFF9C4",
  },

  // Tomorrow's classes - Can be cancelled with 50% refund
  {
    id: "tomorrow-1",
    title: "Grupo Principiantes",
    start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0),
    end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 30, 0),
    teacherId: "4",
    teacherName: "Sofia López",
    type: "group",
    students: ["Michael Brown 🇺🇸", "Ana Silva 🇧🇷", "Kim Lee 🇰🇷", "Ahmed Hassan 🇪🇬"],
    level: "A1",
    color: "#C8E6C9",
  },
  {
    id: "tomorrow-2",
    title: "Español Intermedio",
    start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 0, 0),
    end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 30, 0),
    teacherId: "1",
    teacherName: "María González",
    type: "group",
    students: ["Sophie Anderson 🇬🇧", "Marco Rossi 🇮🇹"],
    level: "B1",
    color: "#C8E6C9",
  },

  // Day after tomorrow - Can be cancelled with 100% refund
  {
    id: "future-1",
    title: "Conversación Avanzada",
    start: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 11, 0, 0),
    end: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 12, 30, 0),
    teacherId: "2",
    teacherName: "Carlos Ruiz",
    type: "group",
    students: ["David Chen 🇺🇸", "Laura Schmidt 🇩🇪", "Pedro Fernández 🇲🇽"],
    level: "C1",
    color: "#C8E6C9",
  },
  {
    id: "future-2",
    title: "Preparación DELE",
    start: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 17, 0, 0),
    end: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 18, 30, 0),
    teacherId: "3",
    teacherName: "Ana Martín",
    type: "individual",
    students: ["Robert Johnson 🇺🇸"],
    level: "B2",
    color: "#BBDEFB",
  },

  // Next week - Can be cancelled with 100% refund
  {
    id: "nextweek-1",
    title: "Español para Viajeros",
    start: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 10, 0, 0),
    end: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 11, 30, 0),
    teacherId: "4",
    teacherName: "Sofia López",
    type: "group",
    students: ["Tourist Group 🌍"],
    level: "A2",
    color: "#C8E6C9",
  },
];