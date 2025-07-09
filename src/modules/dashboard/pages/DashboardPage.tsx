import React from "react";
import DashboardMetrics from "../components/DashboardMetrics";
import { CalendarView } from "@/modules/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardMetrics />
      
      <Card>
        <CardHeader>
          <CardTitle>Calendario de Clases</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Nueva inscripción: Ana Martínez</span>
                  <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Clase completada: Yoga Matutino</span>
                  <span className="text-xs text-muted-foreground">Hace 3 horas</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Pago recibido: Carlos López</span>
                  <span className="text-xs text-muted-foreground">Hace 5 horas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="border rounded-md p-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">Módulo de Análisis</h3>
            <p className="text-muted-foreground">
              Visualiza tendencias y métricas detalladas
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="border rounded-md p-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">Módulo de Reportes</h3>
            <p className="text-muted-foreground">
              Genera reportes personalizados
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}