// app/[locale]/admin/payments/invoices/page.tsx
// Strona faktur - zarządzanie fakturami, generowanie i wysyłka dokumentów księgowych

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Send,
  Eye,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Printer,
  Copy,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { cn } from '@/lib/utils';

// Typy
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
type InvoiceType = 'standard' | 'proforma' | 'correction';
type PaymentMethod = 'cash' | 'transfer' | 'card' | 'online';

interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    isCompany: boolean;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    total: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  attachments?: string[];
  sentAt?: string;
  viewedAt?: string;
  reminders: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    number: 'FV/2024/12/001',
    type: 'standard',
    status: 'paid',
    issueDate: '2024-12-01',
    dueDate: '2024-12-15',
    paymentDate: '2024-12-10',
    customer: {
      id: 'cust-1',
      name: 'Jan Kowalski',
      email: 'jan.kowalski@email.com',
      phone: '+48 600 123 456',
      address: 'ul. Marszałkowska 10, 00-001 Warszawa',
      isCompany: false
    },
    items: [
      {
        id: '1',
        description: 'Pakiet Standard B - Kurs prawa jazdy',
        quantity: 1,
        unitPrice: 2999,
        vatRate: 23,
        total: 3688.77
      }
    ],
    subtotal: 2999,
    vatAmount: 689.77,
    total: 3688.77,
    currency: 'PLN',
    paymentMethod: 'transfer',
    reminders: 0,
    createdAt: '2024-12-01',
    updatedAt: '2024-12-10'
  },
  {
    id: 'inv-002',
    number: 'FV/2024/12/002',
    type: 'proforma',
    status: 'sent',
    issueDate: '2024-12-05',
    dueDate: '2024-12-19',
    customer: {
      id: 'cust-2',
      name: 'AutoSzkoła Partner Sp. z o.o.',
      email: 'kontakt@partner.pl',
      phone: '+48 22 123 45 67',
      address: 'ul. Prosta 20, 00-002 Warszawa',
      taxId: 'PL1234567890',
      isCompany: true
    },
    items: [
      {
        id: '1',
        description: 'Pakiet Premium B - 5 kursantów',
        quantity: 5,
        unitPrice: 3500,
        vatRate: 23,
        total: 21525
      },
      {
        id: '2',
        description: 'Dodatkowe godziny praktyki',
        quantity: 10,
        unitPrice: 120,
        vatRate: 23,
        total: 1476
      }
    ],
    subtotal: 18700,
    vatAmount: 4301,
    total: 23001,
    currency: 'PLN',
    sentAt: '2024-12-05T14:30:00',
    viewedAt: '2024-12-05T16:45:00',
    reminders: 0,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-05'
  },
  {
    id: 'inv-003',
    number: 'FV/2024/12/003',
    type: 'standard',
    status: 'overdue',
    issueDate: '2024-11-20',
    dueDate: '2024-12-04',
    customer: {
      id: 'cust-3',
      name: 'Anna Nowak',
      email: 'anna.nowak@email.com',
      phone: '+48 700 234 567',
      address: 'ul. Złota 44, 00-003 Warszawa',
      isCompany: false
    },
    items: [
      {
        id: '1',
        description: 'Pakiet Intensywny A2',
        quantity: 1,
        unitPrice: 2200,
        vatRate: 23,
        total: 2706
      }
    ],
    subtotal: 2200,
    vatAmount: 506,
    total: 2706,
    currency: 'PLN',
    reminders: 2,
    createdAt: '2024-11-20',
    updatedAt: '2024-12-15'
  },
  // Więcej faktur dla demonstracji
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `inv-${String(i + 4).padStart(3, '0')}`,
    number: `FV/2024/12/${String(i + 4).padStart(3, '0')}`,
    type: (['standard', 'proforma', 'correction'] as InvoiceType[])[i % 3],
    status: (['paid', 'sent', 'draft', 'overdue', 'cancelled'] as InvoiceStatus[])[i % 5],
    issueDate: `2024-12-${String(i + 1).padStart(2, '0')}`,
    dueDate: `2024-12-${String(i + 15).padStart(2, '0')}`,
    customer: {
      id: `cust-${i + 4}`,
      name: `Klient ${i + 4}`,
      email: `klient${i + 4}@email.com`,
      phone: `+48 600 ${String(i).padStart(3, '0')} ${String(i).padStart(3, '0')}`,
      address: `ul. Testowa ${i + 1}, 00-00${i} Warszawa`,
      isCompany: i % 2 === 0,
      taxId: i % 2 === 0 ? `PL${String(i).padStart(10, '0')}` : undefined
    },
    items: [
      {
        id: '1',
        description: 'Usługa szkoleniowa',
        quantity: 1,
        unitPrice: 2000 + (i * 100),
        vatRate: 23,
        total: (2000 + (i * 100)) * 1.23
      }
    ],
    subtotal: 2000 + (i * 100),
    vatAmount: (2000 + (i * 100)) * 0.23,
    total: (2000 + (i * 100)) * 1.23,
    currency: 'PLN',
    paymentMethod: (['transfer', 'card', 'cash'] as PaymentMethod[])[i % 3],
    reminders: 0,
    createdAt: `2024-12-${String(i + 1).padStart(2, '0')}`,
    updatedAt: `2024-12-${String(i + 1).padStart(2, '0')}`
  }))
];

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    dateRange: null
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null
  });
  const [sendDialog, setSendDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null
  });

  // Statystyki
  const stats = {
    total: invoices.length,
    totalValue: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: invoices.filter(inv => inv.status === 'paid').length,
    paidValue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pending: invoices.filter(inv => inv.status === 'sent').length,
    pendingValue: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    overdueValue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0)
  };

  // Filtrowane faktury
  const filteredInvoices = invoices.filter(invoice => {
    if (filters.search && !invoice.number.toLowerCase().includes(filters.search.toLowerCase()) &&
        !invoice.customer.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && invoice.status !== filters.status) return false;
    if (filters.type !== 'all' && invoice.type !== filters.type) return false;
    return true;
  });

  const statusColors: Record<InvoiceStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
    refunded: 'bg-purple-100 text-purple-700'
  };

  const statusLabels: Record<InvoiceStatus, string> = {
    draft: 'Szkic',
    sent: 'Wysłana',
    paid: 'Opłacona',
    overdue: 'Zaległa',
    cancelled: 'Anulowana',
    refunded: 'Zwrócona'
  };

  const typeLabels: Record<InvoiceType, string> = {
    standard: 'Faktura VAT',
    proforma: 'Proforma',
    correction: 'Korekta'
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, selectedInvoices);
    toast({
      title: 'Akcja wykonana',
      description: `${action} dla ${selectedInvoices.length} faktur`,
    });
    setSelectedInvoices([]);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setSendDialog({ open: true, invoice });
  };

  const sendInvoice = () => {
    console.log('Sending invoice:', sendDialog.invoice?.id);
    toast({
      title: 'Faktura wysłana',
      description: `Faktura ${sendDialog.invoice?.number} została wysłana na adres ${sendDialog.invoice?.customer.email}`,
    });
    setSendDialog({ open: false, invoice: null });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.id);
    toast({
      title: 'Pobieranie faktury',
      description: `Faktura ${invoice.number} została pobrana`,
    });
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    console.log('Duplicate invoice:', invoice.id);
    toast({
      title: 'Faktura zduplikowana',
      description: `Utworzono kopię faktury ${invoice.number}`,
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Faktury</h1>
              <p className="text-gray-600">Zarządzaj dokumentami księgowymi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/payments/invoices/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Ustawienia
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/admin/payments/invoices/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nowa faktura
            </Button>
          </div>
        </div>
      </div>

      {/* Karty statystyk */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Ten miesiąc</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">Wszystkich faktur</p>
            <p className="text-xs text-gray-500 mt-2">
              Wartość: {stats.totalValue.toLocaleString('pl-PL')} zł
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700">{stats.paid}</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.paidValue.toLocaleString('pl-PL')} zł
            </p>
            <p className="text-sm text-gray-600">Opłacone</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">+12% vs poprz. miesiąc</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <Badge className="bg-yellow-100 text-yellow-700">{stats.pending}</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.pendingValue.toLocaleString('pl-PL')} zł
            </p>
            <p className="text-sm text-gray-600">Oczekujące</p>
            <p className="text-xs text-gray-500 mt-2">
              Średni czas: 7 dni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <Badge className="bg-red-100 text-red-700">{stats.overdue}</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.overdueValue.toLocaleString('pl-PL')} zł
            </p>
            <p className="text-sm text-gray-600">Zaległe</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-xs text-red-600">Wymaga interwencji</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtry i akcje */}
      <Card className="bg-white border-gray-100 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Szukaj po numerze lub kliencie..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="draft">Szkice</SelectItem>
                  <SelectItem value="sent">Wysłane</SelectItem>
                  <SelectItem value="paid">Opłacone</SelectItem>
                  <SelectItem value="overdue">Zaległe</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="standard">Faktura VAT</SelectItem>
                  <SelectItem value="proforma">Proforma</SelectItem>
                  <SelectItem value="correction">Korekta</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange />
            </div>

            {selectedInvoices.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Zaznaczono: {selectedInvoices.length}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Akcje
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('send')}>
                      <Send className="w-4 h-4 mr-2" />
                      Wyślij
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('download')}>
                      <Download className="w-4 h-4 mr-2" />
                      Pobierz
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('print')}>
                      <Printer className="w-4 h-4 mr-2" />
                      Drukuj
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela faktur */}
      <Card className="bg-white border-gray-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Numer</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Data wystawienia</TableHead>
                <TableHead>Termin płatności</TableHead>
                <TableHead>Kwota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-800">{invoice.number}</p>
                      <p className="text-xs text-gray-500">{typeLabels[invoice.type]}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invoice.customer.isCompany && (
                        <Building className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{invoice.customer.name}</p>
                        <p className="text-xs text-gray-500">{invoice.customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.issueDate).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={cn(
                        "text-sm",
                        invoice.status === 'overdue' && "text-red-600 font-medium"
                      )}>
                        {new Date(invoice.dueDate).toLocaleDateString('pl-PL')}
                      </p>
                      {invoice.status === 'overdue' && (
                        <p className="text-xs text-red-600">
                          {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} dni po terminie
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-800">
                      {invoice.total.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[invoice.status]}>
                      {statusLabels[invoice.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailsDialog({ open: true, invoice })}>
                          <Eye className="w-4 h-4 mr-2" />
                          Podgląd
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)}>
                          <Download className="w-4 h-4 mr-2" />
                          Pobierz PDF
                        </DropdownMenuItem>
                        {invoice.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                            <Send className="w-4 h-4 mr-2" />
                            Wyślij
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => window.print()}>
                          <Printer className="w-4 h-4 mr-2" />
                          Drukuj
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplikuj
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/payments/invoices/${invoice.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edytuj
                        </DropdownMenuItem>
                        {invoice.status === 'paid' && (
                          <DropdownMenuItem onClick={() => console.log('Create correction')}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Wystaw korektę
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => console.log('Delete invoice')}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Usuń
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginacja */}
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Pokazywanie 1-10 z {filteredInvoices.length} wyników
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
                Poprzednia
              </Button>
              <Button variant="outline" size="sm">
                Następna
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog szczegółów faktury */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, invoice: detailsDialog.invoice })}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Szczegóły faktury</DialogTitle>
          </DialogHeader>
          {detailsDialog.invoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{detailsDialog.invoice.number}</h3>
                  <Badge className={statusColors[detailsDialog.invoice.status]}>
                    {statusLabels[detailsDialog.invoice.status]}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Data wystawienia</p>
                  <p className="font-medium">{new Date(detailsDialog.invoice.issueDate).toLocaleDateString('pl-PL')}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Sprzedawca</h4>
                  <p className="text-sm text-gray-600">
                    AutoSzkoła Drive<br />
                    ul. Marszałkowska 10<br />
                    00-001 Warszawa<br />
                    NIP: 1234567890
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Nabywca</h4>
                  <p className="text-sm text-gray-600">
                    {detailsDialog.invoice.customer.name}<br />
                    {detailsDialog.invoice.customer.address}<br />
                    {detailsDialog.invoice.customer.taxId && `NIP: ${detailsDialog.invoice.customer.taxId}`}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opis</TableHead>
                    <TableHead className="text-right">Ilość</TableHead>
                    <TableHead className="text-right">Cena jedn.</TableHead>
                    <TableHead className="text-right">VAT</TableHead>
                    <TableHead className="text-right">Wartość</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailsDialog.invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.unitPrice.toFixed(2)} zł</TableCell>
                      <TableCell className="text-right">{item.vatRate}%</TableCell>
                      <TableCell className="text-right font-medium">{item.total.toFixed(2)} zł</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <div className="space-y-2 w-64">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Netto:</span>
                    <span>{detailsDialog.invoice.subtotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT:</span>
                    <span>{detailsDialog.invoice.vatAmount.toFixed(2)} zł</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Do zapłaty:</span>
                    <span>{detailsDialog.invoice.total.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog({ open: false, invoice: null })}>
              Zamknij
            </Button>
            {detailsDialog.invoice && (
              <>
                <Button variant="outline" onClick={() => handleDownloadInvoice(detailsDialog.invoice!)}>
                  <Download className="w-4 h-4 mr-2" />
                  Pobierz PDF
                </Button>
                <Button onClick={() => handleSendInvoice(detailsDialog.invoice!)}>
                  <Send className="w-4 h-4 mr-2" />
                  Wyślij
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog wysyłania faktury */}
      <Dialog open={sendDialog.open} onOpenChange={(open) => setSendDialog({ open, invoice: sendDialog.invoice })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wyślij fakturę</DialogTitle>
            <DialogDescription>
              Faktura zostanie wysłana na adres email klienta
            </DialogDescription>
          </DialogHeader>
          {sendDialog.invoice && (
            <div className="space-y-4">
              <div>
                <Label>Odbiorca</Label>
                <Input value={sendDialog.invoice.customer.email} disabled />
              </div>
              <div>
                <Label>Temat wiadomości</Label>
                <Input defaultValue={`Faktura ${sendDialog.invoice.number}`} />
              </div>
              <div>
                <Label>Treść wiadomości</Label>
                <textarea 
                  className="w-full h-32 p-3 border rounded-md"
                  defaultValue={`Szanowni Państwo,\n\nW załączeniu przesyłamy fakturę nr ${sendDialog.invoice.number}.\n\nTermin płatności: ${new Date(sendDialog.invoice.dueDate).toLocaleDateString('pl-PL')}\n\nPozdrawiamy,\nAutoSzkoła Drive`}
                />
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  Faktura w formacie PDF zostanie dołączona automatycznie
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialog({ open: false, invoice: null })}>
              Anuluj
            </Button>
            <Button onClick={sendInvoice}>
              <Send className="w-4 h-4 mr-2" />
              Wyślij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}