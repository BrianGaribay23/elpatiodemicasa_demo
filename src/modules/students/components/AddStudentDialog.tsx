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
  FormDescription,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Globe, 
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  CalendarDays,
  Target,
  Languages
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import logoElPatio from "@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png";

// Países comunes
const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "Estados Unidos", timezone: "America/New_York" },
  { code: "CN", flag: "🇨🇳", name: "China", timezone: "Asia/Shanghai" },
  { code: "BR", flag: "🇧🇷", name: "Brasil", timezone: "America/Sao_Paulo" },
  { code: "FR", flag: "🇫🇷", name: "Francia", timezone: "Europe/Paris" },
  { code: "DE", flag: "🇩🇪", name: "Alemania", timezone: "Europe/Berlin" },
  { code: "JP", flag: "🇯🇵", name: "Japón", timezone: "Asia/Tokyo" },
  { code: "GB", flag: "🇬🇧", name: "Reino Unido", timezone: "Europe/London" },
  { code: "IT", flag: "🇮🇹", name: "Italia", timezone: "Europe/Rome" },
  { code: "CA", flag: "🇨🇦", name: "Canadá", timezone: "America/Toronto" },
  { code: "AU", flag: "🇦🇺", name: "Australia", timezone: "Australia/Sydney" },
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
const studentFormSchema = z.object({
  // Step 1: Personal Info
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
  country: z.string().min(1, "Selecciona un país"),
  nativeLanguage: z.string().min(1, "Selecciona tu idioma nativo"),
  
  // Step 2: Level Assignment
  assignedLevel: z.string().min(1, "Selecciona un nivel"),
  selectedGroup: z.string().optional(),
  classType: z.enum(["group", "individual"]).default("group"),
  // Individual class fields
  preferredSchedule: z.string().optional(),
  preferredTeacher: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

// Mock data de candidatos de clase de prueba
const trialClassCandidates = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 555 123 4567",
    country: "US",
    nativeLanguage: "Inglés",
    trialDate: "2025-01-17",
    evaluatedLevel: "B1",
    status: "evaluated"
  },
  {
    id: 2,
    name: "Liu Wei",
    email: "liu.wei@email.com",
    phone: "+86 138 0000 0000",
    country: "CN",
    nativeLanguage: "Mandarín",
    trialDate: "2025-01-16",
    evaluatedLevel: "A2",
    status: "evaluated"
  },
  {
    id: 3,
    name: "Pierre Dubois",
    email: "pierre.dubois@email.com",
    phone: "+33 1 23 45 67 89",
    country: "FR",
    nativeLanguage: "Francés",
    trialDate: "2025-01-15",
    evaluatedLevel: "B2",
    status: "evaluated"
  }
];

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentFormData) => void;
  groups: any[]; // Grupos disponibles
}

export default function AddStudentDialog({
  open,
  onOpenChange,
  onSubmit,
  groups,
}: AddStudentDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      nativeLanguage: "",
      assignedLevel: "",
      selectedGroup: "",
      classType: "group" as const,
      preferredSchedule: "",
      preferredTeacher: "",
    },
  });


  // Filtrar grupos disponibles según el nivel
  const getAvailableGroups = () => {
    const level = selectedCandidate?.evaluatedLevel || form.watch("assignedLevel");
    if (!level) return [];
    return groups.filter(group => 
      group.level === level && 
      group.students < 4 // Máximo 4 estudiantes por grupo
    );
  };

  // Niveles disponibles para asignación manual
  const availableLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // Profesores disponibles para clases individuales
  const availableTeachers = [
    { id: "1", name: "María González", specialties: ["A1", "A2", "B1"], experience: "5 años" },
    { id: "2", name: "Carlos Ruiz", specialties: ["A2", "B1", "B2"], experience: "3 años" },
    { id: "3", name: "Ana Martín", specialties: ["B1", "B2", "C1"], experience: "7 años" },
    { id: "4", name: "Sofia López", specialties: ["B2", "C1", "C2"], experience: "6 años" },
    { id: "5", name: "Diego Fernandez", specialties: ["A1", "A2", "B1", "B2"], experience: "4 años" },
  ];

  // Horarios disponibles para clases individuales
  const individualScheduleOptions = [
    "Lunes 9:00-10:30", "Lunes 14:00-15:30", "Lunes 16:00-17:30", "Lunes 18:00-19:30",
    "Martes 9:00-10:30", "Martes 14:00-15:30", "Martes 16:00-17:30", "Martes 18:00-19:30",
    "Miércoles 9:00-10:30", "Miércoles 14:00-15:30", "Miércoles 16:00-17:30", "Miércoles 18:00-19:30",
    "Jueves 9:00-10:30", "Jueves 14:00-15:30", "Jueves 16:00-17:30", "Jueves 18:00-19:30",
    "Viernes 9:00-10:30", "Viernes 14:00-15:30", "Viernes 16:00-17:30", "Viernes 18:00-19:30",
    "Sábado 9:00-10:30", "Sábado 11:00-12:30", "Sábado 14:00-15:30", "Sábado 16:00-17:30"
  ];

  // Filtrar profesores por nivel seleccionado
  const getAvailableTeachers = () => {
    const level = selectedCandidate?.evaluatedLevel || form.watch("assignedLevel");
    if (!level) return availableTeachers;
    return availableTeachers.filter(teacher => teacher.specialties.includes(level));
  };

  // Función para generar PDF de inscripción
  const generateEnrollmentPDF = async (data: StudentFormData) => {
    const selectedGroup = data.classType === "group" ? groups.find(group => group.id.toString() === data.selectedGroup) : null;
    const selectedTeacher = data.classType === "individual" ? availableTeachers.find(teacher => teacher.id === data.preferredTeacher) : null;
    
    if (data.classType === "group" && !selectedGroup) return;
    if (data.classType === "individual" && !selectedTeacher) return;

    const doc = new jsPDF();
    
    // Configuración de colores
    const primaryGreen = [74, 124, 89]; // #4A7C59
    const secondaryBlue = [46, 89, 132]; // #2E5984
    const lightBackground = [253, 251, 248]; // #FDFBF8

    // Header con fondo
    doc.setFillColor(...lightBackground);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Cargar logo como imagen
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
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

    // Título de confirmación
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("¡Bienvenido a nuestro programa!", 20, 70);

    // Mensaje de bienvenida
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const welcomeText = `¡Hola ${data.name}! Te damos la bienvenida a El Patio de Mi Casa.`;
    doc.text(welcomeText, 20, 85);
    
    const infoText = data.classType === "group" 
      ? "Has sido inscrito exitosamente en el siguiente grupo:"
      : "Has sido inscrito exitosamente en clases individuales:";
    doc.text(infoText, 20, 95);

    // Sección de información del estudiante
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(20, 110, 170, 35, 5, 5, 'F');
    
    doc.setTextColor(...secondaryBlue);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Estudiante", 25, 125);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${data.name}`, 25, 135);
    doc.text(`Email: ${data.email}`, 25, 142);
    
    const country = COUNTRIES.find(c => c.code === data.country);
    doc.text(`País: ${country?.name || data.country}`, 100, 135);
    doc.text(`Nivel: ${data.assignedLevel}`, 100, 142);

    // Sección de información del grupo o clase individual
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(20, 155, 170, 50, 5, 5, 'F');
    
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.classType === "group" ? "Información de tu Grupo" : "Información de tu Clase Individual", 25, 170);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    if (data.classType === "group" && selectedGroup) {
      doc.text(`Grupo: ${selectedGroup.name}`, 25, 185);
      doc.text(`Profesor: ${selectedGroup.teacher}`, 25, 192);
      doc.text(`Horario: ${selectedGroup.schedule}`, 25, 199);
      doc.text(`Modalidad: ${selectedGroup.location}`, 100, 185);
      doc.text(`Próxima clase: ${selectedGroup.nextClass}`, 100, 192);
    } else if (data.classType === "individual" && selectedTeacher) {
      doc.text(`Profesor: ${selectedTeacher.name}`, 25, 185);
      doc.text(`Experiencia: ${selectedTeacher.experience}`, 25, 192);
      doc.text(`Horario: ${data.preferredSchedule}`, 25, 199);
      doc.text(`Modalidad: Clase Individual`, 100, 185);
      doc.text(`Nivel: ${data.assignedLevel}`, 100, 192);
    }

    // Nueva página para el reglamento
    doc.addPage();
    doc.setFillColor(...lightBackground);
    doc.rect(0, 0, 210, 297, 'F');

    // Header de segunda página
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reglamento básico para el aula virtual", 20, 30);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const rules = [
      {
        title: "1. Llega a tiempo",
        english: "Be on time to class.",
        chinese: "准时上课",
        description: "Conéctate 5 minutos antes para estar listo."
      },
      {
        title: "2. Ten tu cámara encendida",
        english: "Keep your camera on unless the teacher says otherwise.",
        chinese: "除非老师说可以关闭，请保持摄像头开启",
        description: "Así el maestro sabe que estás atento y presente."
      },
      {
        title: "3. Silencia tu micrófono cuando no hables",
        english: "Mute your microphone when you're not speaking.",
        chinese: "不说话时请静音",
        description: "Para que todos puedan escuchar bien."
      },
      {
        title: "4. Sé amable y respetuoso con todos",
        english: "Be kind and respectful to classmates and teachers.",
        chinese: "对老师和同学要友善有礼貌",
        description: "No se burlen, no interrumpan."
      },
      {
        title: "5. Levanta la mano para hablar",
        english: "Raise your hand (or use the button) to speak.",
        chinese: "需要发言时请举手或点击举手按钮",
        description: "Así hablamos uno a la vez."
      },
      {
        title: "6. Usa el chat con respeto",
        english: "Use the chat only for class questions.",
        chinese: "聊天框仅用于课堂问题",
        description: "No spam, emojis en exceso, ni bromas privadas."
      },
      {
        title: "7. Ten tus materiales listos",
        english: "Have your notebook, pencil and materials ready.",
        chinese: "准备好本子、铅笔和其他学习用品",
        description: "Para que aproveches la clase al máximo."
      },
      {
        title: "8. No comas durante la clase",
        english: "Please don't eat during class.",
        chinese: "上课时请不要吃东西",
        description: "Salvo que el maestro lo permita."
      },
      {
        title: "9. Si te desconectas, vuelve lo antes posible",
        english: "If you get disconnected, rejoin as soon as possible.",
        chinese: "掉线后请尽快重新进入教室",
        description: "Todos tenemos problemas técnicos a veces."
      },
      {
        title: "10. ¡Diviértete aprendiendo!",
        english: "Have fun and enjoy learning!",
        chinese: "开心学习，享受课堂",
        description: "¡La clase también es para disfrutar!"
      }
    ];

    let yPosition = 50;
    rules.forEach((rule, index) => {
      if (yPosition > 250) {
        doc.addPage();
        doc.setFillColor(...lightBackground);
        doc.rect(0, 0, 210, 297, 'F');
        yPosition = 30;
      }
      
      // Título de la regla
      doc.setTextColor(...secondaryBlue);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(rule.title, 20, yPosition);
      yPosition += 8;
      
      // Traducción en inglés
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(rule.english, 25, yPosition);
      yPosition += 6;
      
      // Traducción en chino
      doc.text(`中文: ${rule.chinese}`, 25, yPosition);
      yPosition += 6;
      
      // Descripción
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(rule.description, 25, yPosition);
      yPosition += 12;
    });

    // Footer con información de contacto
    if (yPosition > 220) {
      doc.addPage();
      doc.setFillColor(...lightBackground);
      doc.rect(0, 0, 210, 297, 'F');
      yPosition = 30;
    }

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("¿Preguntas? Contáctanos:", 20, yPosition + 20);
    doc.text("📧 info@elpatiodemicasa.com", 25, yPosition + 30);
    doc.text("📱 +52 555 123 4567", 25, yPosition + 40);
    doc.text("🌐 www.elpatiodemicasa.com", 25, yPosition + 50);
    
    doc.setTextColor(...primaryGreen);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("¡Te esperamos con mucho gusto!", 20, yPosition + 70);

    // Decoración inferior
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(1);
    doc.line(20, yPosition + 90, 190, yPosition + 90);

    // Nota final
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Generado automáticamente - El Patio de Mi Casa © 2025", 20, yPosition + 110);

    // Guardar PDF
    const fileName = data.classType === "group" && selectedGroup
      ? `inscripcion-${data.name.replace(/\s+/g, '-').toLowerCase()}-${selectedGroup.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
      : `inscripcion-${data.name.replace(/\s+/g, '-').toLowerCase()}-clase-individual.pdf`;
    doc.save(fileName);
  };

  const handleNext = async () => {
    const fields = ["name", "email", "phone", "country", "nativeLanguage"] as const;
    const isValid = await form.trigger(fields);
    
    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate);
    form.setValue("name", candidate.name);
    form.setValue("email", candidate.email);
    form.setValue("phone", candidate.phone);
    form.setValue("country", candidate.country);
    form.setValue("nativeLanguage", candidate.nativeLanguage);
    form.setValue("assignedLevel", candidate.evaluatedLevel);
    const country = COUNTRIES.find(c => c.code === candidate.country);
    setSelectedCountry(country);
  };

  const handleSubmit = async (data: StudentFormData) => {
    onSubmit(data);
    
    // Generar PDF de inscripción automáticamente
    setTimeout(async () => {
      await generateEnrollmentPDF(data);
    }, 500);
    
    form.reset();
    setCurrentStep(1);
    setSelectedCandidate(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-semibold text-[var(--primary-green)]">Agregar Nuevo Estudiante</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? "bg-[var(--primary-green)] text-white" : "bg-gray-200"
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              currentStep >= 2 ? "bg-[var(--primary-green)]" : "bg-gray-200"
            }`} />
          </div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? "bg-[var(--primary-green)] text-white" : "bg-gray-200"
            }`}>
              2
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Step 1: Selección de Candidato o Nuevo */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-[var(--primary-green)]" />
                  <h3 className="text-lg font-semibold">Agregar Estudiante</h3>
                </div>

                {/* Candidatos de Clase de Prueba */}
                {trialClassCandidates.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[var(--primary-green)]" />
                      <h4 className="font-medium">Candidatos de Clase de Prueba</h4>
                    </div>
                    <div className="grid gap-3">
                      {trialClassCandidates.map((candidate) => {
                        const country = COUNTRIES.find(c => c.code === candidate.country);
                        return (
                          <Card 
                            key={candidate.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedCandidate?.id === candidate.id
                                ? "border-[var(--primary-green)] bg-green-50"
                                : ""
                            }`}
                            onClick={() => handleCandidateSelect(candidate)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{country?.flag}</span>
                                  <div>
                                    <p className="font-medium text-[var(--text-primary)]">{candidate.name}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{candidate.email}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-[var(--secondary-blue)] text-white">
                                    Nivel {candidate.evaluatedLevel}
                                  </Badge>
                                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Clase: {format(new Date(candidate.trialDate), "d MMM", { locale: es })}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center gap-2 my-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-[var(--text-secondary)]">O agrega un nuevo estudiante</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                  </div>
                )}

                {/* Formulario de Información Personal */}

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

            {/* Step 2: Asignación de Nivel y Grupo */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-[var(--primary-green)]" />
                  <h3 className="text-lg font-semibold">Asignación de Nivel y Grupo</h3>
                </div>
                
                {/* Instrucción clara */}
                {!form.watch("assignedLevel") && !selectedCandidate && (
                  <Card className="bg-blue-50 border-blue-200 mb-4">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <p className="text-sm text-blue-800">
                          Primero selecciona el nivel de español del estudiante para ver los grupos disponibles
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Asignación de Nivel */}
                {!selectedCandidate && (
                  <FormField
                    control={form.control}
                    name="assignedLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de Español</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el nivel del estudiante" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                Nivel {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Asignación de Nivel para Candidatos */}
                {selectedCandidate && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Candidato de Clase de Prueba</p>
                          <p className="text-sm text-blue-700">Nivel sugerido: {selectedCandidate.evaluatedLevel}</p>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="assignedLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirma o ajusta el nivel</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona el nivel final" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    <div className="flex items-center gap-2">
                                      <span>Nivel {level}</span>
                                      {level === selectedCandidate.evaluatedLevel && (
                                        <Badge variant="outline" className="text-xs">Sugerido</Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Puedes ajustar el nivel basado en la evaluación de la clase de prueba
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Selección de Grupo - Solo se muestra cuando hay un nivel seleccionado */}
                {(form.watch("assignedLevel") || selectedCandidate?.evaluatedLevel) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[var(--primary-green)]" />
                        <Label className="text-lg font-medium">
                          Grupos disponibles para nivel {form.watch("assignedLevel") || selectedCandidate?.evaluatedLevel}
                        </Label>
                      </div>
                      {form.watch("classType") === "individual" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.setValue("classType", "group");
                            form.setValue("preferredTeacher", "");
                            form.setValue("preferredSchedule", "");
                          }}
                          className="text-[var(--primary-green)] border-[var(--primary-green)]"
                        >
                          Ver Grupos
                        </Button>
                      )}
                    </div>
                    
                    {getAvailableGroups().length > 0 && form.watch("classType") === "group" ? (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="selectedGroup"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  {getAvailableGroups().map((group) => (
                                    <Card 
                                      key={group.id}
                                      className={`cursor-pointer transition-all hover:shadow-md ${
                                        field.value === group.id.toString()
                                          ? "border-[var(--primary-green)] bg-green-50"
                                          : ""
                                      }`}
                                    >
                                      <CardContent className="p-4">
                                        <Label
                                          htmlFor={`group-${group.id}`}
                                          className="flex items-start gap-4 cursor-pointer"
                                        >
                                          <RadioGroupItem value={group.id.toString()} id={`group-${group.id}`} />
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                              <h4 className="font-semibold text-[var(--text-primary)]">{group.name}</h4>
                                              <div className="flex items-center gap-2">
                                                <Badge className="bg-[var(--secondary-blue)] text-white">
                                                  {group.students}/4 estudiantes
                                                </Badge>
                                                {group.students >= 4 && (
                                                  <Badge variant="destructive" className="text-xs">Lleno</Badge>
                                                )}
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                              <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span>Prof. {group.teacher}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium text-[var(--primary-green)]">{group.schedule}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                <span>{group.location}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Languages className="h-4 w-4 text-gray-500" />
                                                <span>{group.description}</span>
                                              </div>
                                            </div>
                                            
                                            {/* Información adicional del grupo */}
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                              <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                  <span className="text-gray-600">Asistencia promedio:</span>
                                                  <span className="ml-2 font-medium">{group.avgAttendance}%</span>
                                                </div>
                                                <div>
                                                  <span className="text-gray-600">Próxima clase:</span>
                                                  <span className="ml-2 font-medium">{group.nextClass}</span>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {selectedCountry && (
                                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                                <span className="text-blue-700">
                                                  📍 Horario en tu zona: {group.schedule}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </Label>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-blue-900">¿Prefieres clase individual?</p>
                                  <p className="text-sm text-blue-700">Atención 100% personalizada</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  form.setValue("classType", "individual");
                                  form.setValue("selectedGroup", "");
                                }}
                                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                              >
                                Elegir Individual
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : getAvailableGroups().length > 0 && form.watch("classType") === "individual" ? (
                      <div className="space-y-4">
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                              <User className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium text-green-900">Clase Individual Seleccionada</p>
                                <p className="text-sm text-green-700">Puedes cambiar a grupos si prefieres</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Selección de Profesor */}
                              <FormField
                                control={form.control}
                                name="preferredTeacher"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Selecciona tu profesor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Elige un profesor especializado" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {getAvailableTeachers().map((teacher) => (
                                          <SelectItem key={teacher.id} value={teacher.id}>
                                            <div className="flex flex-col">
                                              <span className="font-medium">{teacher.name}</span>
                                              <span className="text-xs text-gray-500">
                                                {teacher.experience} • Especialista en: {teacher.specialties.join(", ")}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {/* Selección de Horario */}
                              <FormField
                                control={form.control}
                                name="preferredSchedule"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Horario preferido</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona tu horario preferido" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {individualScheduleOptions.map((schedule, index) => (
                                          <SelectItem key={index} value={schedule}>
                                            {schedule}
                                            {selectedCountry && (
                                              <span className="text-xs text-gray-500 ml-2">
                                                (Tu zona: {schedule})
                                              </span>
                                            )}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Card className="bg-yellow-50 border-yellow-200">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-yellow-900">
                                  No hay grupos disponibles para el nivel {form.watch("assignedLevel") || selectedCandidate?.evaluatedLevel}
                                </p>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Todos los grupos están llenos actualmente, pero puedes optar por clases individuales.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Opción de Clase Individual */}
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                              <User className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-blue-900">Opción: Clase Individual</p>
                                <p className="text-sm text-blue-700">Atención personalizada con profesor dedicado</p>
                              </div>
                            </div>
                            
                            <Button
                              type="button"
                              onClick={() => {
                                form.setValue("classType", "individual");
                                form.setValue("selectedGroup", "");
                              }}
                              className={`w-full mb-4 ${
                                form.watch("classType") === "individual"
                                  ? "bg-[var(--primary-green)] text-white"
                                  : "bg-white border border-blue-300 text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {form.watch("classType") === "individual" ? "✓ Clase Individual Seleccionada" : "Seleccionar Clase Individual"}
                            </Button>
                            
                            {form.watch("classType") === "individual" && (
                              <div className="space-y-4 pt-4 border-t border-blue-200">
                                {/* Selección de Profesor */}
                                <FormField
                                  control={form.control}
                                  name="preferredTeacher"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Selecciona tu profesor</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Elige un profesor especializado" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {getAvailableTeachers().map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                              <div className="flex flex-col">
                                                <span className="font-medium">{teacher.name}</span>
                                                <span className="text-xs text-gray-500">
                                                  {teacher.experience} • Especialista en: {teacher.specialties.join(", ")}
                                                </span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                {/* Selección de Horario */}
                                <FormField
                                  control={form.control}
                                  name="preferredSchedule"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Horario preferido</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tu horario preferido" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {individualScheduleOptions.map((schedule, index) => (
                                            <SelectItem key={index} value={schedule}>
                                              {schedule}
                                              {selectedCountry && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                  (Tu zona: {schedule})
                                                </span>
                                              )}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                {/* Información adicional de clase individual */}
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <h4 className="font-medium text-green-800 mb-2">Beneficios de la clase individual:</h4>
                                  <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Atención 100% personalizada</li>
                                    <li>• Ritmo de aprendizaje adaptado a ti</li>
                                    <li>• Horarios flexibles</li>
                                    <li>• Enfoque en tus objetivos específicos</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            <DialogFooter className="pt-4 border-t border-gray-100 flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={false}
                  >
                    Anterior
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-[var(--neutral-gray)] text-[var(--neutral-gray)] hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
              
              {currentStep < 2 ? (
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
                  disabled={
                    !form.watch("assignedLevel") || (
                      form.watch("classType") === "group" 
                        ? (!form.watch("selectedGroup") && getAvailableGroups().length > 0)
                        : form.watch("classType") === "individual" && (!form.watch("preferredTeacher") || !form.watch("preferredSchedule"))
                    )
                  }
                  className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white"
                >
                  Agregar Estudiante
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}