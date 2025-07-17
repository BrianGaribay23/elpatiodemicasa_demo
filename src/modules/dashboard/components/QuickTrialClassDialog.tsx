import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Globe,
  CheckCircle,
  ChevronRight,
  Download,
  Mail,
  User,
  Languages
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import logoElPatio from "@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png";

// Países comunes
const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "Estados Unidos", timezone: "America/New_York", offset: -5 },
  { code: "CN", flag: "🇨🇳", name: "China", timezone: "Asia/Shanghai", offset: 8 },
  { code: "BR", flag: "🇧🇷", name: "Brasil", timezone: "America/Sao_Paulo", offset: -3 },
  { code: "FR", flag: "🇫🇷", name: "Francia", timezone: "Europe/Paris", offset: 1 },
  { code: "DE", flag: "🇩🇪", name: "Alemania", timezone: "Europe/Berlin", offset: 1 },
  { code: "JP", flag: "🇯🇵", name: "Japón", timezone: "Asia/Tokyo", offset: 9 },
  { code: "GB", flag: "🇬🇧", name: "Reino Unido", timezone: "Europe/London", offset: 0 },
  { code: "IT", flag: "🇮🇹", name: "Italia", timezone: "Europe/Rome", offset: 1 },
  { code: "CA", flag: "🇨🇦", name: "Canadá", timezone: "America/Toronto", offset: -5 },
  { code: "AU", flag: "🇦🇺", name: "Australia", timezone: "Australia/Sydney", offset: 11 },
];

// Idiomas nativos
const NATIVE_LANGUAGES = [
  "Inglés",
  "Mandarín", 
  "Portugués",
  "Francés",
  "Alemán",
  "Japonés",
  "Italiano",
  "Coreano",
  "Ruso",
  "Árabe",
];

// Form schema
const trialClassSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
  country: z.string().min(1, "Selecciona un país"),
  nativeLanguage: z.string().min(1, "Selecciona tu idioma nativo"),
  selectedSlot: z.string().min(1, "Selecciona un horario"),
});

type TrialClassFormData = z.infer<typeof trialClassSchema>;

interface QuickTrialClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickTrialClassDialog({
  open,
  onOpenChange,
}: QuickTrialClassDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [classScheduled, setClassScheduled] = useState(false);
  const [scheduledData, setScheduledData] = useState<any>(null);

  const form = useForm<TrialClassFormData>({
    resolver: zodResolver(trialClassSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      nativeLanguage: "",
      selectedSlot: "",
    },
  });

  // Convertir hora a zona horaria del estudiante
  const convertToStudentTimezone = (time: string) => {
    if (!selectedCountry) return time;
    
    const mexicoOffset = -6; // CST Mexico
    const studentOffset = selectedCountry.offset;
    const hourDifference = studentOffset - mexicoOffset;

    const [hours, minutes] = time.split(":").map(Number);
    let adjustedHour = (hours + hourDifference + 24) % 24;

    return `${adjustedHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Horarios disponibles para clase de prueba
  const trialClassSlots = [
    { id: "1", date: "2025-01-17", time: "10:00", available: true },
    { id: "2", date: "2025-01-17", time: "14:00", available: true },
    { id: "3", date: "2025-01-17", time: "16:00", available: false },
    { id: "4", date: "2025-01-18", time: "09:00", available: true },
    { id: "5", date: "2025-01-18", time: "11:00", available: true },
    { id: "6", date: "2025-01-18", time: "15:00", available: true },
    { id: "7", date: "2025-01-19", time: "10:00", available: true },
    { id: "8", date: "2025-01-19", time: "12:00", available: false },
  ];

  const generatePDF = async (data: TrialClassFormData) => {
    const selectedSlot = trialClassSlots.find(slot => slot.id === data.selectedSlot);
    
    if (!selectedSlot) return;

    const doc = new jsPDF();
    
    // Configuración de colores
    const primaryGreen = [74, 124, 89]; // #4A7C59
    const secondaryBlue = [46, 89, 132]; // #2E5984
    const lightBackground = [253, 251, 248]; // #FDFBF8

    // Generar link de Zoom único para la clase
    const zoomMeetingId = Math.random().toString(36).substring(2, 15);
    const zoomLink = `https://zoom.us/j/${zoomMeetingId}`;
    const zoomPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Header con fondo
    doc.setFillColor(...lightBackground);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Cargar logo como imagen
    try {
      // Convertir imagen a base64 para jsPDF
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Crear canvas para convertir a base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            const dataURL = canvas.toDataURL('image/png');
            doc.addImage(dataURL, 'PNG', 20, 15, 35, 25);
            resolve(true);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = logoElPatio;
      });
    } catch (error) {
      console.log("Error cargando logo, usando fallback:", error);
      // Fallback estilizado si el logo no carga
      doc.setFillColor(...primaryGreen);
      doc.roundedRect(20, 15, 35, 25, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("EL PATIO", 25, 25);
      doc.text("DE MI CASA", 25, 32);
    }

    // Título principal
    doc.setTextColor(...secondaryBlue);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("El Patio de Mi Casa", 65, 25);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Centro de Aprendizaje de Español", 65, 33);

    // Decoración
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(2);
    doc.line(20, 50, 190, 50);

    // Título de invitación
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("¡Invitación a tu Clase de Prueba!", 20, 70);

    // Mensaje de bienvenida
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const welcomeText = `¡Hola ${data.name}! Nos complace invitarte a tu clase de prueba gratuita.`;
    doc.text(welcomeText, 20, 85);
    
    const infoText = "Esta clase nos permitirá conocer tu nivel actual y encontrar el grupo perfecto para ti.";
    doc.text(infoText, 20, 95);

    // Sección de detalles del estudiante
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(20, 110, 170, 30, 5, 5, 'F');
    
    doc.setTextColor(...secondaryBlue);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Estudiante", 25, 125);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${data.name}`, 25, 135);
    doc.text(`Email: ${data.email}`, 100, 135);

    // Sección de detalles de la clase
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(20, 150, 170, 60, 5, 5, 'F');
    
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de tu Clase de Prueba", 25, 165);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const dateFormatted = format(new Date(selectedSlot.date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    doc.text(`Fecha: ${dateFormatted}`, 25, 180);
    doc.text(`Hora (México): ${selectedSlot.time}`, 25, 187);
    doc.text(`Tu hora local: ${convertToStudentTimezone(selectedSlot.time)}`, 25, 194);
    doc.text(`Duración: 30 minutos`, 25, 201);

    // Sección de acceso a Zoom
    doc.setFillColor(255, 240, 245);
    doc.roundedRect(20, 220, 170, 45, 5, 5, 'F');
    
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Acceso a tu Clase Virtual", 25, 235);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Link de Zoom: ${zoomLink}`, 25, 245);
    doc.text(`ID de reunión: ${zoomMeetingId}`, 25, 252);
    doc.text(`Contraseña: ${zoomPassword}`, 25, 259);

    // Información importante
    doc.setFillColor(255, 248, 220);
    doc.roundedRect(20, 270, 170, 35, 5, 5, 'F');
    
    doc.setTextColor(200, 120, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Información Importante", 25, 285);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("• Ingresa 5 minutos antes del horario programado", 25, 295);
    doc.text("• Asegúrate de tener buena conexión a internet y micrófono", 25, 300);

    // Nueva página para información adicional
    doc.addPage();
    doc.setFillColor(...lightBackground);
    doc.rect(0, 0, 210, 297, 'F');

    // Header de segunda página
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("¿Qué esperar en tu clase de prueba?", 20, 30);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const expectations = [
      "🗣️  Conversación inicial para conocerte",
      "📚  Evaluación de tu nivel actual de español",
      "🎯  Identificación de tus objetivos de aprendizaje",
      "👥  Recomendación del grupo más adecuado para ti",
      "📋  Información sobre nuestros programas y metodología"
    ];

    let yPosition = 50;
    expectations.forEach(expectation => {
      doc.text(expectation, 25, yPosition);
      yPosition += 15;
    });

    // Contacto y footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("¿Preguntas? Contáctanos:", 20, 150);
    doc.text("📧 info@elpatiodemicasa.com", 25, 160);
    doc.text("📱 +52 555 123 4567", 25, 170);
    doc.text("🌐 www.elpatiodemicasa.com", 25, 180);
    
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("¡Te esperamos con mucho gusto!", 20, 200);

    // Decoración inferior
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(1);
    doc.line(20, 220, 190, 220);

    // Nota final
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Generado automáticamente - El Patio de Mi Casa © 2025", 20, 280);

    // Guardar PDF
    const fileName = `invitacion-clase-prueba-${data.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(fileName);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(["name", "email", "phone", "country", "nativeLanguage"]);
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  const handleSubmit = (data: TrialClassFormData) => {
    setScheduledData(data);
    setClassScheduled(true);
    
    // Generar PDF automáticamente
    setTimeout(async () => {
      await generatePDF(data);
    }, 500);
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setClassScheduled(false);
    setScheduledData(null);
    onOpenChange(false);
  };

  if (classScheduled) {
    const selectedSlot = trialClassSlots.find(slot => slot.id === scheduledData?.selectedSlot);
    const country = COUNTRIES.find(c => c.code === scheduledData?.country);
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-center text-2xl font-semibold text-[var(--primary-green)]">
              ¡Clase de Prueba Programada!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-[var(--primary-green)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                ¡Perfecto, {scheduledData?.name}!
              </h3>
              <p className="text-[var(--text-secondary)]">
                Tu clase de prueba ha sido programada exitosamente
              </p>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-900">Fecha y Hora</p>
                    <p className="text-green-700">
                      {selectedSlot && format(new Date(selectedSlot.date), "d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-green-700">
                      {selectedSlot?.time} (México) • {convertToStudentTimezone(selectedSlot?.time || "")} ({country?.name})
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Duración</p>
                    <p className="text-green-700">30 minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3">
              <Button 
                onClick={async () => await generatePDF(scheduledData)}
                className="bg-[var(--secondary-blue)] hover:opacity-90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Invitación
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100">
            <Button 
              onClick={handleClose}
              className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-semibold text-[var(--primary-green)]">Programar Clase de Prueba Rápida</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Step 1: Información del Estudiante */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-[var(--primary-green)]" />
                  <h3 className="text-lg font-semibold">Información del Estudiante</h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="estudiante@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País de Origen</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const country = COUNTRIES.find(c => c.code === value);
                            setSelectedCountry(country);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nativeLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma Nativo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NATIVE_LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Selección de Horario */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-[var(--primary-green)]" />
                  <h3 className="text-lg font-semibold">Selecciona un horario disponible</h3>
                </div>

                <FormField
                  control={form.control}
                  name="selectedSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-3">
                          {trialClassSlots.map((slot) => (
                            <Card 
                              key={slot.id}
                              className={`cursor-pointer transition-all ${
                                !slot.available ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
                              } ${
                                field.value === slot.id 
                                  ? "border-[var(--primary-green)] bg-green-50" 
                                  : ""
                              }`}
                              onClick={() => {
                                if (slot.available) {
                                  field.onChange(slot.id);
                                }
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <Calendar className="h-5 w-5 text-[var(--secondary-blue)]" />
                                    <div>
                                      <p className="font-medium">
                                        {format(new Date(slot.date), "EEEE d 'de' MMMM", { locale: es })}
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>{slot.time} (México)</span>
                                        {selectedCountry && (
                                          <>
                                            <ChevronRight className="h-4 w-4" />
                                            <span className="font-medium">
                                              {convertToStudentTimezone(slot.time)} ({selectedCountry.name})
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {slot.available ? (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      Disponible
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-gray-400">
                                      No disponible
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-gray-100 flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Anterior
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-[var(--neutral-gray)] text-[var(--neutral-gray)] hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
              
              {currentStep === 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!form.watch("selectedSlot")}
                  className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white"
                >
                  Programar Clase de Prueba
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}