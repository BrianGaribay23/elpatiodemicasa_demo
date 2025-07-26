import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = "ADMINISTRADOR_GENERAL" | "COORDINADOR_ACADEMICO" | "PROFESOR" | "ESTUDIANTE";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole') as UserRole;
      const userName = localStorage.getItem('userName');
      
      if (isAuthenticated === 'true' && userRole && userName) {
        // Mock user data based on role
        const mockEmail = userRole === 'ADMINISTRADOR_GENERAL' 
          ? 'admin@elpatiodemicasa.com' 
          : 'coordinador@elpatiodemicasa.com';
          
        setUser({
          name: userName,
          email: mockEmail,
          role: userRole
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    // Mock authentication
    if (email === "admin@elpatiodemicasa.com" && password === "admin123") {
      const userData: User = {
        name: "María González",
        email: email,
        role: "ADMINISTRADOR_GENERAL"
      };
      
      setUser(userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userName", userData.name);
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      
      navigate("/dashboard");
    } else if (email === "coordinador@elpatiodemicasa.com" && password === "coord123") {
      const userData: User = {
        name: "Carmen Villegas",
        email: email,
        role: "COORDINADOR_ACADEMICO"
      };
      
      setUser(userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userName", userData.name);
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      
      navigate("/dashboard");
    } else {
      throw new Error("Credenciales incorrectas");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};