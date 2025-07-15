import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/modules/shared";
import { DashboardPage } from "@/modules/dashboard";
import { UsersPage } from "@/modules/users";
import { StudentsPage } from "@/modules/students";
import { TeachersPage } from "@/modules/teachers";
import { AcademicPage } from "@/modules/academic";
import { CalendarPage } from "@/modules/calendar";
import { FinancePage } from "@/modules/finance";
import { LoginPage, AuthProvider, ProtectedRoute } from "@/modules/auth";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-green)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Cargando...</p>
          </div>
        </div>
      }>
        <>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR_GENERAL", "COORDINADOR_ACADEMICO"]}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="academic" element={<AcademicPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="finance" element={
                <ProtectedRoute allowedRoles={["ADMINISTRADOR_GENERAL", "COORDINADOR_ACADEMICO"]}>
                  <FinancePage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-[var(--accent-orange)] mb-4">403</h1>
                  <p className="text-[var(--text-secondary)] mb-4">No tienes permisos para acceder a esta página</p>
                  <a href="/dashboard" className="text-[var(--primary-green)] hover:underline">
                    Volver al inicio
                  </a>
                </div>
              </div>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
