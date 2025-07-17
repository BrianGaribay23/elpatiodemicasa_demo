import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/modules/shared";
import QuickTrialClassDialog from "../components/QuickTrialClassDialog";
import { 
  CalendarDays, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Globe,
  RefreshCw,
  TrendingDown,
  DollarSign,
  UserPlus
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [isQuickTrialOpen, setIsQuickTrialOpen] = React.useState(false);
  // Mock data for today's schedule
  const todaySchedule = [
    {
      time: "9:00 AM",
      class: "Español Principiante",
      teacher: "Elena Ramirez",
      student: "Carlos Rodriguez",
      status: "scheduled",
    },
    {
      time: "10:00 AM",
      class: "Español Intermedio",
      teacher: "Miguel Torres",
      student: "Sofia Lopez",
      status: "confirmed",
    },
    {
      time: "11:00 AM",
      class: "Español Avanzado",
      teacher: "Isabella Garcia",
      student: "Juan Martinez",
      status: "completed",
    },
    {
      time: "12:00 PM",
      class: "Conversación",
      teacher: "Diego Fernandez",
      student: "Ana Perez",
      status: "conflict",
    },
    {
      time: "1:00 PM",
      class: "Español de Negocios",
      teacher: "Lucia Vargas",
      student: "Luis Gomez",
      status: "confirmed",
    },
  ];

  // Data from previous version
  const levelDistribution = [
    { level: "A1", students: 35, percentage: 22 },
    { level: "A2", students: 42, percentage: 27 },
    { level: "B1", students: 38, percentage: 24 },
    { level: "B2", students: 28, percentage: 18 },
    { level: "C1", students: 10, percentage: 6 },
    { level: "C2", students: 3, percentage: 2 },
  ];

  const countriesOfOrigin = [
    { country: "Estados Unidos", flag: "🇺🇸", students: 68, percentage: 44 },
    { country: "China", flag: "🇨🇳", students: 52, percentage: 33 },
    { country: "Brasil", flag: "🇧🇷", students: 12, percentage: 8 },
    { country: "Francia", flag: "🇫🇷", students: 10, percentage: 6 },
    { country: "Alemania", flag: "🇩🇪", students: 8, percentage: 5 },
    { country: "Otros", flag: "🌍", students: 6, percentage: 4 },
  ];

  const upcomingTrialClasses = [
    { id: 1, student: "Emma Wilson", country: "🇺🇸", date: "Hoy 14:00", level: "A1", teacher: "María González" },
    { id: 2, student: "Liu Wei", country: "🇨🇳", date: "Hoy 16:30", level: "A2", teacher: "Carlos Ruiz" },
    { id: 3, student: "Marie Dubois", country: "🇫🇷", date: "Mañana 10:00", level: "B1", teacher: "Ana Martín" },
    { id: 4, student: "Yuki Tanaka", country: "🇯🇵", date: "Mañana 15:00", level: "A1", teacher: "Sofia López" },
  ];

  const pendingRenewals = [
    { id: 1, student: "John Smith", country: "🇺🇸", daysLeft: 5, package: "Individual B2", value: "$450" },
    { id: 2, student: "Ana Silva", country: "🇧🇷", daysLeft: 8, package: "Grupal A2", value: "$280" },
    { id: 3, student: "Pierre Martin", country: "🇫🇷", daysLeft: 10, package: "Individual B1", value: "$420" },
  ];

  // Chart data
  const newStudentsData = [
    { month: "Jun", estudiantes: 8 },
    { month: "Jul", estudiantes: 10 },
    { month: "Ago", estudiantes: 6 },
    { month: "Sep", estudiantes: 15 },
    { month: "Oct", estudiantes: 12 },
    { month: "Nov", estudiantes: 14 },
  ];

  const cancelledClassesData = [
    { month: "Jun", canceladas: 12, porcentaje: 2.3 },
    { month: "Jul", canceladas: 10, porcentaje: 1.9 },
    { month: "Ago", canceladas: 15, porcentaje: 3.1 },
    { month: "Sep", canceladas: 8, porcentaje: 1.4 },
    { month: "Oct", canceladas: 6, porcentaje: 1.0 },
    { month: "Nov", canceladas: 5, porcentaje: 0.8 },
  ];

  const revenueData = [
    { month: "Jun", año2023: 32000, año2024: 38500 },
    { month: "Jul", año2023: 35000, año2024: 41200 },
    { month: "Ago", año2023: 33000, año2024: 35800 },
    { month: "Sep", año2023: 38000, año2024: 45600 },
    { month: "Oct", año2023: 37000, año2024: 43200 },
    { month: "Nov", año2023: 36000, año2024: 42350 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EAF0F6] text-[var(--secondary-blue)]">
            Programada
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EAF2ED] text-[var(--primary-green)]">
            Confirmada
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EDEDEE] text-[var(--neutral-gray)]">
            Completada
          </span>
        );
      case "conflict":
        return (
          <span className="relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FEF5EC] text-[var(--accent-orange)]">
            Conflicto
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-[var(--secondary-blue)] text-3xl font-bold leading-tight">Dashboard</h2>
          <p className="text-[var(--neutral-gray)] mt-1">Vista general de operaciones diarias y métricas clave.</p>
        </div>
        <div className="text-[var(--primary-green)] opacity-20">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 21v-3.75m16.5 3.75v-3.75m-16.5 0L12 3.75 20.25 17.25M3.75 17.25h16.5M12 21a9 9 0 00-9-9h18a9 9 0 00-9 9z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--primary-green)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Clases Hoy</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">24</p>
          <p className="text-sm text-[var(--text-secondary)]">16 individuales • 8 grupales</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--secondary-blue)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Estudiantes Activos</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">156</p>
          <p className="text-sm text-[var(--text-secondary)]">De 15 países</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--accent-orange)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Tasa de Asistencia</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">94%</p>
          <p className="text-sm text-[var(--text-secondary)]">Promedio semanal</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--neutral-gray)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Nuevos Estudiantes</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">12</p>
          <p className="text-sm text-[var(--text-secondary)]">Este mes</p>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="px-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
            Vista General
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Today's Schedule */}
          <div>
            <h3 className="text-[var(--secondary-blue)] text-2xl font-bold tracking-tight pb-4">Horario de Hoy</h3>
            <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--card-background)] shadow-md">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-[var(--border-color)]">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-gray)]">
                    <th className="px-6 py-4">Hora</th>
                    <th className="px-6 py-4">Clase</th>
                    <th className="px-6 py-4">Profesor</th>
                    <th className="px-6 py-4">Estudiante</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {todaySchedule.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`text-[var(--text-secondary)] hover:bg-gray-50 ${item.status === 'conflict' ? 'bg-orange-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                        {item.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                        {item.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.teacher}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Level Distribution */}
            <Card className="hover:shadow-lg transition-shadow border-[var(--border-color)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Distribución por Niveles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {levelDistribution.map((level) => (
                    <div key={level.level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{level.level}</span>
                        <span className="text-[var(--text-secondary)]">{level.students} estudiantes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[var(--primary-green)] h-2 rounded-full transition-all"
                          style={{ width: `${level.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Countries of Origin */}
            <Card className="hover:shadow-lg transition-shadow border-[var(--border-color)]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Países de Origen</CardTitle>
                  <Globe className="h-4 w-4 text-[var(--secondary-blue)]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countriesOfOrigin.slice(0, 5).map((country) => (
                    <div key={country.country} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-sm font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{country.students}</span>
                        <span className="text-xs text-[var(--text-secondary)] ml-1">({country.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trial Classes */}
            <Card className="hover:shadow-lg transition-shadow border-[var(--border-color)]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Próximas Clases Muestra</CardTitle>
                  <Badge className="bg-[var(--accent-orange)] text-white">{upcomingTrialClasses.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTrialClasses.slice(0, 3).map((trial) => (
                    <div key={trial.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{trial.country}</span>
                        <div>
                          <p className="font-medium">{trial.student}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{trial.level} • {trial.teacher}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-[var(--secondary-blue)] text-[var(--secondary-blue)]">
                        {trial.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Renewals */}
            <Card className="hover:shadow-lg transition-shadow border-[var(--border-color)]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Renovaciones Pendientes</CardTitle>
                  <RefreshCw className="h-4 w-4 text-[var(--primary-green)]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRenewals.map((renewal) => (
                    <div key={renewal.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{renewal.country}</span>
                          <span className="text-sm font-medium">{renewal.student}</span>
                        </div>
                        <Badge 
                          className={renewal.daysLeft < 7 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}
                        >
                          {renewal.daysLeft} días
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                        <span>{renewal.package}</span>
                        <span className="font-medium">{renewal.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Section */}
          <Card className="shadow-md border-[var(--border-color)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[var(--text-primary)]">Calendario de Clases</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarView />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Students Trend */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Estudiantes Nuevos - Últimos 6 Meses</CardTitle>
                  <Badge variant="outline" className="text-xs border-[var(--primary-green)] text-[var(--primary-green)]">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23% promedio
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={newStudentsData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E5984" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2E5984" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="estudiantes" 
                      stroke="#2E5984" 
                      fillOpacity={1} 
                      fill="url(#colorStudents)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cancelled Classes Trend */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Clases Canceladas - Últimos 6 Meses</CardTitle>
                  <Badge variant="outline" className="text-xs border-[var(--primary-green)] text-[var(--primary-green)]">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -15% promedio
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cancelledClassesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px"
                      }}
                      formatter={(value: any, name: any) => {
                        if (name === "porcentaje") return [`${value}%`, "Tasa de cancelación"];
                        return [value, name];
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="porcentaje" 
                      stroke="#F2994A" 
                      strokeWidth={2}
                      dot={{ fill: "#F2994A" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Comparison */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Comparación de Ingresos Mensuales</CardTitle>
                  <Badge variant="outline" className="text-xs border-[var(--primary-green)] text-[var(--primary-green)]">
                    <DollarSign className="h-3 w-3 mr-1" />
                    +18% YTD
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px"
                      }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="rect"
                    />
                    <Bar dataKey="año2023" fill="#54585A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="año2024" fill="#4A7C59" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats Summary */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Resumen de Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Mejor mes (estudiantes)</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">Septiembre</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">15 nuevos estudiantes</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Menor cancelación</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">Noviembre</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Solo 0.8% canceladas</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Mayor ingreso</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">$45,600</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Septiembre 2024</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Satisfacción promedio</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">4.8/5</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Basado en 150 reseñas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="text-[var(--secondary-blue)] text-2xl font-bold tracking-tight pb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--border-color)]"
            onClick={() => setIsQuickTrialOpen(true)}
          >
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-[#E8F5E8] rounded-lg">
                <UserPlus className="h-6 w-6 text-[var(--primary-green)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Clase de Prueba</h4>
                <p className="text-sm text-[var(--text-secondary)]">Programa clase rápida</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--border-color)]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-[#EAF2ED] rounded-lg">
                <CalendarDays className="h-6 w-6 text-[var(--primary-green)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Programar Clase</h4>
                <p className="text-sm text-[var(--text-secondary)]">Agendar nuevas sesiones</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--border-color)]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-[#EAF0F6] rounded-lg">
                <Users className="h-6 w-6 text-[var(--secondary-blue)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Agregar Estudiante</h4>
                <p className="text-sm text-[var(--text-secondary)]">Registrar nuevo alumno</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--border-color)]">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-[#FEF5EC] rounded-lg">
                <TrendingUp className="h-6 w-6 text-[var(--accent-orange)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Ver Reportes</h4>
                <p className="text-sm text-[var(--text-secondary)]">Análisis y estadísticas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Trial Class Dialog */}
      <QuickTrialClassDialog
        open={isQuickTrialOpen}
        onOpenChange={setIsQuickTrialOpen}
      />
    </div>
  );
}