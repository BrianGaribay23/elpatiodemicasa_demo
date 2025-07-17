import { Outlet, Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  LogOut,
  Settings,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoElPatio from "@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png";
import { useAuth } from "@/modules/auth";

export default function MainLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMINISTRADOR_GENERAL: "Administrador General",
      COORDINADOR_ACADEMICO: "Coordinador Académico",
      PROFESOR: "Profesor",
      ESTUDIANTE: "Estudiante"
    };
    return roleMap[role] || role;
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
      case "/finance":
        return "Finanzas";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)] patio-background">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] bg-white/80 backdrop-blur-sm px-8 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img 
            src={logoElPatio} 
            alt="El Patio de Mi Casa" 
            className="h-20 w-auto object-contain"
          />
          <h1 className="text-4xl font-bold leading-tight" style={{ color: '#5DB5BA', fontFamily: 'Bubblegum Sans, Kalam, Patrick Hand, cursive' }}>El Patio de Mi Casa</h1>
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
            to="/finance" 
            className={location.pathname === "/finance" ? "text-[var(--primary-green)] font-semibold border-b-2 border-[var(--primary-green)] pb-1" : "hover:text-[var(--primary-green)] transition-colors"}
          >
            Finanzas
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="size-10 border-2 border-[var(--primary-green)] cursor-pointer">
                  <AvatarImage 
                    src={user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` : ""} 
                    alt={user?.name || ""} 
                  />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user ? getRoleDisplayName(user.role) : ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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