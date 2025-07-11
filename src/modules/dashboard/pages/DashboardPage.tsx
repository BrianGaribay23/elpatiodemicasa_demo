import React from "react";
import DashboardMetrics from "../components/DashboardMetrics";
import { CalendarView } from "@/modules/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users,
  Globe,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  DollarSign,
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
  // Mock data for Spanish language school
  const levelDistribution = [
    { level: "A1", students: 35, percentage: 22, color: "bg-blue-500" },
    { level: "A2", students: 42, percentage: 27, color: "bg-green-500" },
    { level: "B1", students: 38, percentage: 24, color: "bg-yellow-500" },
    { level: "B2", students: 28, percentage: 18, color: "bg-orange-500" },
    { level: "C1", students: 10, percentage: 6, color: "bg-red-500" },
    { level: "C2", students: 3, percentage: 2, color: "bg-purple-500" },
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
    {
      id: 1,
      student: "Emma Wilson",
      country: "🇺🇸",
      date: "Hoy 14:00",
      level: "A1",
      teacher: "María González",
    },
    {
      id: 2,
      student: "Liu Wei",
      country: "🇨🇳",
      date: "Hoy 16:30",
      level: "A2",
      teacher: "Carlos Ruiz",
    },
    {
      id: 3,
      student: "Marie Dubois",
      country: "🇫🇷",
      date: "Mañana 10:00",
      level: "B1",
      teacher: "Ana Martín",
    },
    {
      id: 4,
      student: "Yuki Tanaka",
      country: "🇯🇵",
      date: "Mañana 15:00",
      level: "A1",
      teacher: "Sofia López",
    },
  ];

  const pendingRenewals = [
    {
      id: 1,
      student: "John Smith",
      country: "🇺🇸",
      expiryDate: "15 Nov",
      daysLeft: 5,
      package: "Individual B2",
      value: "$450",
    },
    {
      id: 2,
      student: "Ana Silva",
      country: "🇧🇷",
      expiryDate: "18 Nov",
      daysLeft: 8,
      package: "Grupal A2",
      value: "$280",
    },
    {
      id: 3,
      student: "Pierre Martin",
      country: "🇫🇷",
      expiryDate: "20 Nov",
      daysLeft: 10,
      package: "Individual B1",
      value: "$420",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      message: "James Brown (🇺🇸) se inscribió en Español A1",
      time: "Hace 30 min",
      type: "enrollment",
    },
    {
      id: 2,
      message: "Clase completada: Conversación B2 - 5 estudiantes",
      time: "Hace 1 hora",
      type: "class",
    },
    {
      id: 3,
      message: "Pago recibido: Marie Dubois (🇫🇷) - $450",
      time: "Hace 2 horas",
      type: "payment",
    },
    {
      id: 4,
      message: "Ana García aprobó el examen DELE B2",
      time: "Hace 3 horas",
      type: "achievement",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardMetrics />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Distribución por Niveles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {levelDistribution.map((level) => (
                <div key={level.level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{level.level}</span>
                    <span className="text-muted-foreground">
                      {level.students} estudiantes
                    </span>
                  </div>
                  <Progress value={level.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Countries of Origin */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Países de Origen</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {countriesOfOrigin.map((country) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{country.students}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({country.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trial Classes */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Próximas Clases Muestra</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {upcomingTrialClasses.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrialClasses.map((trial) => (
                <div
                  key={trial.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span>{trial.country}</span>
                    <div>
                      <p className="font-medium">{trial.student}</p>
                      <p className="text-xs text-muted-foreground">
                        {trial.level} • {trial.teacher}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {trial.date}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Renewals */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Renovaciones Pendientes</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
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
                      variant={renewal.daysLeft < 7 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {renewal.daysLeft} días
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{renewal.package}</span>
                    <span className="font-medium">{renewal.value}</span>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full mt-2">
                Ver todas las renovaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 pb-3 border-b last:border-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          activity.type === "enrollment"
                            ? "bg-green-500"
                            : activity.type === "class"
                            ? "bg-blue-500"
                            : activity.type === "payment"
                            ? "bg-purple-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Clases completadas hoy
                      </span>
                      <span className="font-medium">12/24</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Tasa de conversión
                      </span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Satisfacción promedio
                      </span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Retención mensual
                      </span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Ingresos del mes
                    </span>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-lg">$42,350</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">
                      +12% vs mes anterior
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Data for charts */}
          {(() => {
            const newStudentsData = [
              { month: "Jun", estudiantes: 8 },
              { month: "Jul", estudiantes: 10 },
              { month: "Ago", estudiantes: 6 },
              { month: "Sep", estudiantes: 15 },
              { month: "Oct", estudiantes: 12 },
              { month: "Nov", estudiantes: 14 },
            ];

            const cancelledClassesData = [
              { month: "Jun", canceladas: 12, total: 520, porcentaje: 2.3 },
              { month: "Jul", canceladas: 10, total: 540, porcentaje: 1.9 },
              { month: "Ago", canceladas: 15, total: 480, porcentaje: 3.1 },
              { month: "Sep", canceladas: 8, total: 560, porcentaje: 1.4 },
              { month: "Oct", canceladas: 6, total: 580, porcentaje: 1.0 },
              { month: "Nov", canceladas: 5, total: 600, porcentaje: 0.8 },
            ];

            const revenueData = [
              { month: "Jun", año2023: 32000, año2024: 38500 },
              { month: "Jul", año2023: 35000, año2024: 41200 },
              { month: "Ago", año2023: 33000, año2024: 35800 },
              { month: "Sep", año2023: 38000, año2024: 45600 },
              { month: "Oct", año2023: 37000, año2024: 43200 },
              { month: "Nov", año2023: 36000, año2024: 42350 },
            ];

            const attendanceData = [
              { month: "Jun", asistencia: 89, meta: 90 },
              { month: "Jul", asistencia: 91, meta: 90 },
              { month: "Ago", asistencia: 85, meta: 90 },
              { month: "Sep", asistencia: 93, meta: 90 },
              { month: "Oct", asistencia: 95, meta: 90 },
              { month: "Nov", asistencia: 94, meta: 90 },
            ];

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Students Trend */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Estudiantes Nuevos - Últimos 6 Meses</CardTitle>
                      <Badge variant="outline" className="text-xs">
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
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="estudiantes" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorStudents)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Cancelled Classes Trend */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Clases Canceladas - Últimos 6 Meses</CardTitle>
                      <Badge variant="outline" className="text-xs text-green-600">
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
                            backgroundColor: "hsl(var(--background))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                          formatter={(value, name) => {
                            if (name === "porcentaje") return [`${value}%`, "Tasa de cancelación"];
                            return [value, name];
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="porcentaje" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ fill: "#ef4444" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenue Comparison */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Comparación de Ingresos Mensuales</CardTitle>
                      <Badge variant="outline" className="text-xs text-green-600">
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
                            backgroundColor: "hsl(var(--background))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                          formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: "20px" }}
                          iconType="rect"
                        />
                        <Bar dataKey="año2023" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="año2024" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Attendance Rate Trend */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Tasa de Asistencia Mensual</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Promedio: 92%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" domain={[80, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                          formatter={(value) => [`${value}%`, ""]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="meta" 
                          stroke="#ef4444" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                          name="Meta (90%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="asistencia" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: "#10b981", r: 6 }}
                          name="Asistencia"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Mejor mes (estudiantes)</p>
                  <p className="text-2xl font-bold mt-1">Septiembre</p>
                  <p className="text-xs text-muted-foreground mt-1">15 nuevos estudiantes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Menor cancelación</p>
                  <p className="text-2xl font-bold mt-1">Noviembre</p>
                  <p className="text-xs text-muted-foreground mt-1">Solo 0.8% canceladas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Mayor ingreso</p>
                  <p className="text-2xl font-bold mt-1">$45,600</p>
                  <p className="text-xs text-muted-foreground mt-1">Septiembre 2024</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Crecimiento anual</p>
                  <p className="text-2xl font-bold mt-1">+18%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs año anterior</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Calendar Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Calendario de Clases</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
}