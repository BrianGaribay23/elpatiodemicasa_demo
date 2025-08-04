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
import EditRestrictionDemo from "@/modules/dashboard/components/EditRestrictionDemo";
import CancelRestrictionDemo from "@/modules/dashboard/components/CancelRestrictionDemo";
import PricingPage from "@/pages/PricingPage";
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
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Redirect all routes to pricing temporarily */}
            <Route path="/login" element={<Navigate to="/pricing" replace />} />
            <Route path="/dashboard" element={<Navigate to="/pricing" replace />} />
            <Route path="/users" element={<Navigate to="/pricing" replace />} />
            <Route path="/students" element={<Navigate to="/pricing" replace />} />
            <Route path="/teachers" element={<Navigate to="/pricing" replace />} />
            <Route path="/academic" element={<Navigate to="/pricing" replace />} />
            <Route path="/calendar" element={<Navigate to="/pricing" replace />} />
            <Route path="/finance" element={<Navigate to="/pricing" replace />} />
            <Route path="/edit-demo" element={<Navigate to="/pricing" replace />} />
            <Route path="/cancel-demo" element={<Navigate to="/pricing" replace />} />
            <Route path="/unauthorized" element={<Navigate to="/pricing" replace />} />
            <Route path="/" element={<Navigate to="/pricing" replace />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/pricing" replace />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
