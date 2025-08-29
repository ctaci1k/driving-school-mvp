// app/[locale]/student/payments/invoice/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Mail,
  Check,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Building,
  CreditCard,
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const t = useTranslations('student.invoice');

  // Mock invoice data with translated items
  const mockInvoice = {
    id: 'INV-2024-08-001',
    issueDate: '2024-08-25',
    dueDate: '2024-09-08',
    status: 'paid',
    paymentDate: '2024-08-25',
    paymentMethod: t('paymentMethods.creditCard'),
    
    // Company details
    company: {
      name: t('company.name'),
      address: t('company.address'),
      city: t('company.city'),
      postalCode: t('company.postalCode'),
      country: t('company.country'),
      nip: t('company.nip'),
      regon: t('company.regon'),
      phone: '+48 22 123 45 67',
      email: 'faktury@drivetime.pl',
      website: 'www.drivetime.pl',
      bank: t('company.bank'),
      accountNumber: 'PL12 1234 5678 9012 3456 7890 1234'
    },
    
    // Customer details
    customer: {
      name: 'Jan Kowalski',
      address: 'ul. Wilanowska 89/15',
      city: 'Warszawa',
      postalCode: '02-765',
      country: t('company.country'),
      email: 'jan.kowalski@example.com',
      phone: '+48 601 234 567',
      studentId: 'STU-2024-0123'
    },
    
    // Invoice items
    items: [
      {
        id: '1',
        description: t('items.standardPackage'),
        quantity: 1,
        unitPrice: 1800,
        tax: 23,
        total: 1800
      },
      {
        id: '2',
        description: t('items.weekendLessons'),
        quantity: 1,
        unitPrice: 200,
        tax: 23,
        total: 200
      },
      {
        id: '3',
        description: t('items.studyMaterials'),
        quantity: 1,
        unitPrice: 0,
        tax: 23,
        total: 0
      }
    ],
    
    // Summary
    summary: {
      subtotal: 2000,
      taxAmount: 460,
      discount: 100,
      total: 1900,
      paid: 1900,
      due: 0
    },
    
    notes: t('notes.thankYou'),
    
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, this would generate and download PDF
    console.log('Downloading invoice PDF...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${t('title')} ${mockInvoice.id}`,
        text: t('title'),
        url: window.location.href
      });
    }
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(mockInvoice.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH'
    }).format(amount * 10.5); // Convert PLN to UAH for display
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('status.paid')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('status.pending')}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            {t('downloadPDF')}
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <Card className="print:shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('title')}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 font-mono">{mockInvoice.id}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleCopyInvoiceNumber}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              {getStatusBadge(mockInvoice.status)}
            </div>
            
            {/* QR Code */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-lg mb-2">
                {/* In real app, this would be actual QR code */}
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  QR Code
                </div>
              </div>
              <p className="text-xs text-gray-500">{t('scanCode')}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seller */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-3">{t('labels.seller')}</h3>
              <div className="space-y-1">
                <p className="font-semibold">{mockInvoice.company.name}</p>
                <p className="text-sm text-gray-600">{mockInvoice.company.address}</p>
                <p className="text-sm text-gray-600">
                  {mockInvoice.company.postalCode} {mockInvoice.company.city}
                </p>
                <p className="text-sm text-gray-600">{mockInvoice.company.country}</p>
                <div className="pt-2 space-y-1">
                  <p className="text-sm text-gray-600">{mockInvoice.company.nip}</p>
                  <p className="text-sm text-gray-600">{mockInvoice.company.regon}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {mockInvoice.company.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {mockInvoice.company.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-3 w-3" />
                    {mockInvoice.company.website}
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-3">{t('labels.buyer')}</h3>
              <div className="space-y-1">
                <p className="font-semibold">{mockInvoice.customer.name}</p>
                <p className="text-sm text-gray-600">{mockInvoice.customer.address}</p>
                <p className="text-sm text-gray-600">
                  {mockInvoice.customer.postalCode} {mockInvoice.customer.city}
                </p>
                <p className="text-sm text-gray-600">{mockInvoice.customer.country}</p>
                <div className="pt-2 space-y-1">
                  <p className="text-sm text-gray-600">{t('customer.studentId')}: {mockInvoice.customer.studentId}</p>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {mockInvoice.customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {mockInvoice.customer.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates and Payment Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('labels.issueDate')}</p>
              <p className="font-semibold text-sm">{mockInvoice.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('labels.dueDate')}</p>
              <p className="font-semibold text-sm">{mockInvoice.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('labels.paymentDate')}</p>
              <p className="font-semibold text-sm">{mockInvoice.paymentDate || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('labels.paymentMethod')}</p>
              <p className="font-semibold text-sm">{mockInvoice.paymentMethod}</p>
            </div>
          </div>

          <Separator />

          {/* Invoice Items Table */}
          <div>
            <h3 className="font-semibold mb-3">{t('table.invoiceItems')}</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">{t('table.number')}</TableHead>
                    <TableHead>{t('table.description')}</TableHead>
                    <TableHead className="text-right">{t('table.quantity')}</TableHead>
                    <TableHead className="text-right">{t('table.unitPrice')}</TableHead>
                    <TableHead className="text-right">{t('table.vat')}</TableHead>
                    <TableHead className="text-right">{t('table.total')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoice.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{item.tax}%</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Bank Account Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {t('company.accountLabel')}
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Bank: {mockInvoice.company.bank}</p>
                  <p className="font-mono text-gray-900">{mockInvoice.company.accountNumber}</p>
                  <p className="text-gray-600 mt-2">{t('company.transferTitle')}:</p>
                  <p className="font-semibold">{mockInvoice.id}</p>
                </div>
              </div>

              {/* Notes */}
              {mockInvoice.notes && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{mockInvoice.notes}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Total Summary */}
            <div className="space-y-2">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('summary.netValue')}</span>
                  <span>{formatCurrency(mockInvoice.summary.subtotal - mockInvoice.summary.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('summary.vat')}</span>
                  <span>{formatCurrency(mockInvoice.summary.taxAmount)}</span>
                </div>
                {mockInvoice.summary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('summary.discount')}</span>
                    <span>-{formatCurrency(mockInvoice.summary.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>{t('summary.toPay')}</span>
                  <span>{formatCurrency(mockInvoice.summary.total)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">{t('summary.paid')}</span>
                  <span className="text-green-600 font-medium">{formatCurrency(mockInvoice.summary.paid)}</span>
                </div>
                {mockInvoice.summary.due > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('summary.remaining')}</span>
                    <span className="text-red-600 font-medium">{formatCurrency(mockInvoice.summary.due)}</span>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              {mockInvoice.status === 'paid' && (
                <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">{t('invoicePaid')}</p>
                    <p className="text-sm text-green-700">{t('date')}: {mockInvoice.paymentDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>{t('notes.electronicInvoice')}</p>
            <p>
              {t('notes.contact')}: {mockInvoice.company.email} {t('or')} {mockInvoice.company.phone}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center print:hidden">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              {t('sendByEmail')}
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t('print')}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t('downloadPDF')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none, .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}