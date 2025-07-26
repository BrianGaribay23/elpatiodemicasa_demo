import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  FileDown,
} from "lucide-react";
import { format, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import JSZip from "jszip";
import logoElPatio from "@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png";

interface Student {
  id: number;
  name: string;
  email: string;
  credits: number;
  country: string;
  countryFlag: string;
  lastPaymentDate?: string;
}

interface GroupData {
  id: number;
  name: string;
  level: string;
  teacher: string;
  schedule: string;
  location: string;
  studentsList?: string[];
  students?: number;
}

interface GroupReenrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupData;
}

// Mock data de estudiantes del grupo con datos más realistas
const getMockStudentsForGroup = (group: GroupData): Student[] => {
  const studentsByGroup: Record<string, Student[]> = {
    "A1 Principiantes": [
      { id: 1, name: "Emma Wilson", email: "emma.wilson@email.com", credits: 3, country: "Estados Unidos", countryFlag: "🇺🇸" },
      { id: 2, name: "Liu Wei", email: "liu.wei@email.com", credits: 0, country: "China", countryFlag: "🇨🇳" },
      { id: 3, name: "Pierre Martin", email: "pierre.martin@email.com", credits: 5, country: "Francia", countryFlag: "🇫🇷" },
    ],
    "A2 Gramática Intensiva": [
      { id: 4, name: "James Wilson", email: "james.wilson@email.com", credits: 2, country: "Estados Unidos", countryFlag: "🇺🇸" },
      { id: 5, name: "Marie Dubois", email: "marie.dubois@email.com", credits: 0, country: "Francia", countryFlag: "🇫🇷" },
      { id: 6, name: "Hans Mueller", email: "hans.mueller@email.com", credits: 4, country: "Alemania", countryFlag: "🇩🇪" },
      { id: 7, name: "Chen Wei", email: "chen.wei@email.com", credits: 1, country: "China", countryFlag: "🇨🇳" },
    ],
    "B1 Intermedio": [
      { id: 8, name: "Michael Chen", email: "michael.chen@email.com", credits: 6, country: "Estados Unidos", countryFlag: "🇺🇸" },
      { id: 9, name: "Ana Silva", email: "ana.silva@email.com", credits: 0, country: "Brasil", countryFlag: "🇧🇷" },
    ],
    "B2 Conversación Avanzada": [
      { id: 10, name: "Emma Thompson", email: "emma.thompson@email.com", credits: 8, country: "Reino Unido", countryFlag: "🇬🇧" },
      { id: 11, name: "Carlos Rodriguez", email: "carlos.rodriguez@email.com", credits: 2, country: "México", countryFlag: "🇲🇽" },
      { id: 12, name: "Yuki Tanaka", email: "yuki.tanaka@email.com", credits: 0, country: "Japón", countryFlag: "🇯🇵" },
    ],
    "C1 Preparación DELE": [
      { id: 13, name: "Sophie Anderson", email: "sophie.anderson@email.com", credits: 10, country: "Estados Unidos", countryFlag: "🇺🇸" },
    ],
  };

  return studentsByGroup[group.name] || [];
};

const MONTHS = [
  { value: "2025-08", label: "Agosto 2025" },
  { value: "2025-09", label: "Septiembre 2025" },
  { value: "2025-10", label: "Octubre 2025" },
  { value: "2025-11", label: "Noviembre 2025" },
  { value: "2025-12", label: "Diciembre 2025" },
];

const CREDIT_PRICE = 35; // Precio por clase en USD

interface GeneratedPDF {
  studentName: string;
  pdfBlob: Blob;
  fileName: string;
}

export default function GroupReenrollmentDialog({
  open,
  onOpenChange,
  group,
}: GroupReenrollmentDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatedPDFs, setGeneratedPDFs] = useState<GeneratedPDF[]>([]);
  const [showDownloadList, setShowDownloadList] = useState(false);

  // Obtener estudiantes del grupo
  const mockGroupStudents = getMockStudentsForGroup(group);

  // Calcular clases del mes seleccionado
  const calculateMonthClasses = (monthStr: string) => {
    if (!monthStr || !group?.schedule) return 0;
    
    const [year, month] = monthStr.split("-").map(Number);
    const monthDate = new Date(year, month - 1);
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);
    const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    // Parsear el horario del grupo (ej: "Lun/Mié 16:00-17:30")
    const scheduleDays = group.schedule.toLowerCase();
    const dayMap: Record<string, number> = {
      'lun': 1, 'mar': 2, 'mié': 3, 'mier': 3, 'jue': 4, 'vie': 5, 'sáb': 6, 'sab': 6, 'dom': 0
    };
    
    let classCount = 0;
    allDays.forEach(day => {
      const dayOfWeek = getDay(day);
      Object.entries(dayMap).forEach(([dayName, dayNumber]) => {
        if (scheduleDays.includes(dayName) && dayOfWeek === dayNumber) {
          classCount++;
        }
      });
    });
    
    return classCount;
  };

  const monthClasses = calculateMonthClasses(selectedMonth);

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === mockGroupStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(mockGroupStudents.map(s => s.id));
    }
  };

  const generatePDF = async () => {
    if (!selectedMonth || selectedStudents.length === 0) return;
    
    setIsGeneratingPDF(true);
    setGeneratedPDFs([]);
    
    try {
      // Convertir el logo a base64
      const logoBase64 = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = reject;
        img.src = logoElPatio;
      });
      
      const selectedStudentData = mockGroupStudents.filter(s => selectedStudents.includes(s.id));
      const [year, month] = selectedMonth.split("-").map(Number);
      const monthDate = new Date(year, month - 1);
      const monthName = format(monthDate, "MMMM yyyy", { locale: es });
      
      // Configuración de colores
      const primaryGreen = [74, 124, 89];
      const secondaryBlue = [46, 89, 132];
      const lightBackground = [253, 251, 248];
      const accentOrange = [242, 153, 74];
      
      // Obtener fechas de clases
      const firstDay = startOfMonth(monthDate);
      const lastDay = endOfMonth(monthDate);
      const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
      
      let classDates: Date[] = [];
      const scheduleDays = group.schedule.toLowerCase();
      const dayMap: Record<string, number> = {
        'lun': 1, 'mar': 2, 'mié': 3, 'mier': 3, 'jue': 4, 'vie': 5, 'sáb': 6, 'sab': 6, 'dom': 0
      };
      
      allDays.forEach(day => {
        const dayOfWeek = getDay(day);
        Object.entries(dayMap).forEach(([dayName, dayNumber]) => {
          if (scheduleDays.includes(dayName) && dayOfWeek === dayNumber) {
            classDates.push(day);
          }
        });
      });
      
      const generatedPDFsList: GeneratedPDF[] = [];
      
      // Generar un PDF por cada estudiante
      for (const student of selectedStudentData) {
        const doc = new jsPDF();
      
      // Fondo
      doc.setFillColor(...lightBackground);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Header con logo
      const logoWidth = 40;
      const logoHeight = 40;
      doc.addImage(logoBase64, 'PNG', 20, 10, logoWidth, logoHeight);
      
      // Título
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Estado de Cuenta", 70, 25);
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Reinscripción ${monthName}`, 70, 32);
      
      // Línea decorativa
      doc.setDrawColor(...primaryGreen);
      doc.setLineWidth(1);
      doc.line(20, 55, 190, 55);
      
      // Información del estudiante (compacta)
      doc.setFillColor(240, 248, 255);
      doc.roundedRect(20, 60, 170, 30, 3, 3, 'F');
      
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Información del Estudiante", 25, 70);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Nombre: ${student.name}`, 25, 78); // Sin bandera
      doc.text(`Email: ${student.email}`, 25, 84);
      doc.text(`Grupo: ${group.name} (${group.level})`, 105, 78);
      doc.text(`Profesor: ${group.teacher}`, 105, 84);
      
      // Cálculos
      const creditosNecesarios = monthClasses;
      const creditosAplicados = Math.min(student.credits, creditosNecesarios);
      const creditosRestantes = Math.max(0, student.credits - creditosNecesarios);
      const creditosPorPagar = creditosNecesarios - creditosAplicados;
      const totalPagar = creditosPorPagar * CREDIT_PRICE;
      
      // Resumen de costos (compacto)
      doc.setFillColor(240, 255, 240);
      doc.roundedRect(20, 95, 170, 55, 3, 3, 'F');
      
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Resumen de Costos", 25, 105);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      // Tabla de resumen
      let yPos = 115;
      const leftCol = 25;
      const rightCol = 155;
      
      doc.text("Total de clases en el mes:", leftCol, yPos);
      doc.setFont("helvetica", "bold");
      doc.text(`${monthClasses} clases`, rightCol, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 6;
      doc.text("Costo por clase:", leftCol, yPos);
      doc.text(`$${CREDIT_PRICE} USD`, rightCol, yPos);
      
      yPos += 6;
      doc.text("Costo total del mes:", leftCol, yPos);
      doc.text(`$${monthClasses * CREDIT_PRICE} USD`, rightCol, yPos);
      
      yPos += 6;
      doc.text("Créditos a favor (anteriores):", leftCol, yPos);
      doc.setTextColor(...primaryGreen);
      doc.text(`${student.credits} créditos`, rightCol, yPos);
      doc.setTextColor(60, 60, 60);
      
      yPos += 6;
      doc.text("Créditos aplicados:", leftCol, yPos);
      doc.setTextColor(...primaryGreen);
      doc.text(`-${creditosAplicados} créditos`, rightCol, yPos);
      doc.setTextColor(60, 60, 60);
      
      // Total a pagar
      doc.setDrawColor(200, 200, 200);
      doc.line(25, yPos + 4, 185, yPos + 4);
      
      yPos += 12;
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL A PAGAR:", leftCol, yPos);
      doc.setTextColor(...accentOrange);
      doc.setFontSize(14);
      doc.text(`$${totalPagar} USD`, rightCol - 5, yPos);
      
      // Calendario de clases en tabla
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Calendario de Clases - ${monthName}`, 20, 165);
      
      // Tabla de clases
      doc.setFillColor(245, 245, 245);
      doc.rect(20, 170, 170, 10, 'F');
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Día", 25, 177);
      doc.text("Fecha", 65, 177);
      doc.text("Horario", 140, 177);
      
      // Contenido de la tabla
      doc.setFont("helvetica", "normal");
      yPos = 187;
      
      classDates.slice(0, 10).forEach((date, index) => { // Máximo 10 clases para que quepa
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, yPos - 5, 170, 7, 'F');
        }
        
        const dayName = format(date, "EEEE", { locale: es });
        const dateStr = format(date, "d 'de' MMMM", { locale: es });
        
        doc.text(dayName.charAt(0).toUpperCase() + dayName.slice(1), 25, yPos);
        doc.text(dateStr, 65, yPos);
        doc.text(group.schedule.split(' ')[1], 140, yPos);
        
        yPos += 7;
      });
      
      if (classDates.length > 10) {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(`... y ${classDates.length - 10} clases más`, 25, yPos);
      }
      
      // Información adicional (muy compacta)
      doc.setFillColor(255, 249, 245);
      doc.roundedRect(20, 265, 170, 20, 3, 3, 'F');
      
      doc.setTextColor(...accentOrange);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("IMPORTANTE:", 25, 273);
      doc.setFont("helvetica", "normal");
      doc.text("Los créditos no utilizados se acumulan. Contacto: info@elpatiodemicasa.com", 25, 279);
      
      // Footer
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(`Generado el ${format(new Date(), "d/MM/yyyy")} - El Patio de Mi Casa © 2025`, 65, 290);
      
      // Convertir a blob para guardar
      const pdfBlob = doc.output('blob');
      const fileName = `reinscripcion-${monthName.toLowerCase().replace(/\s+/g, '-')}-${student.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      generatedPDFsList.push({
        studentName: student.name,
        pdfBlob: pdfBlob,
        fileName: fileName
      });
    }
    
      setGeneratedPDFs(generatedPDFsList);
      setIsGeneratingPDF(false);
      setShowDownloadList(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
      // Generar PDFs sin logo si hay error
      generatePDFWithoutLogo();
    }
  };
  
  // Función de respaldo sin logo
  const generatePDFWithoutLogo = () => {
    const selectedStudentData = mockGroupStudents.filter(s => selectedStudents.includes(s.id));
    const [year, month] = selectedMonth.split("-").map(Number);
    const monthDate = new Date(year, month - 1);
    const monthName = format(monthDate, "MMMM yyyy", { locale: es });
    
    // Configuración de colores
    const primaryGreen = [74, 124, 89];
    const secondaryBlue = [46, 89, 132];
    const lightBackground = [253, 251, 248];
    const accentOrange = [242, 153, 74];
    
    // Obtener fechas de clases
    const firstDay = startOfMonth(monthDate);
    const lastDay = endOfMonth(monthDate);
    const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
    
    let classDates: Date[] = [];
    const scheduleDays = group.schedule.toLowerCase();
    const dayMap: Record<string, number> = {
      'lun': 1, 'mar': 2, 'mié': 3, 'mier': 3, 'jue': 4, 'vie': 5, 'sáb': 6, 'sab': 6, 'dom': 0
    };
    
    allDays.forEach(day => {
      const dayOfWeek = getDay(day);
      Object.entries(dayMap).forEach(([dayName, dayNumber]) => {
        if (scheduleDays.includes(dayName) && dayOfWeek === dayNumber) {
          classDates.push(day);
        }
      });
    });
    
    const generatedPDFsList: GeneratedPDF[] = [];
    
    // Generar un PDF por cada estudiante
    for (const student of selectedStudentData) {
      const doc = new jsPDF();
      
      // Fondo
      doc.setFillColor(...lightBackground);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Header sin logo - rectángulo verde con texto
      doc.setFillColor(...primaryGreen);
      doc.roundedRect(20, 10, 40, 25, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("EL PATIO", 24, 20);
      doc.text("DE MI CASA", 24, 28);
      
      // El resto del código sigue igual...
      // Título
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Estado de Cuenta", 70, 25);
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Reinscripción ${monthName}`, 70, 32);
      
      // Línea decorativa
      doc.setDrawColor(...primaryGreen);
      doc.setLineWidth(1);
      doc.line(20, 45, 190, 45);
      
      // Información del estudiante (compacta)
      doc.setFillColor(240, 248, 255);
      doc.roundedRect(20, 50, 170, 30, 3, 3, 'F');
      
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Información del Estudiante", 25, 60);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Nombre: ${student.name}`, 25, 68);
      doc.text(`Email: ${student.email}`, 25, 74);
      doc.text(`Grupo: ${group.name} (${group.level})`, 105, 68);
      doc.text(`Profesor: ${group.teacher}`, 105, 74);
      
      // Cálculos
      const creditosNecesarios = monthClasses;
      const creditosAplicados = Math.min(student.credits, creditosNecesarios);
      const creditosRestantes = Math.max(0, student.credits - creditosNecesarios);
      const creditosPorPagar = creditosNecesarios - creditosAplicados;
      const totalPagar = creditosPorPagar * CREDIT_PRICE;
      
      // Resumen de costos (compacto)
      doc.setFillColor(240, 255, 240);
      doc.roundedRect(20, 85, 170, 55, 3, 3, 'F');
      
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Resumen de Costos", 25, 95);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      // Tabla de resumen
      let yPos = 105;
      const leftCol = 25;
      const rightCol = 155;
      
      doc.text("Total de clases en el mes:", leftCol, yPos);
      doc.setFont("helvetica", "bold");
      doc.text(`${monthClasses} clases`, rightCol, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 6;
      doc.text("Costo por clase:", leftCol, yPos);
      doc.text(`$${CREDIT_PRICE} USD`, rightCol, yPos);
      
      yPos += 6;
      doc.text("Costo total del mes:", leftCol, yPos);
      doc.text(`$${monthClasses * CREDIT_PRICE} USD`, rightCol, yPos);
      
      yPos += 6;
      doc.text("Créditos a favor (anteriores):", leftCol, yPos);
      doc.setTextColor(...primaryGreen);
      doc.text(`${student.credits} créditos`, rightCol, yPos);
      doc.setTextColor(60, 60, 60);
      
      yPos += 6;
      doc.text("Créditos aplicados:", leftCol, yPos);
      doc.setTextColor(...primaryGreen);
      doc.text(`-${creditosAplicados} créditos`, rightCol, yPos);
      doc.setTextColor(60, 60, 60);
      
      // Total a pagar
      doc.setDrawColor(200, 200, 200);
      doc.line(25, yPos + 4, 185, yPos + 4);
      
      yPos += 12;
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL A PAGAR:", leftCol, yPos);
      doc.setTextColor(...accentOrange);
      doc.setFontSize(14);
      doc.text(`$${totalPagar} USD`, rightCol - 5, yPos);
      
      // Calendario de clases en tabla
      doc.setTextColor(...primaryGreen);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Calendario de Clases - ${monthName}`, 20, 155);
      
      // Tabla de clases
      doc.setFillColor(245, 245, 245);
      doc.rect(20, 160, 170, 10, 'F');
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Día", 25, 167);
      doc.text("Fecha", 65, 167);
      doc.text("Horario", 140, 167);
      
      // Contenido de la tabla
      doc.setFont("helvetica", "normal");
      yPos = 177;
      
      classDates.slice(0, 12).forEach((date, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, yPos - 5, 170, 7, 'F');
        }
        
        const dayName = format(date, "EEEE", { locale: es });
        const dateStr = format(date, "d 'de' MMMM", { locale: es });
        
        doc.text(dayName.charAt(0).toUpperCase() + dayName.slice(1), 25, yPos);
        doc.text(dateStr, 65, yPos);
        doc.text(group.schedule.split(' ')[1], 140, yPos);
        
        yPos += 7;
      });
      
      if (classDates.length > 12) {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(`... y ${classDates.length - 12} clases más`, 25, yPos);
      }
      
      // Información adicional (muy compacta)
      doc.setFillColor(255, 249, 245);
      doc.roundedRect(20, 265, 170, 20, 3, 3, 'F');
      
      doc.setTextColor(...accentOrange);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("IMPORTANTE:", 25, 273);
      doc.setFont("helvetica", "normal");
      doc.text("Los créditos no utilizados se acumulan. Contacto: info@elpatiodemicasa.com", 25, 279);
      
      // Footer
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(`Generado el ${format(new Date(), "d/MM/yyyy")} - El Patio de Mi Casa © 2025`, 65, 290);
      
      // Convertir a blob para guardar
      const pdfBlob = doc.output('blob');
      const fileName = `reinscripcion-${monthName.toLowerCase().replace(/\s+/g, '-')}-${student.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      generatedPDFsList.push({
        studentName: student.name,
        pdfBlob: pdfBlob,
        fileName: fileName
      });
    }
    
    setGeneratedPDFs(generatedPDFsList);
    setIsGeneratingPDF(false);
    setShowDownloadList(true);
  };
  
  const downloadPDF = (pdf: GeneratedPDF) => {
    const url = URL.createObjectURL(pdf.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdf.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadAllPDFs = async () => {
    try {
      // Crear un nuevo archivo ZIP
      const zip = new JSZip();
      
      // Agregar cada PDF al ZIP
      generatedPDFs.forEach((pdf) => {
        zip.file(pdf.fileName, pdf.pdfBlob);
      });
      
      // Generar el archivo ZIP
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Crear el nombre del archivo ZIP
      const [year, month] = selectedMonth.split("-").map(Number);
      const monthDate = new Date(year, month - 1);
      const monthName = format(monthDate, "MMMM-yyyy", { locale: es });
      const zipFileName = `reinscripciones-${group.name.replace(/\s+/g, '-').toLowerCase()}-${monthName}.zip`;
      
      // Descargar el archivo ZIP
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = zipFileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al crear el archivo ZIP:', error);
      // Si falla el ZIP, intentar descargar individualmente con retraso
      generatedPDFs.forEach((pdf, index) => {
        setTimeout(() => {
          downloadPDF(pdf);
        }, index * 500);
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) {
          setShowDownloadList(false);
          setGeneratedPDFs([]);
          setSelectedStudents([]);
          setSelectedMonth("");
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-[var(--primary-green)]">
            {showDownloadList ? "Descargar PDFs Generados" : `Reinscribir Grupo: ${group?.name}`}
          </DialogTitle>
        </DialogHeader>

        {showDownloadList ? (
          // Vista de descarga de PDFs
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Se han generado {generatedPDFs.length} PDFs exitosamente
              </p>
              <Button
                onClick={downloadAllPDFs}
                className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Todos (ZIP)
              </Button>
            </div>

            <div className="space-y-3">
              {generatedPDFs.map((pdf, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[var(--primary-green)]" />
                        <div>
                          <p className="font-medium">{pdf.studentName}</p>
                          <p className="text-sm text-gray-500">{pdf.fileName}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPDF(pdf)}
                        className="text-[var(--secondary-blue)]"
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDownloadList(false);
                  setSelectedStudents([]);
                  setSelectedMonth("");
                }}
              >
                Nueva Reinscripción
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[var(--secondary-blue)] hover:bg-[var(--secondary-blue)]/90"
              >
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Paso 1: Selección de estudiantes */}
            <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--primary-green)]" />
                Seleccionar Estudiantes
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAll}
                className="text-[var(--secondary-blue)]"
              >
                {selectedStudents.length === mockGroupStudents.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            </div>

            <div className="space-y-3">
              {mockGroupStudents.map((student) => (
                <Card 
                  key={student.id}
                  className={`cursor-pointer transition-all ${
                    selectedStudents.includes(student.id) 
                      ? "border-[var(--primary-green)] bg-green-50" 
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => toggleStudent(student.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-2xl">{student.countryFlag}</span>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{student.credits} créditos</span>
                        </div>
                        {student.credits > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Se aplicarán al pago
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Paso 2: Selección de mes */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-[var(--primary-green)]" />
              Seleccionar Mes
            </h3>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el mes de inscripción" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resumen de costos */}
          {selectedMonth && selectedStudents.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Resumen de Inscripción
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Clases en el mes:</span>
                    <span className="font-medium">{monthClasses} clases</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estudiantes seleccionados:</span>
                    <span className="font-medium">{selectedStudents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo por clase:</span>
                    <span className="font-medium">${CREDIT_PRICE} USD</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-sm text-blue-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      Los créditos existentes de cada estudiante se aplicarán automáticamente como descuento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        )}

        {!showDownloadList && (
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGeneratingPDF}
            >
              Cancelar
            </Button>
            <Button
              onClick={generatePDF}
              disabled={selectedStudents.length === 0 || !selectedMonth || isGeneratingPDF}
              className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90"
            >
              {isGeneratingPDF ? (
                <>Generando PDF...</>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reinscribir y Generar PDF
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}