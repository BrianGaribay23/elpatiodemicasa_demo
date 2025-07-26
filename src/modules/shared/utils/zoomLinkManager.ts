import { format, isWithinInterval, addMinutes, subMinutes } from 'date-fns';

// Types
interface ZoomRoom {
  id: string;
  meetingId: string;
  meetingUrl: string;
  passcode: string;
  hostEmail: string;
  maxParticipants: number;
}

interface ScheduledClass {
  id: string;
  startTime: Date;
  endTime: Date;
  zoomRoomId?: string;
  teacherId: string;
  level: string;
}

interface TimeSlot {
  start: Date;
  end: Date;
}

// Mock Zoom Pool - En producción vendría de la base de datos
const ZOOM_POOL: ZoomRoom[] = [
  {
    id: 'zoom-1',
    meetingId: '123-456-7890',
    meetingUrl: 'https://zoom.us/j/1234567890',
    passcode: 'ABC123',
    hostEmail: 'sala1@elpatiodemicasa.com',
    maxParticipants: 100
  },
  {
    id: 'zoom-2',
    meetingId: '234-567-8901',
    meetingUrl: 'https://zoom.us/j/2345678901',
    passcode: 'DEF456',
    hostEmail: 'sala2@elpatiodemicasa.com',
    maxParticipants: 100
  },
  {
    id: 'zoom-3',
    meetingId: '345-678-9012',
    meetingUrl: 'https://zoom.us/j/3456789012',
    passcode: 'GHI789',
    hostEmail: 'sala3@elpatiodemicasa.com',
    maxParticipants: 100
  },
  {
    id: 'zoom-4',
    meetingId: '456-789-0123',
    meetingUrl: 'https://zoom.us/j/4567890123',
    passcode: 'JKL012',
    hostEmail: 'sala4@elpatiodemicasa.com',
    maxParticipants: 100
  },
  {
    id: 'zoom-5',
    meetingId: '567-890-1234',
    meetingUrl: 'https://zoom.us/j/5678901234',
    passcode: 'MNO345',
    hostEmail: 'sala5@elpatiodemicasa.com',
    maxParticipants: 100
  }
];

// Buffer time between classes (in minutes)
const BUFFER_TIME = 10;

export class ZoomLinkManager {
  private zoomPool: ZoomRoom[];
  private scheduledClasses: ScheduledClass[];

  constructor() {
    this.zoomPool = ZOOM_POOL;
    this.scheduledClasses = [];
  }

  /**
   * Encuentra una sala de Zoom disponible para un horario específico
   */
  findAvailableZoomRoom(
    startTime: Date,
    endTime: Date,
    existingClasses: ScheduledClass[]
  ): ZoomRoom | null {
    // Agregar buffer time
    const bufferedStart = subMinutes(startTime, BUFFER_TIME);
    const bufferedEnd = addMinutes(endTime, BUFFER_TIME);

    for (const room of this.zoomPool) {
      const hasConflict = existingClasses.some(scheduledClass => {
        if (scheduledClass.zoomRoomId !== room.id) {
          return false;
        }

        // Verificar si hay solapamiento de horarios
        const classStart = new Date(scheduledClass.startTime);
        const classEnd = new Date(scheduledClass.endTime);

        return (
          isWithinInterval(bufferedStart, { start: classStart, end: classEnd }) ||
          isWithinInterval(bufferedEnd, { start: classStart, end: classEnd }) ||
          isWithinInterval(classStart, { start: bufferedStart, end: bufferedEnd }) ||
          isWithinInterval(classEnd, { start: bufferedStart, end: bufferedEnd })
        );
      });

      if (!hasConflict) {
        return room;
      }
    }

    return null;
  }

  /**
   * Asigna una sala de Zoom a una clase
   */
  assignZoomRoom(classSchedule: ScheduledClass): {
    success: boolean;
    zoomRoom?: ZoomRoom;
    error?: string;
  } {
    const availableRoom = this.findAvailableZoomRoom(
      classSchedule.startTime,
      classSchedule.endTime,
      this.scheduledClasses
    );

    if (!availableRoom) {
      return {
        success: false,
        error: 'No hay salas de Zoom disponibles para este horario'
      };
    }

    // Asignar la sala
    classSchedule.zoomRoomId = availableRoom.id;
    this.scheduledClasses.push(classSchedule);

    return {
      success: true,
      zoomRoom: availableRoom
    };
  }

  /**
   * Obtiene todas las clases programadas para una sala específica
   */
  getRoomSchedule(roomId: string, date: Date): ScheduledClass[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.scheduledClasses.filter(
      scheduledClass =>
        scheduledClass.zoomRoomId === roomId &&
        isWithinInterval(scheduledClass.startTime, {
          start: startOfDay,
          end: endOfDay
        })
    );
  }

  /**
   * Libera una sala de Zoom (cuando termina o se cancela una clase)
   */
  releaseZoomRoom(classId: string): void {
    this.scheduledClasses = this.scheduledClasses.filter(
      scheduledClass => scheduledClass.id !== classId
    );
  }

  /**
   * Obtiene estadísticas de uso de salas
   */
  getRoomUsageStats(date: Date): {
    roomId: string;
    totalClasses: number;
    totalHours: number;
    utilizationRate: number;
  }[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const stats = this.zoomPool.map(room => {
      const roomClasses = this.scheduledClasses.filter(
        scheduledClass =>
          scheduledClass.zoomRoomId === room.id &&
          isWithinInterval(scheduledClass.startTime, {
            start: startOfDay,
            end: endOfDay
          })
      );

      const totalHours = roomClasses.reduce((total, scheduledClass) => {
        const duration = (scheduledClass.endTime.getTime() - scheduledClass.startTime.getTime()) / (1000 * 60 * 60);
        return total + duration;
      }, 0);

      // Asumiendo día laboral de 8am a 8pm (12 horas)
      const utilizationRate = (totalHours / 12) * 100;

      return {
        roomId: room.id,
        totalClasses: roomClasses.length,
        totalHours,
        utilizationRate
      };
    });

    return stats;
  }

  /**
   * Programa múltiples clases y asigna salas de Zoom
   */
  scheduleMultipleClasses(
    classes: Omit<ScheduledClass, 'zoomRoomId'>[]
  ): {
    scheduled: ScheduledClass[];
    failed: { class: Omit<ScheduledClass, 'zoomRoomId'>; reason: string }[];
  } {
    const scheduled: ScheduledClass[] = [];
    const failed: { class: Omit<ScheduledClass, 'zoomRoomId'>; reason: string }[] = [];

    // Ordenar clases por hora de inicio para optimizar asignación
    const sortedClasses = [...classes].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    for (const classToSchedule of sortedClasses) {
      const result = this.assignZoomRoom({
        ...classToSchedule,
        zoomRoomId: undefined
      } as ScheduledClass);

      if (result.success) {
        scheduled.push({
          ...classToSchedule,
          zoomRoomId: result.zoomRoom!.id
        } as ScheduledClass);
      } else {
        failed.push({
          class: classToSchedule,
          reason: result.error!
        });
      }
    }

    return { scheduled, failed };
  }

  /**
   * Verifica si hay suficientes salas para un horario específico
   */
  checkAvailability(timeSlots: TimeSlot[]): {
    available: boolean;
    maxConcurrentClasses: number;
    availableRooms: number;
  } {
    // Encontrar el máximo número de clases concurrentes
    let maxConcurrent = 0;
    
    for (const slot of timeSlots) {
      const concurrent = this.scheduledClasses.filter(scheduledClass => {
        const classStart = new Date(scheduledClass.startTime);
        const classEnd = new Date(scheduledClass.endTime);
        
        return (
          isWithinInterval(slot.start, { start: classStart, end: classEnd }) ||
          isWithinInterval(slot.end, { start: classStart, end: classEnd }) ||
          isWithinInterval(classStart, { start: slot.start, end: slot.end })
        );
      }).length;
      
      maxConcurrent = Math.max(maxConcurrent, concurrent);
    }

    return {
      available: maxConcurrent < this.zoomPool.length,
      maxConcurrentClasses: maxConcurrent,
      availableRooms: this.zoomPool.length
    };
  }

  /**
   * Obtiene recomendaciones de horarios con mayor disponibilidad
   */
  getOptimalTimeSlots(
    duration: number, // en minutos
    date: Date
  ): { timeSlot: TimeSlot; availability: number }[] {
    const recommendations: { timeSlot: TimeSlot; availability: number }[] = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = addMinutes(slotStart, duration);
      
      if (slotEnd.getHours() <= endHour) {
        const availableRooms = this.zoomPool.filter(room => {
          const hasConflict = this.scheduledClasses.some(scheduledClass => {
            if (scheduledClass.zoomRoomId !== room.id) return false;
            
            const classStart = new Date(scheduledClass.startTime);
            const classEnd = new Date(scheduledClass.endTime);
            
            return (
              isWithinInterval(slotStart, { start: classStart, end: classEnd }) ||
              isWithinInterval(slotEnd, { start: classStart, end: classEnd })
            );
          });
          
          return !hasConflict;
        }).length;

        recommendations.push({
          timeSlot: { start: slotStart, end: slotEnd },
          availability: (availableRooms / this.zoomPool.length) * 100
        });
      }
    }

    // Ordenar por mayor disponibilidad
    return recommendations.sort((a, b) => b.availability - a.availability);
  }
}

// Exportar instancia singleton
export const zoomLinkManager = new ZoomLinkManager();