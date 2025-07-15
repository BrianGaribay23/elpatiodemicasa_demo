import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Receipt,
  CreditCard,
  DollarSign,
  User,
  Package,
  Calendar,
  Printer,
  Send,
  Download,
} from "lucide-react";

const invoiceSchema = z.object({
  studentId: z.string().min(1, "Selecciona un estudiante"),
  packageId: z.string().min(1, "Selecciona un paquete"),
  paymentMethod: z.enum(["cash", "transfer", "card"]),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
  sendEmail: z.boolean().default(true),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: any) => void;
}

export default function InvoiceGenerator({
  open,
  onOpenChange,
  onGenerate,
}: InvoiceGeneratorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Mock data
  const students = [
    { id: "1", name: "Emma Wilson", email: "emma.wilson@email.com", country: "🇺🇸" },
    { id: "2", name: "Carlos Chen", email: "carlos.chen@email.com", country: "🇨🇳" },
    { id: "3", name: "Sophie Martin", email: "sophie.martin@email.com", country: "🇫🇷" },
    { id: "4", name: "Ana García", email: "ana.garcia@email.com", country: "🇲🇽" },
  ];

  const packages = [
    { id: "1", name: "10 Clases", credits: 10, price: 4500 },
    { id: "2", name: "20 Clases", credits: 20, price: 8000 },
    { id: "3", name: "50 Clases", credits: 50, price: 18000 },
    { id: "4", name: "100 Clases", credits: 100, price: 32000 },
  ];

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      studentId: "",
      packageId: "",
      paymentMethod: "cash",
      paymentReference: "",
      notes: "",
      sendEmail: true,
    },
  });

  const selectedStudent = students.find(s => s.id === form.watch("studentId"));
  const selectedPackage = packages.find(p => p.id === form.watch("packageId"));

  const handlePreview = () => {
    const formData = form.getValues();
    const invoice = {
      invoiceNumber: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date(),
      student: selectedStudent,
      package: selectedPackage,
      paymentMethod: formData.paymentMethod,
      paymentReference: formData.paymentReference,
      notes: formData.notes,
      subtotal: selectedPackage?.price || 0,
      tax: 0, // No tax for educational services in Mexico
      total: selectedPackage?.price || 0,
    };
    setInvoiceData(invoice);
    setShowPreview(true);
  };

  const handleGenerate = () => {
    const formData = form.getValues();
    onGenerate({
      ...invoiceData,
      sendEmail: formData.sendEmail,
    });
    form.reset();
    setShowPreview(false);
    onOpenChange(false);
  };

  const paymentMethodLabels = {
    cash: "Efectivo",
    transfer: "Transferencia",
    card: "Tarjeta",
  };

  return (
    <>
      <Dialog open={open && !showPreview} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generar Ticket de Venta</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-6">
              {/* Student Selection */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estudiante</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estudiante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            <div className="flex items-center gap-2">
                              <span>{student.country}</span>
                              <span>{student.name}</span>
                              <span className="text-muted-foreground">({student.email})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Package Selection */}
              <FormField
                control={form.control}
                name="packageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paquete de Créditos</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un paquete" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{pkg.name} ({pkg.credits} créditos)</span>
                              <span className="font-medium ml-4">${pkg.price.toLocaleString()}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Efectivo
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Transferencia
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Tarjeta
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Reference */}
              {(form.watch("paymentMethod") === "transfer" || form.watch("paymentMethod") === "card") && (
                <FormField
                  control={form.control}
                  name="paymentReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia de Pago</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de referencia o últimos 4 dígitos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales para el ticket..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Summary */}
              {selectedPackage && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Paquete:</span>
                        <span className="font-medium">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Créditos:</span>
                        <span className="font-medium">{selectedPackage.credits}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${selectedPackage.price.toLocaleString()} MXN</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePreview}
              disabled={!form.formState.isValid || !selectedStudent || !selectedPackage}
            >
              Vista Previa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vista Previa del Ticket</DialogTitle>
          </DialogHeader>

          {invoiceData && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">El Patio de Mi Casa</h2>
                    <p className="text-muted-foreground">Escuela de Español</p>
                    <p className="text-sm text-muted-foreground">RFC: PMC123456789</p>
                  </div>

                  <Separator className="my-4" />

                  {/* Invoice Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="font-semibold">Ticket #: {invoiceData.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Fecha: {format(invoiceData.date, "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-[var(--primary-green)]">
                        {paymentMethodLabels[invoiceData.paymentMethod as keyof typeof paymentMethodLabels]}
                      </Badge>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Estudiante:</h3>
                    <p>{invoiceData.student.name}</p>
                    <p className="text-sm text-muted-foreground">{invoiceData.student.email}</p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="pb-2">Concepto</th>
                          <th className="pb-2 text-center">Cantidad</th>
                          <th className="pb-2 text-right">Precio</th>
                          <th className="pb-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2">
                            <p>{invoiceData.package.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoiceData.package.credits} créditos para clases
                            </p>
                          </td>
                          <td className="py-2 text-center">1</td>
                          <td className="py-2 text-right">${invoiceData.package.price.toLocaleString()}</td>
                          <td className="py-2 text-right">${invoiceData.package.price.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${invoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${invoiceData.total.toLocaleString()} MXN</span>
                    </div>
                  </div>

                  {invoiceData.notes && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="font-semibold mb-1">Notas:</p>
                        <p className="text-sm text-muted-foreground">{invoiceData.notes}</p>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  {/* Footer */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Gracias por tu compra</p>
                    <p>Este documento es un comprobante de pago</p>
                  </div>
                </CardContent>
              </Card>

              {/* Send Options */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  defaultChecked={form.getValues("sendEmail")}
                  onChange={(e) => form.setValue("sendEmail", e.target.checked)}
                />
                <Label htmlFor="sendEmail">
                  Enviar por correo electrónico a {invoiceData.student.email}
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Volver
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={handleGenerate}>
              <Send className="h-4 w-4 mr-2" />
              Generar y Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}