import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/modules/shared";
import { DashboardPage } from "@/modules/dashboard";
import { UsersPage } from "@/modules/users";
import { StudentsPage } from "@/modules/students";
import { TeachersPage } from "@/modules/teachers";
import { AcademicPage } from "@/modules/academic";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="academic" element={<AcademicPage />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
