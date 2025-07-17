import React from "react";
import UserManagement from "../components/UserManagement";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 px-4 flex justify-between items-center">
        <div>
          <h2 className="text-[var(--secondary-blue)] text-3xl font-bold leading-tight">Gestión de Usuarios</h2>
          <p className="text-[var(--neutral-gray)] mt-1">Administra coordinadores académicos del sistema.</p>
        </div>
        <div className="text-[var(--primary-green)] opacity-20">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>

      {/* User Management Component */}
      <UserManagement />
    </div>
  );
}