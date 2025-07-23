import jsPDF from 'jspdf';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import logo from '@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png';

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
  
  // Background header
  doc.setFillColor(74, 124, 89); // Primary green
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Add logo with white background circle
  try {
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 22, 18, 'F');
    doc.addImage(logo, 'PNG', 10, 7, 30, 30);
  } catch (error) {
    console.error('Error adding logo:', error);
  }
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('El Patio de Mi Casa', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Calendario de Clases de Español', pageWidth / 2, 28, { align: 'center' });
  
  // Date range
  let dateRange = '';
  if (view === 'week') {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    dateRange = `${format(weekStart, "d 'de' MMMM", { locale: es })} - ${format(weekEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
  } else {
    dateRange = format(currentDate, "MMMM 'de' yyyy", { locale: es });
  }
  
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(dateRange, pageWidth / 2, 36, { align: 'center' });
  
  // Legend box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(pageWidth - 65, 47, 55, 20, 2, 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(pageWidth - 65, 47, 55, 20, 2, 2, 'D');
  
  const legendY = 52;
  doc.setFillColor(187, 222, 251); // Light blue
  doc.circle(pageWidth - 60, legendY, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Individual', pageWidth - 55, legendY + 1);
  
  doc.setFillColor(200, 230, 201); // Light green
  doc.circle(pageWidth - 60, legendY + 5, 2, 'F');
  doc.text('Grupal', pageWidth - 55, legendY + 6);
  
  doc.setFillColor(255, 249, 196); // Light yellow
  doc.circle(pageWidth - 60, legendY + 10, 2, 'F');
  doc.text('Muestra', pageWidth - 55, legendY + 11);
  
  if (view === 'week') {
    exportWeekView(doc, events, currentDate);
  } else {
    exportMonthView(doc, events, currentDate);
  }
  
  // Footer with background
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generado el ${format(new Date(), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );
  
  doc.setTextColor(74, 124, 89);
  doc.text(
    'www.elpatiodemicasa.com',
    pageWidth / 2,
    pageHeight - 4,
    { align: 'center' }
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
  
  const startY = 75;
  const cellWidth = 35;
  const cellHeight = 8;
  const timeColumnWidth = 20;
  const hoursPerDay = 13; // 8 AM to 8 PM
  
  // Draw headers with better styling
  doc.setFillColor(46, 89, 132); // Secondary blue
  doc.rect(10, startY, timeColumnWidth, cellHeight, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Hora', 10 + timeColumnWidth / 2, startY + cellHeight / 2 + 1, { align: 'center' });
  
  daysInWeek.forEach((day, index) => {
    const x = 10 + timeColumnWidth + (index * cellWidth);
    
    // Highlight today with green
    if (isSameDay(day, new Date())) {
      doc.setFillColor(74, 124, 89); // Primary green
      doc.rect(x, startY, cellWidth, cellHeight, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(46, 89, 132); // Secondary blue
      doc.rect(x, startY, cellWidth, cellHeight, 'F');
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
    doc.setFillColor(250, 250, 250);
    doc.rect(10, y, timeColumnWidth, cellHeight, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`${hour}:00`, 10 + timeColumnWidth / 2, y + cellHeight / 2 + 1, { align: 'center' });
    
    // Day columns
    daysInWeek.forEach((day, dayIndex) => {
      const x = 10 + timeColumnWidth + (dayIndex * cellWidth);
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
        doc.rect(x + 1, y + 1, cellWidth - 2, cellHeight - 2, 'F');
        
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
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
  
  const startY = 60;
  const cellWidth = 38;
  const cellHeight = 20;
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Draw day headers
  daysOfWeek.forEach((day, index) => {
    const x = 10 + (index * cellWidth);
    doc.setFillColor(240, 240, 240);
    doc.rect(x, startY, cellWidth, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(day, x + cellWidth / 2, startY + 5, { align: 'center' });
  });
  
  // Draw calendar days
  let currentRow = 0;
  days.forEach((day, index) => {
    const col = index % 7;
    if (col === 0 && index > 0) currentRow++;
    
    const x = 10 + (col * cellWidth);
    const y = startY + 8 + (currentRow * cellHeight);
    
    // Draw cell
    doc.rect(x, y, cellWidth, cellHeight, 'D');
    
    // Fade out days from other months
    if (day.getMonth() !== currentDate.getMonth()) {
      doc.setFillColor(250, 250, 250);
      doc.rect(x, y, cellWidth, cellHeight, 'F');
    }
    
    // Highlight today
    if (isSameDay(day, new Date())) {
      doc.setFillColor(74, 124, 89, 20);
      doc.rect(x, y, cellWidth, cellHeight, 'F');
    }
    
    // Day number
    doc.setFontSize(8);
    doc.setTextColor(day.getMonth() !== currentDate.getMonth() ? 150 : 0);
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
        doc.rect(x + 1, eventY, cellWidth - 2, 4, 'F');
        
        doc.setFontSize(6);
        doc.setTextColor(0, 0, 0);
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
      return { r: 187, g: 222, b: 251 }; // Light blue
    case 'group':
      return { r: 200, g: 230, b: 201 }; // Light green
    case 'trial':
      return { r: 255, g: 249, b: 196 }; // Light yellow
    default:
      return { r: 230, g: 230, b: 230 }; // Light gray
  }
}