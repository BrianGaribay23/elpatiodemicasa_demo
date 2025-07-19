import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Video, 
  Clock, 
  Users, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Activity,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { format, addHours, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { zoomLinkManager } from "@/modules/shared/utils/zoomLinkManager";

interface ZoomRoom {
  id: string;
  name: string;
  status: "available" | "occupied" | "upcoming";
  currentClass?: {
    name: string;
    teacher: string;
    endTime: Date;
  };
  nextClass?: {
    name: string;
    teacher: string;
    startTime: Date;
  };
}

export default function ZoomRoomStatus() {
  const [rooms, setRooms] = useState<ZoomRoom[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Mock data for demonstration
  const mockScheduledClasses = [
    {
      id: "1",
      startTime: new Date(2025, 0, 19, 10, 0),
      endTime: new Date(2025, 0, 19, 11, 30),
      zoomRoomId: "zoom-1",
      teacherId: "teacher-1",
      level: "B1",
      groupName: "Conversación B1 - Grupo A",
      teacher: "María González"
    },
    {
      id: "2",
      startTime: new Date(2025, 0, 19, 14, 0),
      endTime: new Date(2025, 0, 19, 15, 30),
      zoomRoomId: "zoom-1",
      teacherId: "teacher-2",
      level: "A2",
      groupName: "Gramática A2 - Grupo B",
      teacher: "Carlos Ruiz"
    },
    {
      id: "3",
      startTime: new Date(2025, 0, 19, 10, 0),
      endTime: new Date(2025, 0, 19, 11, 30),
      zoomRoomId: "zoom-2",
      teacherId: "teacher-3",
      level: "C1",
      groupName: "Literatura C1",
      teacher: "Ana Martín"
    },
  ];

  useEffect(() => {
    updateRoomStatus();
    // Update every minute
    const interval = setInterval(updateRoomStatus, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const updateRoomStatus = () => {
    const now = new Date();
    const roomStatuses: ZoomRoom[] = [];

    // Get all 5 Zoom rooms
    for (let i = 1; i <= 5; i++) {
      const roomId = `zoom-${i}`;
      const roomSchedule = mockScheduledClasses.filter(
        cls => cls.zoomRoomId === roomId
      );

      // Find current and next class
      const currentClass = roomSchedule.find(
        cls => now >= cls.startTime && now <= cls.endTime
      );
      
      const nextClass = roomSchedule
        .filter(cls => cls.startTime > now)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];

      let status: "available" | "occupied" | "upcoming" = "available";
      if (currentClass) {
        status = "occupied";
      } else if (nextClass && nextClass.startTime.getTime() - now.getTime() < 30 * 60 * 1000) {
        status = "upcoming";
      }

      roomStatuses.push({
        id: roomId,
        name: `Sala ${i}`,
        status,
        currentClass: currentClass ? {
          name: currentClass.groupName,
          teacher: currentClass.teacher,
          endTime: currentClass.endTime
        } : undefined,
        nextClass: nextClass ? {
          name: nextClass.groupName,
          teacher: nextClass.teacher,
          startTime: nextClass.startTime
        } : undefined
      });
    }

    setRooms(roomStatuses);
    
    // Update stats
    const dayStats = zoomLinkManager.getRoomUsageStats(selectedDate);
    setStats({
      totalRooms: 5,
      occupiedNow: roomStatuses.filter(r => r.status === "occupied").length,
      averageUtilization: dayStats.reduce((acc, room) => acc + room.utilizationRate, 0) / dayStats.length,
      totalClassesToday: dayStats.reduce((acc, room) => acc + room.totalClasses, 0),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "occupied":
        return "bg-red-100 text-red-800 border-red-300";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "occupied":
        return <Video className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Summary Card */}
      <Card className="shadow-md border-[var(--border-color)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
            Estado de Salas Zoom
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Estadísticas
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--primary-green)]">
                {stats?.totalRooms - stats?.occupiedNow || 5}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Salas Disponibles</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[var(--secondary-blue)]">
                {stats?.totalClassesToday || 0}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Clases Hoy</p>
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg border-2 ${getStatusColor(room.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{room.name}</h4>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(room.status)}
                    <span className="text-xs font-medium capitalize">
                      {room.status === "available" ? "Disponible" : 
                       room.status === "occupied" ? "En Uso" : "Próxima"}
                    </span>
                  </div>
                </div>
                
                {room.currentClass && (
                  <div className="text-xs space-y-1">
                    <p className="font-medium truncate">{room.currentClass.name}</p>
                    <p className="text-gray-600">Prof. {room.currentClass.teacher}</p>
                    <p className="text-gray-600">
                      Termina: {format(room.currentClass.endTime, "HH:mm")}
                    </p>
                  </div>
                )}
                
                {!room.currentClass && room.nextClass && (
                  <div className="text-xs space-y-1">
                    <p className="font-medium text-gray-600">Próxima clase:</p>
                    <p className="truncate">{room.nextClass.name}</p>
                    <p className="text-gray-600">
                      {format(room.nextClass.startTime, "HH:mm")}
                    </p>
                  </div>
                )}
                
                {!room.currentClass && !room.nextClass && (
                  <p className="text-xs text-gray-600">
                    Sin clases programadas próximamente
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Utilization Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Utilización del día</span>
              <span className="font-medium">{Math.round(stats?.averageUtilization || 0)}%</span>
            </div>
            <Progress value={stats?.averageUtilization || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Estadísticas de Salas Zoom</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Usage by Room */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Uso por Sala - {format(selectedDate, "d MMMM yyyy", { locale: es })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zoomLinkManager.getRoomUsageStats(selectedDate).map((roomStat, index) => (
                    <div key={roomStat.roomId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Sala {index + 1}</span>
                        <span className="text-muted-foreground">
                          {roomStat.totalClasses} clases • {roomStat.totalHours.toFixed(1)}h
                        </span>
                      </div>
                      <Progress value={roomStat.utilizationRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                <strong>Recomendación:</strong> Las salas 3-5 tienen baja utilización. 
                Considera redistribuir clases para optimizar recursos.
              </AlertDescription>
            </Alert>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Horas Pico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-red-50 rounded">
                    <p className="font-medium text-red-900">Alta demanda</p>
                    <p className="text-red-700">10:00-12:00, 16:00-18:00</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-medium text-green-900">Baja demanda</p>
                    <p className="text-green-700">13:00-15:00, 19:00-20:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}