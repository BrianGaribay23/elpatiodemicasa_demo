import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  Calendar,
  Activity,
  UserPlus,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  trend: "up" | "down" | "neutral";
  description?: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  trend,
  description = "desde el mes pasado",
  subtitle,
  extra,
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
        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        {extra && <div className="mt-2">{extra}</div>}
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
            {change > 0 ? "+" : ""}{change}%
          </span>
          <span className="ml-1 text-gray-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardMetricsProps {
  activeStudents?: number;
  classesToday?: number;
  individualClasses?: number;
  groupClasses?: number;
  attendanceRate?: number;
  newStudents?: number;
  studentTrend?: number;
  classTrend?: number;
  attendanceTrend?: number;
  newStudentsTrend?: number;
}

const DashboardMetrics = ({
  activeStudents = 156,
  classesToday = 24,
  individualClasses = 16,
  groupClasses = 8,
  attendanceRate = 94,
  newStudents = 12,
  studentTrend = 8,
  classTrend = 12,
  attendanceTrend = 3,
  newStudentsTrend = 15,
}: DashboardMetricsProps) => {
  // Datos mockeados de países principales
  const topCountries = [
    { flag: "🇺🇸", count: 68 },
    { flag: "🇨🇳", count: 52 },
    { flag: "🇧🇷", count: 12 },
    { flag: "🇫🇷", count: 10 },
    { flag: "🇩🇪", count: 8 },
  ];

  return (
    <div className="w-full bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Estudiantes Activos"
          value={activeStudents}
          subtitle="De 15 países diferentes"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          change={studentTrend}
          trend={studentTrend >= 0 ? "up" : "down"}
          extra={
            <div className="flex -space-x-2">
              {topCountries.map((country, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs border-2 border-white"
                  title={`${country.count} estudiantes`}
                >
                  {country.flag}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border-2 border-white font-medium">
                +10
              </div>
            </div>
          }
        />
        
        <MetricCard
          title="Clases Hoy"
          value={classesToday}
          subtitle={`${individualClasses} individuales • ${groupClasses} grupales`}
          icon={<Calendar className="h-5 w-5 text-green-600" />}
          change={classTrend}
          trend={classTrend >= 0 ? "up" : "down"}
          extra={
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                Individual
              </Badge>
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Grupal
              </Badge>
            </div>
          }
        />
        
        <MetricCard
          title="Tasa de Asistencia"
          value={`${attendanceRate}%`}
          subtitle="Promedio semanal"
          icon={<Activity className="h-5 w-5 text-purple-600" />}
          change={attendanceTrend}
          trend={attendanceTrend >= 0 ? "up" : "down"}
          description="vs semana anterior"
          extra={
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          }
        />
        
        <MetricCard
          title="Nuevos Estudiantes"
          value={newStudents}
          subtitle="Este mes"
          icon={<UserPlus className="h-5 w-5 text-orange-600" />}
          change={newStudentsTrend}
          trend={newStudentsTrend >= 0 ? "up" : "down"}
          extra={
            <Badge variant="secondary" className="text-xs">
              🎯 Meta: 15
            </Badge>
          }
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;
