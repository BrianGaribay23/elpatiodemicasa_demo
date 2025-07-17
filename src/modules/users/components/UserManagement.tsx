import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCog,
  Mail,
  Phone,
  AlertCircle,
  Shield,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users2,
  Activity,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

type UserRole = "ADMINISTRADOR_GENERAL" | "COORDINADOR_ACADEMICO" | "PROFESOR" | "ESTUDIANTE";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "active" | "inactive";
  joinDate: string;
  lastLogin?: string;
  // Campos específicos según rol
  credits?: number; // Para estudiantes
  level?: string; // Para estudiantes
  group?: string; // Para estudiantes
  specialties?: string[]; // Para profesores
  availability?: string; // Para profesores
  activeClasses?: number; // Para profesores
  permissions?: string[]; // Para administradores
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Datos de todos los usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Ricardo Martínez",
      email: "ricardo@elpatiodemicasa.com",
      phone: "+52 555 123 4567",
      role: "ADMINISTRADOR_GENERAL",
      status: "active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-10",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Carmen Villegas",
      email: "carmen@elpatiodemicasa.com",
      phone: "+52 555 234 5678",
      role: "COORDINADOR_ACADEMICO",
      status: "active",
      joinDate: "2023-02-20",
      lastLogin: "2024-01-10",
    },
    {
      id: "3",
      name: "Patricia Mendoza",
      email: "patricia@elpatiodemicasa.com",
      phone: "+52 555 345 6789",
      role: "COORDINADOR_ACADEMICO",
      status: "active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-09",
    },
    {
      id: "4",
      name: "María González",
      email: "maria@elpatiodemicasa.com",
      phone: "+52 555 345 6789",
      role: "PROFESOR",
      status: "active",
      joinDate: "2023-03-10",
      lastLogin: "2024-01-09",
      specialties: ["Conversación", "Gramática"],
      availability: "Mañana",
      activeClasses: 8,
    },
    {
      id: "5",
      name: "Juan Pérez",
      email: "juan@elpatiodemicasa.com",
      phone: "+52 555 456 7890",
      role: "PROFESOR",
      status: "active",
      joinDate: "2023-03-15",
      lastLogin: "2024-01-08",
      specialties: ["Español de Negocios", "Literatura"],
      availability: "Tarde",
      activeClasses: 5,
    },
    {
      id: "6",
      name: "Ana García",
      email: "ana@example.com",
      phone: "+52 555 567 8901",
      role: "ESTUDIANTE",
      status: "active",
      joinDate: "2023-06-01",
      lastLogin: "2024-01-10",
      level: "Intermedio",
      credits: 10,
      group: "Grupo A",
    },
    {
      id: "7",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "+52 555 678 9012",
      role: "ESTUDIANTE",
      status: "active",
      joinDate: "2023-07-15",
      lastLogin: "2024-01-09",
      level: "Principiante",
      credits: 5,
      group: "Grupo B",
    },
    {
      id: "8",
      name: "Fernando Ruiz",
      email: "fernando@elpatiodemicasa.com",
      phone: "+52 555 456 7890",
      role: "COORDINADOR_ACADEMICO",
      status: "inactive",
      joinDate: "2023-03-10",
      lastLogin: "2023-12-15",
    },
  ]);

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      ADMINISTRADOR_GENERAL: {
        label: "Administrador General",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: Shield,
      },
      COORDINADOR_ACADEMICO: {
        label: "Coordinador Académico",
        className: "bg-purple-100 text-purple-800 border-purple-200",
        icon: UserCog,
      },
      PROFESOR: {
        label: "Profesor",
        className: "bg-azul-confianza-100 text-azul-confianza-800 border-azul-confianza-200",
        icon: BookOpen,
      },
      ESTUDIANTE: {
        label: "Estudiante",
        className: "bg-verde-casa-100 text-verde-casa-800 border-verde-casa-200",
        icon: GraduationCap,
      },
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: "active" | "inactive") => {
    return status === "active" ? (
      <Badge className="bg-verde-casa-100 text-verde-casa-800 hover:bg-verde-casa-200">
        Activo
      </Badge>
    ) : (
      <Badge className="bg-gris-corporativo-100 text-gris-corporativo-800 hover:bg-gris-corporativo-200">
        Inactivo
      </Badge>
    );
  };

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Contar usuarios por rol
  const userCounts = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMINISTRADOR_GENERAL").length,
    coordinators: users.filter(u => u.role === "COORDINADOR_ACADEMICO").length,
    teachers: users.filter(u => u.role === "PROFESOR" && u.status === "active").length,
    students: users.filter(u => u.role === "ESTUDIANTE" && u.status === "active").length,
  };

  // Datos para el gráfico de distribución por roles
  const roleDistributionData = [
    { 
      name: "Administradores", 
      value: users.filter(u => u.role === "ADMINISTRADOR_GENERAL").length,
      color: "#DC2626" // Red
    },
    { 
      name: "Coordinadores", 
      value: users.filter(u => u.role === "COORDINADOR_ACADEMICO").length,
      color: "#7C3AED" // Purple
    },
    { 
      name: "Profesores", 
      value: users.filter(u => u.role === "PROFESOR").length,
      color: "#2E5984" // Blue
    },
    { 
      name: "Estudiantes", 
      value: users.filter(u => u.role === "ESTUDIANTE").length,
      color: "#4A7C59" // Green
    },
  ];

  // Datos para el gráfico de tendencias de actividad (últimos 7 días)
  const activityTrendsData = [
    { date: "Lun", activos: 145, nuevos: 3, inactivos: 11 },
    { date: "Mar", activos: 148, nuevos: 5, inactivos: 10 },
    { date: "Mie", activos: 142, nuevos: 2, inactivos: 14 },
    { date: "Jue", activos: 150, nuevos: 8, inactivos: 6 },
    { date: "Vie", activos: 155, nuevos: 6, inactivos: 1 },
    { date: "Sáb", activos: 134, nuevos: 1, inactivos: 22 },
    { date: "Dom", activos: 128, nuevos: 0, inactivos: 28 },
  ];

  // Custom label para el pie chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleAddCoordinator = () => {
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    // Solo se pueden editar coordinadores
    if (user.role === "COORDINADOR_ACADEMICO") {
      setEditingUser(user);
      setShowUserDialog(true);
    }
  };

  const handleDeleteUser = (user: User) => {
    // Solo se pueden eliminar coordinadores
    if (user.role === "COORDINADOR_ACADEMICO") {
      setDeletingUser(user);
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (deletingUser) {
      setUsers(users.filter(u => u.id !== deletingUser.id));
      setShowDeleteDialog(false);
      setDeletingUser(null);
    }
  };

  const handleSaveCoordinator = (formData: any) => {
    if (editingUser) {
      // Actualizar coordinador existente
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      // Crear nuevo coordinador
      const newCoordinator: User = {
        id: (users.length + 1).toString(),
        role: "COORDINADOR_ACADEMICO",
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newCoordinator]);
    }
    setShowUserDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--accent-orange)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Administradores</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">{userCounts.admins}</p>
          <p className="text-sm text-[var(--text-secondary)]">Acceso total</p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--secondary-blue)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Coordinadores</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">{userCounts.coordinators}</p>
          <p className="text-sm text-[var(--text-secondary)]">Gestión académica</p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--primary-green)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Profesores Activos</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">{userCounts.teachers}</p>
          <p className="text-sm text-[var(--text-secondary)]">Impartiendo clases</p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-[var(--card-background)] shadow-md border-l-4 border-[var(--neutral-gray)]">
          <p className="text-[var(--neutral-gray)] text-base font-medium">Estudiantes Activos</p>
          <p className="text-[var(--text-primary)] text-4xl font-bold">{userCounts.students}</p>
          <p className="text-sm text-[var(--text-secondary)]">En formación</p>
        </div>
      </div>

      {/* Tabs para Gestión y Analíticas */}
      <Tabs defaultValue="management" className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="management" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
            <Users2 className="h-4 w-4 mr-2" />
            Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[var(--primary-green)]">
            <Activity className="h-4 w-4 mr-2" />
            Analíticas
          </TabsTrigger>
        </TabsList>

        {/* Tab de Gestión */}
        <TabsContent value="management" className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--card-background)] shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[var(--secondary-blue)] text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
                <Button onClick={handleAddCoordinator} className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)] hover:opacity-90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Coordinador
                </Button>
              </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gris-corporativo-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              className="pl-10 border-gris-corporativo-300 focus:border-azul-confianza focus:ring-azul-confianza"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | "all")}>
            <SelectTrigger className="w-[200px] border-gris-corporativo-300 focus:border-azul-confianza focus:ring-azul-confianza">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="ADMINISTRADOR_GENERAL">Administrador General</SelectItem>
              <SelectItem value="COORDINADOR_ACADEMICO">Coordinador Académico</SelectItem>
              <SelectItem value="PROFESOR">Profesor</SelectItem>
              <SelectItem value="ESTUDIANTE">Estudiante</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "all" | "active" | "inactive")}>
            <SelectTrigger className="w-[180px] border-gris-corporativo-300 focus:border-azul-confianza focus:ring-azul-confianza">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

            <Table className="w-full text-left">
              <TableHeader>
                <TableRow className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-gray)] bg-gray-50 border-b-2 border-[var(--border-color)]">
                  <TableHead>Usuario</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="text-[var(--text-secondary)] hover:bg-gray-50 divide-y divide-[var(--border-color)]"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gris-corporativo-500">
                          Desde {new Date(user.joinDate).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gris-corporativo-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gris-corporativo-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      {user.role === "COORDINADOR_ACADEMICO" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-purple-100 hover:text-purple-700"
                            onClick={() => handleEditUser(user)}
                            title="Editar coordinador"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDeleteUser(user)}
                            title="Eliminar coordinador"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gris-corporativo-400">
                          Solo lectura
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab de Analíticas */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Distribución por Roles */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Distribución por Roles</CardTitle>
                  <Badge variant="outline" className="text-xs border-[var(--primary-green)] text-[var(--primary-green)]">
                    <Users2 className="h-3 w-3 mr-1" />
                    {users.length} usuarios totales
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px"
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Tendencias de Actividad */}
            <Card className="shadow-md border-[var(--border-color)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Tendencias de Actividad - Últimos 7 días</CardTitle>
                  <Badge variant="outline" className="text-xs border-[var(--primary-green)] text-[var(--primary-green)]">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4% usuarios activos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityTrendsData}>
                    <defs>
                      <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4A7C59" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E5984" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2E5984" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px"
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="line"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activos" 
                      stroke="#4A7C59" 
                      fillOpacity={1} 
                      fill="url(#colorActivos)"
                      name="Usuarios Activos" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="nuevos" 
                      stroke="#2E5984" 
                      fillOpacity={1} 
                      fill="url(#colorNuevos)"
                      name="Nuevos Usuarios" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inactivos" 
                      stroke="#54585A"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Usuarios Inactivos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de estadísticas */}
          <Card className="shadow-md border-[var(--border-color)]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[var(--text-primary)]">Resumen de Estadísticas de Usuarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">Mayor crecimiento</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">Estudiantes</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">+12 este mes</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">Tasa de actividad</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">91.3%</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Promedio semanal</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">Último acceso promedio</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">2.4 días</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Todos los usuarios</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)]">Nuevos este mes</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">25</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">+8% vs mes anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Crear/Editar Coordinador */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-2xl font-semibold text-[var(--primary-green)]">
              {editingUser ? "Editar Coordinador Académico" : "Nuevo Coordinador Académico"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSaveCoordinator({
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              status: formData.get('status'),
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Nombre completo" 
                    defaultValue={editingUser?.name}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Institucional</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@elpatiodemicasa.com"
                    defaultValue={editingUser?.email}
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone"
                  name="phone" 
                  placeholder="+52 555 123 4567" 
                  defaultValue={editingUser?.phone}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue={editingUser?.status || "active"}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div className="text-sm text-purple-700">
                    <p className="font-medium">Nota importante:</p>
                    <p>Los coordinadores académicos tienen acceso a funciones administrativas y de gestión del sistema académico.</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-gray-100">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowUserDialog(false)}
                className="border-[var(--neutral-gray)] text-[var(--neutral-gray)] hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 text-white">
                {editingUser ? "Guardar Cambios" : "Crear Coordinador"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Coordinador Académico?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a <span className="font-semibold">{deletingUser?.name}</span> del sistema. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;