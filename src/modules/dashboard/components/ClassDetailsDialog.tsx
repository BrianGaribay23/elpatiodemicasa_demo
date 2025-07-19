import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "../styles/ClassDetailsModal.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  User,
  MapPin,
  Video,
  Copy,
  ExternalLink,
  BookOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClassDetails {
  id: string;
  title: string;
  teacher: string;
  teacherId: string;
  date: Date;
  startTime: string;
  endTime: string;
  level: string;
  groupName: string;
  students: string[];
  maxStudents: number;
  classroom: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  zoomLink?: string;
  zoomPassword?: string;
  zoomMeetingId?: string;
  description?: string;
}

interface ClassDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classDetails: ClassDetails | null;
}

export default function ClassDetailsDialog({
  open,
  onOpenChange,
  classDetails
}: ClassDetailsDialogProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  if (!classDetails) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            Programada
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            En Curso
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 modal-header-animated">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[var(--primary-green)]">
              Detalles de la Clase
            </DialogTitle>
            <div className="status-badge-animated">
              {getStatusBadge(classDetails.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Info Header - More Compact */}
          <div className="flex items-center justify-between class-details-section">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {classDetails.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mt-1">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>Nivel {classDetails.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{classDetails.groupName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date, Time, Teacher and Classroom - Condensed */}
          <div className="grid grid-cols-2 gap-3 class-details-section">
            <div className="p-3 bg-gray-50 rounded-lg hover-lift">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-[var(--secondary-blue)]" />
                <p className="text-xs font-medium">Fecha y Hora</p>
              </div>
              <p className="text-sm font-semibold">
                {format(classDetails.date, "d 'de' MMMM", { locale: es })}
              </p>
              <p className="text-sm">
                {classDetails.startTime} - {classDetails.endTime}
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg hover-lift">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-3 w-3 text-[var(--neutral-gray)]" />
                <p className="text-xs font-medium">Profesor y Aula</p>
              </div>
              <p className="text-sm font-semibold">{classDetails.teacher}</p>
              <p className="text-sm">{classDetails.classroom}</p>
            </div>
          </div>


          {/* Zoom Details */}
          {classDetails.zoomLink && (
            <Card className="bg-blue-50 border-blue-200 zoom-info-card info-card-shine class-details-section">
              <CardContent className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-blue-600 icon-spin" />
                  <h4 className="font-semibold text-blue-900 text-sm">Información de Zoom</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-blue-700">Link de la reunión</p>
                      <p className="font-mono text-xs truncate pr-2">{classDetails.zoomLink}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(classDetails.zoomLink!, "Link")}
                        className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-100 copy-button-animated relative"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedItem === "Link" && <span className="copy-success">✓</span>}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(classDetails.zoomLink, "_blank")}
                        className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {classDetails.zoomMeetingId && (
                      <div>
                        <p className="text-xs text-blue-700">ID de reunión</p>
                        <div className="flex items-center gap-1">
                          <p className="font-mono text-xs">{classDetails.zoomMeetingId}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(classDetails.zoomMeetingId!, "ID")}
                            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 copy-button-animated relative"
                          >
                            <Copy className="h-3 w-3" />
                            {copiedItem === "ID" && <span className="copy-success">✓</span>}
                          </Button>
                        </div>
                      </div>
                    )}

                    {classDetails.zoomPassword && (
                      <div>
                        <p className="text-xs text-blue-700">Contraseña</p>
                        <div className="flex items-center gap-1">
                          <p className="font-mono text-xs">{classDetails.zoomPassword}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(classDetails.zoomPassword!, "Contraseña")}
                            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 copy-button-animated relative"
                          >
                            <Copy className="h-3 w-3" />
                            {copiedItem === "Contraseña" && <span className="copy-success">✓</span>}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Students - Compact */}
          <div className="class-details-section">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-[var(--neutral-gray)]" />
                <p className="text-sm font-medium">Estudiantes</p>
              </div>
              <Badge variant="outline" className="text-xs status-breathe">
                {classDetails.students.length} / {classDetails.maxStudents}
              </Badge>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg hover-lift">
              <div className="grid grid-cols-2 gap-1">
                {classDetails.students.map((student, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs student-list-item">
                    <div className="w-1.5 h-1.5 bg-[var(--primary-green)] rounded-full" />
                    <span>{student}</span>
                  </div>
                ))}
                {classDetails.students.length === 0 && (
                  <p className="text-xs text-[var(--text-secondary)] italic">
                    No hay estudiantes registrados aún
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description - Compact */}
          {classDetails.description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium mb-1">Descripción</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {classDetails.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t action-buttons-container">
            {classDetails.status === "scheduled" && (
              <>
                <Button variant="outline">
                  Editar Clase
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                >
                  Cancelar Clase
                </Button>
              </>
            )}
            {classDetails.zoomLink && classDetails.status !== "completed" && (
              <Button 
                className="bg-[var(--primary-green)] hover:opacity-90 text-white ripple-container"
                onClick={() => window.open(classDetails.zoomLink, "_blank")}
              >
                <Video className="h-4 w-4 mr-2" />
                Unirse a Zoom
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}