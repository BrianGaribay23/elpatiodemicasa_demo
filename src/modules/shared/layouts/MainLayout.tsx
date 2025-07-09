import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UserCheck,
} from "lucide-react";

export default function MainLayout() {
  const location = useLocation();
  
  // Mock user data
  const user = {
    name: "María González",
    role: "Administrador",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
  };

  // Get current page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/dashboard":
        return "Dashboard";
      case "/users":
        return "Usuarios";
      case "/students":
        return "Estudiantes";
      case "/teachers":
        return "Profesores";
      case "/academic":
        return "Gestión Académica";
      default:
        return "Dashboard";
    }
  };

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
            <Link to="/dashboard">
              <Button variant={location.pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </Button>
            </Link>

            <Link to="/users">
              <Button variant={location.pathname === "/users" ? "secondary" : "ghost"} className="w-full justify-start">
                <Users className="h-5 w-5 mr-3" />
                <span>Usuarios</span>
              </Button>
            </Link>

            <Link to="/students">
              <Button variant={location.pathname === "/students" ? "secondary" : "ghost"} className="w-full justify-start">
                <GraduationCap className="h-5 w-5 mr-3" />
                <span>Estudiantes</span>
              </Button>
            </Link>

            <Link to="/teachers">
              <Button variant={location.pathname === "/teachers" ? "secondary" : "ghost"} className="w-full justify-start">
                <UserCheck className="h-5 w-5 mr-3" />
                <span>Profesores</span>
              </Button>
            </Link>

            <Link to="/academic">
              <Button variant={location.pathname === "/academic" ? "secondary" : "ghost"} className="w-full justify-start">
                <BookOpen className="h-5 w-5 mr-3" />
                <span>Gestión Académica</span>
              </Button>
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5 mr-3" />
            <span>Configuración</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">{getPageTitle()}</h2>

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
          <Outlet />
        </main>
      </div>
    </div>
  );
}