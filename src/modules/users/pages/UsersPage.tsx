import React from "react";
import UserManagement from "../components/UserManagement";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[var(--primary-green)] mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-[var(--text-secondary)]">
          Administra coordinadores académicos del sistema
        </p>
      </div>

      {/* User Management Component */}
      <UserManagement />
    </div>
  );
}