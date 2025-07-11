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
  TrendingUp,
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
      case "/calendar":
        return "Calendario";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)] patio-background">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] bg-white/80 backdrop-blur-sm px-8 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="text-[var(--primary-green)]">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.02c-1.89 0-3.62.66-4.95 1.76L12 8.64l4.95-4.86C15.62 2.68 13.89 2.02 12 2.02zM3.44 6.74c-1.3 1.5-2.02 3.48-2.02 5.57 0 4.14 2.87 7.7 6.58 8.61v-5.97H5.58V12h2.42V9.81c0-2.39 1.42-3.71 3.61-3.71h1.89v2.96h-1.4c-1.02 0-1.23.49-1.23 1.21V12h2.69l-.43 2.96h-2.26v5.97c3.71-.91 6.58-4.47 6.58-8.61 0-2.09-.72-4.07-2.02-5.57L12 12.36 3.44 6.74z"></path>
            </svg>
          </div>
          <h1 className="text-[var(--primary-green)] text-3xl font-bold leading-tight" style={{ fontFamily: 'Dancing Script, cursive' }}>El Patio de Mi Casa</h1>
        </div>
        
        <nav className="flex items-center gap-6 text-sm font-medium text-[var(--neutral-gray)]">
          <Link 
            to="/dashboard" 
            className={location.pathname === "/dashboard" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Dashboard
          </Link>
          <Link 
            to="/users" 
            className={location.pathname === "/users" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Usuarios
          </Link>
          <Link 
            to="/students" 
            className={location.pathname === "/students" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Alumnos
          </Link>
          <Link 
            to="/teachers" 
            className={location.pathname === "/teachers" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Profesores
          </Link>
          <Link 
            to="/calendar" 
            className={location.pathname === "/calendar" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Calendario
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell className="w-6 h-6 text-[var(--neutral-gray)]" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-orange)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-orange)]"></span>
            </span>
          </button>
          <Avatar className="size-10 border-2 border-[var(--primary-green)]">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}