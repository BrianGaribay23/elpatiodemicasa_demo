import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import logoElPatio from "@/assets/images/logos/20250711_2117_Sección Casa Adaptable_remix_01jzya4ff8erj8et5bb2hq251k.png";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Por favor complete todos los campos");
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password, rememberMe);
      // Navigation is handled in the login function
    } catch (err) {
      setError("Credenciales incorrectas. Por favor intente nuevamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)] patio-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img 
            src={logoElPatio} 
            alt="El Patio de Mi Casa" 
            className="h-24 w-auto mx-auto mb-4"
          />
          <h1 
            className="text-5xl font-bold mb-2" 
            style={{ 
              color: '#5DB5BA', 
              fontFamily: 'Bubblegum Sans, Kalam, Patrick Hand, cursive' 
            }}
          >
            El Patio de Mi Casa
          </h1>
          <p className="text-[var(--text-secondary)]">
            Sistema de Gestión Académica
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-t-4 border-[var(--primary-green)]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-[var(--secondary-blue)]">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@elpatiodemicasa.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-[var(--primary-green)] focus:ring-[var(--primary-green)]"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 border-gray-300 focus:border-[var(--primary-green)] focus:ring-[var(--primary-green)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recordarme
                  </label>
                </div>
                <a 
                  href="#" 
                  className="text-sm text-[var(--secondary-blue)] hover:underline"
                >
                  ¿Olvidó su contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green)] hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Credenciales de prueba:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Admin:</strong> admin@elpatiodemicasa.com / admin123</p>
                <p><strong>Coordinador:</strong> coordinador@elpatiodemicasa.com / coord123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2024 El Patio de Mi Casa. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}