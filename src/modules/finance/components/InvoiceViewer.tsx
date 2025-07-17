import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InvoiceViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    id: string;
    student: string;
    package: string;
    amount: number;
    credits: number;
    date: Date;
    status: string;
  };
}

export default function InvoiceViewer({ open, onOpenChange, invoice }: InvoiceViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Aquí se implementaría la lógica para descargar el PDF
    console.log("Descargando factura:", invoice.id);
  };

  const handleEmail = () => {
    // Aquí se implementaría la lógica para enviar por email
    console.log("Enviando factura por email:", invoice.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Factura {invoice.id}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Enviar
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6 p-6 bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary-green)]" style={{ fontFamily: 'Bubblegum Sans, cursive' }}>
                El Patio de Mi Casa
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Centro de Aprendizaje de Español
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                RFC: XYZ123456789
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                FACTURA
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {invoice.id}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Fecha: {format(invoice.date, "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          </div>

          {/* Client Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              Datos del Cliente
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{invoice.student}</p>
          </div>

          {/* Invoice Details */}
          <div className="border-t pt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-semibold text-[var(--text-primary)] pb-2">
                    Descripción
                  </th>
                  <th className="text-center text-sm font-semibold text-[var(--text-primary)] pb-2">
                    Cantidad
                  </th>
                  <th className="text-right text-sm font-semibold text-[var(--text-primary)] pb-2">
                    Precio Unit.
                  </th>
                  <th className="text-right text-sm font-semibold text-[var(--text-primary)] pb-2">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-sm">{invoice.package}</td>
                  <td className="py-3 text-sm text-center">{invoice.credits} créditos</td>
                  <td className="py-3 text-sm text-right">
                    ${(invoice.amount / invoice.credits).toFixed(2)}
                  </td>
                  <td className="py-3 text-sm text-right font-medium">
                    ${invoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-end space-y-1">
              <div className="w-64">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${invoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (16%):</span>
                  <span>${(invoice.amount * 0.16).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-[var(--primary-green)]">
                    ${(invoice.amount * 1.16).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Esta factura es un comprobante fiscal digital
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Conserve este documento para futuras referencias
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            {invoice.status === "completed" ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#EAF2ED] text-[var(--primary-green)]">
                ✓ Pagado
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#FEF5EC] text-[var(--accent-orange)]">
                Pendiente de pago
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}