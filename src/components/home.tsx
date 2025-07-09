import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import DashboardMetrics from "./Dashboard/DashboardMetrics";
import CalendarView from "./Calendar/CalendarView";
import UserManagement from "./Users/UserManagement";
import CreditSystem from "./Credits/CreditSystem";

export default function HomePage() {
  const location = useLocation();
  
  // Mock user data
  const user = {
    name: "María González",
    role: "Administrador",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
  };

  // Mock alerts
  const alerts = [
    {
      id: 1,
      message:
        "Conflicto de horario: Profesor Juan tiene 2 clases asignadas a las 15:00",
      type: "error",
    },
    {
      id: 2,
      message: "5 estudiantes con créditos por expirar esta semana",
      type: "warning",
    },
    {
      id: 3,
      message: "Nueva solicitud de cancelación pendiente de aprobación",
      type: "info",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">EP</span>
          </div>
          <h1 className="text-xl font-bold">El Patio</h1>
        </div>

        <nav className="flex-1">
          <div className="space-y-1">
            <Link to="/">
              <Button variant={location.pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start">
                <Home className="h-5 w-5" />
                <span>Inicio</span>
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Button>
            </Link>

            <Link to="/calendar">
              <Button variant={location.pathname === "/calendar" ? "secondary" : "ghost"} className="w-full justify-start">
                <Calendar className="h-5 w-5" />
                <span>Calendario</span>
              </Button>
            </Link>

            <Link to="/users">
              <Button variant={location.pathname === "/users" ? "secondary" : "ghost"} className="w-full justify-start">
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </Button>
            </Link>

            <Link to="/credits">
              <Button variant={location.pathname === "/credits" ? "secondary" : "ghost"} className="w-full justify-start">
                <CreditCard className="h-5 w-5" />
                <span>Créditos</span>
              </Button>
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            asChild
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span>Cerrar sesión</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>

              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Metrics */}
            <DashboardMetrics />

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-md border ${
                        alert.type === "error"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : alert.type === "warning"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}
                    >
                      {alert.message}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main tabs */}
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="calendar">Calendario</TabsTrigger>
                <TabsTrigger value="users">Usuarios</TabsTrigger>
                <TabsTrigger value="credits">Créditos</TabsTrigger>
                <TabsTrigger value="reports">Reportes</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="border rounded-md p-4">
                <CalendarView />
              </TabsContent>

              <TabsContent value="users" className="border rounded-md p-4">
                <UserManagement />
              </TabsContent>

              <TabsContent value="credits" className="border rounded-md p-4">
                <CreditSystem />
              </TabsContent>

              <TabsContent value="reports" className="border rounded-md p-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Módulo de Reportes</h3>
                  <p className="text-muted-foreground">
                    Esta sección está en desarrollo
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
