import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Info,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CreditTransaction {
  id: string;
  date: Date;
  type: "earned" | "used";
  amount: number;
  description: string;
  classDate?: Date;
}

interface StudentCreditsCardProps {
  studentId: string;
  studentName: string;
  totalCredits: number;
  transactions?: CreditTransaction[];
  onUseCredits?: () => void;
}

export default function StudentCreditsCard({
  studentId,
  studentName,
  totalCredits,
  transactions = [],
  onUseCredits
}: StudentCreditsCardProps) {
  // Calculate statistics
  const earnedCredits = transactions
    .filter(t => t.type === "earned")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const usedCredits = transactions
    .filter(t => t.type === "used")
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <Card className="border-2 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Créditos Disponibles</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className="text-lg px-3 py-1 bg-green-50 text-green-700 border-green-300"
          >
            {totalCredits} créditos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Créditos ganados</span>
            </div>
            <p className="text-2xl font-bold text-green-800 mt-1">+{earnedCredits}</p>
            <p className="text-xs text-green-600">Por cancelaciones</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Créditos usados</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 mt-1">-{usedCredits}</p>
            <p className="text-xs text-blue-600">En nuevas clases</p>
          </div>
        </div>

        {/* Use Credits Button */}
        {totalCredits > 0 && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onUseCredits}
          >
            <Plus className="h-4 w-4 mr-2" />
            Usar créditos para nueva clase
          </Button>
        )}

        {/* Info Box */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Información sobre créditos:</p>
              <ul className="space-y-0.5">
                <li>• Los créditos no tienen fecha de vencimiento</li>
                <li>• Se generan al cancelar clases con anticipación</li>
                <li>• Cada crédito equivale a una hora de clase</li>
                <li>• Puedes acumular créditos ilimitadamente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Historial reciente</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {transaction.type === "earned" ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(transaction.date, "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    transaction.type === "earned" ? "text-green-600" : "text-blue-600"
                  }`}>
                    {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalCredits === 0 && (
          <div className="text-center py-4">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No tienes créditos disponibles</p>
            <p className="text-xs text-gray-500 mt-1">
              Los créditos se generan al cancelar clases
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}