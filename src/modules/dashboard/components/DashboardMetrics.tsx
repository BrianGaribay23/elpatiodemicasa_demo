import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  Calendar,
  UserCheck,
  CreditCard,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  trend: "up" | "down" | "neutral";
  description?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  trend,
  description = "desde el mes pasado",
}: MetricCardProps) => {
  return (
    <Card className="bg-white border-2 border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <div className="p-2 bg-gray-100 rounded-md">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1 text-xs">
          {trend === "up" && (
            <ArrowUpIcon className="w-3 h-3 mr-1 text-green-600" />
          )}
          {trend === "down" && (
            <ArrowDownIcon className="w-3 h-3 mr-1 text-red-600" />
          )}
          <span
            className={`${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}
          >
            {change}%
          </span>
          <span className="ml-1 text-gray-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardMetricsProps {
  classesToday?: number;
  activeTeachers?: number;
  enrolledStudents?: number;
  pendingCredits?: number;
  classTrend?: number;
  teacherTrend?: number;
  studentTrend?: number;
  creditTrend?: number;
}

const DashboardMetrics = ({
  classesToday = 24,
  activeTeachers = 12,
  enrolledStudents = 156,
  pendingCredits = 432,
  classTrend = 8,
  teacherTrend = 5,
  studentTrend = 12,
  creditTrend = -3,
}: DashboardMetricsProps) => {
  return (
    <div className="w-full bg-background p-4">
      <h2 className="text-xl font-bold mb-4">Métricas del día</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Clases Hoy"
          value={classesToday}
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          change={classTrend}
          trend={classTrend >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Profesores Activos"
          value={activeTeachers}
          icon={<UserCheck className="h-5 w-5 text-green-600" />}
          change={teacherTrend}
          trend={teacherTrend >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Estudiantes Inscritos"
          value={enrolledStudents}
          icon={<Users className="h-5 w-5 text-orange-500" />}
          change={studentTrend}
          trend={studentTrend >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Créditos Pendientes"
          value={pendingCredits}
          icon={<CreditCard className="h-5 w-5 text-purple-600" />}
          change={creditTrend}
          trend={creditTrend >= 0 ? "up" : "down"}
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;
