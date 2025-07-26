import jsPDF from 'jspdf';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import logoElPatio from '@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png';

// Función auxiliar para convertir imagen a base64
async function convertImageToBase64(imgSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
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
    img.src = imgSrc;
  });
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  teacherId: string;
  teacherName: string;
  type: "individual" | "group" | "trial";
  students: string[];
  level?: string;
}

export const exportCalendarToPDF = async (
  events: CalendarEvent[],
  currentDate: Date,
  view: 'week' | 'month'
) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Configuración de colores
  const primaryGreen = [74, 124, 89] as [number, number, number];
  const secondaryBlue = [46, 89, 132] as [number, number, number];
  const lightBackground = [253, 251, 248] as [number, number, number];
  const accentOrange = [242, 153, 74] as [number, number, number];
  
  // Fondo del documento
  doc.setFillColor(...lightBackground);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header con estilo mejorado (más compacto)
  doc.setFillColor(...primaryGreen);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Add logo with proper handling (más pequeño)
  try {
    const logoBase64 = await convertImageToBase64(logoElPatio);
    doc.addImage(logoBase64, 'PNG', 10, 5, 25, 25);
  } catch (error) {
    console.error('Error adding logo:', error);
    // Fallback logo
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 5, 25, 25, 3, 3, 'F');
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("EL PATIO", 13, 15);
    doc.text("DE MI CASA", 13, 21);
  }
  
  // Title with better styling (más compacto)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text('El Patio de Mi Casa', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text('Calendario de Clases de Español', pageWidth / 2, 23, { align: 'center' });
  
  // Date range with icon
  let dateRange = '';
  if (view === 'week') {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    dateRange = `${format(weekStart, "d 'de' MMMM", { locale: es })} - ${format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
  } else {
    dateRange = format(currentDate, "MMMM 'de' yyyy", { locale: es });
  }
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(dateRange, pageWidth / 2, 30, { align: 'center' });
  
  // Legend box with better styling (más arriba)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - 70, 40, 60, 22, 3, 3, 'F');
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth - 70, 40, 60, 22, 3, 3, 'D');
  
  doc.setTextColor(...secondaryBlue);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text('Tipos de Clase:', pageWidth - 65, 47);
  
  const legendY = 51;
  doc.setFillColor(219, 234, 254); // Light blue
  doc.circle(pageWidth - 65, legendY, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text('Individual', pageWidth - 61, legendY + 0.5);
  
  doc.setFillColor(220, 252, 231); // Light green
  doc.circle(pageWidth - 65, legendY + 4, 1.5, 'F');
  doc.text('Grupal', pageWidth - 61, legendY + 4.5);
  
  doc.setFillColor(254, 243, 199); // Light yellow
  doc.circle(pageWidth - 65, legendY + 8, 1.5, 'F');
  doc.text('Muestra', pageWidth - 61, legendY + 8.5);
  
  if (view === 'week') {
    exportWeekView(doc, events, currentDate);
  } else {
    exportMonthView(doc, events, currentDate);
  }
  
  // Footer with improved styling (más compacto)
  doc.setFillColor(...primaryGreen);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  // Línea decorativa
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 11, pageWidth - 20, pageHeight - 11);
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado: ${format(new Date(), "d/MM/yyyy HH:mm", { locale: es })}`,
    20,
    pageHeight - 7
  );
  
  doc.setFont("helvetica", "bold");
  doc.text(
    'El Patio de Mi Casa © 2025',
    pageWidth / 2,
    pageHeight - 7,
    { align: 'center' }
  );
  
  doc.setFont("helvetica", "normal");
  doc.text(
    'www.elpatiodemicasa.com',
    pageWidth - 20,
    pageHeight - 7,
    { align: 'right' }
  );
  
  // Save the PDF
  const fileName = view === 'week' 
    ? `calendario_semana_${format(currentDate, 'yyyy-MM-dd')}.pdf`
    : `calendario_mes_${format(currentDate, 'yyyy-MM')}.pdf`;
  doc.save(fileName);
};

function exportWeekView(doc: jsPDF, events: CalendarEvent[], currentDate: Date) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Configuración de colores
  const primaryGreen = [74, 124, 89] as [number, number, number];
  const secondaryBlue = [46, 89, 132] as [number, number, number];
  
  const startY = 70;
  const cellWidth = 35;
  const cellHeight = 8;
  const timeColumnWidth = 20;
  const hoursPerDay = 13; // 8 AM to 8 PM
  
  // Draw headers with better styling
  doc.setFillColor(...secondaryBlue);
  doc.roundedRect(10, startY, timeColumnWidth, cellHeight, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text('Hora', 10 + timeColumnWidth / 2, startY + cellHeight / 2 + 1, { align: 'center' });
  
  daysInWeek.forEach((day, index) => {
    const x = 10 + timeColumnWidth + (index * cellWidth);
    
    // Highlight today with green
    if (isSameDay(day, new Date())) {
      doc.setFillColor(...primaryGreen);
      doc.roundedRect(x, startY, cellWidth, cellHeight, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(...secondaryBlue);
      doc.roundedRect(x, startY, cellWidth, cellHeight, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
    }
    
    doc.setFontSize(9);
    const dayName = format(day, 'EEE', { locale: es }).charAt(0).toUpperCase() + format(day, 'EEE', { locale: es }).slice(1);
    doc.text(
      `${dayName} ${format(day, 'd', { locale: es })}`,
      x + cellWidth / 2,
      startY + cellHeight / 2 + 1,
      { align: 'center' }
    );
  });
  
  // Draw time slots and events
  for (let hour = 8; hour <= 20; hour++) {
    const y = startY + cellHeight + ((hour - 8) * cellHeight);
    
    // Time column
    doc.setFillColor(245, 245, 245);
    doc.rect(10, y, timeColumnWidth, cellHeight, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(10, y, timeColumnWidth, cellHeight, 'D');
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`${hour}:00`, 10 + timeColumnWidth / 2, y + cellHeight / 2 + 1, { align: 'center' });
    
    // Day columns
    daysInWeek.forEach((day, dayIndex) => {
      const x = 10 + timeColumnWidth + (dayIndex * cellWidth);
      doc.setDrawColor(220, 220, 220);
      doc.rect(x, y, cellWidth, cellHeight, 'D');
      
      // Find events for this time slot
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return isSameDay(eventDate, day) && eventDate.getHours() === hour;
      });
      
      if (dayEvents.length > 0) {
        const event = dayEvents[0]; // Show first event if multiple
        const color = getEventColor(event.type);
        
        doc.setFillColor(color.r, color.g, color.b);
        doc.roundedRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2, 1, 1, 'F');
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const eventText = event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title;
        doc.text(eventText, x + cellWidth / 2, y + cellHeight / 2 + 1, { align: 'center' });
      }
    });
  }
}

function exportMonthView(doc: jsPDF, events: CalendarEvent[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Configuración de colores
  const primaryGreen = [74, 124, 89] as [number, number, number];
  const secondaryBlue = [46, 89, 132] as [number, number, number];
  
  const startY = 70;
  const cellWidth = 38;
  const cellHeight = 22;
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Draw day headers
  daysOfWeek.forEach((day, index) => {
    const x = 10 + (index * cellWidth);
    doc.setFillColor(...secondaryBlue);
    doc.roundedRect(x, startY, cellWidth, 10, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(day, x + cellWidth / 2, startY + 6, { align: 'center' });
  });
  
  // Draw calendar days
  let currentRow = 0;
  days.forEach((day, index) => {
    const col = index % 7;
    if (col === 0 && index > 0) currentRow++;
    
    const x = 10 + (col * cellWidth);
    const y = startY + 10 + (currentRow * cellHeight);
    
    // Draw cell
    doc.setDrawColor(220, 220, 220);
    doc.rect(x, y, cellWidth, cellHeight, 'D');
    
    // Fade out days from other months
    if (day.getMonth() !== currentDate.getMonth()) {
      doc.setFillColor(250, 250, 250);
      doc.rect(x, y, cellWidth, cellHeight, 'F');
    }
    
    // Highlight today
    if (isSameDay(day, new Date())) {
      doc.setFillColor(...primaryGreen);
      doc.setGState(doc.GState({ opacity: 0.1 }));
      doc.rect(x, y, cellWidth, cellHeight, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));
    }
    
    // Day number
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(day.getMonth() !== currentDate.getMonth() ? 180 : 60);
    doc.text(format(day, 'd'), x + 2, y + 5);
    
    // Events for this day
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.start), day)
    );
    
    if (dayEvents.length > 0) {
      let eventY = y + 8;
      dayEvents.slice(0, 2).forEach(event => {
        const color = getEventColor(event.type);
        doc.setFillColor(color.r, color.g, color.b);
        doc.roundedRect(x + 1, eventY, cellWidth - 2, 4, 0.5, 0.5, 'F');
        
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const eventText = `${format(event.start, 'HH:mm')} ${event.title}`;
        const truncatedText = eventText.length > 20 ? eventText.substring(0, 20) + '...' : eventText;
        doc.text(truncatedText, x + 2, eventY + 2.5);
        
        eventY += 5;
      });
      
      if (dayEvents.length > 2) {
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(`+${dayEvents.length - 2} más`, x + 2, eventY + 2);
      }
    }
  });
}

function getEventColor(type: string): { r: number; g: number; b: number } {
  switch (type) {
    case 'individual':
      return { r: 219, g: 234, b: 254 }; // Light blue - más suave
    case 'group':
      return { r: 220, g: 252, b: 231 }; // Light green - más suave
    case 'trial':
      return { r: 254, g: 243, b: 199 }; // Light yellow - más suave
    default:
      return { r: 243, g: 244, b: 246 }; // Light gray - más suave
  }
}