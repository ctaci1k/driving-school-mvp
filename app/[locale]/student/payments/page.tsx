// app/[locale]/student/payments/page.tsx

'use client';

import { useState } from 'react';
import {
  CreditCard,
  Download,
  Filter,
  Search,
  Calendar,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Receipt,
  Wallet,
  Euro,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Share2,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Mock data
const mockPayments = [
  {
    id: 'PAY001',
    date: '2024-08-25',
    time: '14:23',
    description: 'Pakiet Standard - 10 lekcji',
    type: 'package',
    amount: 1800,
    status: 'completed',
    method: 'card',
    cardLast4: '4242',
    invoiceId: 'INV001'
  },
  {
    id: 'PAY002',
    date: '2024-08-20',
    time: '09:15',
    description: 'Pojedyncza lekcja - jazda nocna',
    type: 'single',
    amount: 200,
    status: 'completed',
    method: 'blik',
    invoiceId: 'INV002'
  },
  {
    id: 'PAY003',
    date: '2024-08-15',
    time: '16:45',
    description: 'Pakiet Premium - 20 lekcji',
    type: 'package',
    amount: 3400,
    status: 'completed',
    method: 'transfer',
    invoiceId: 'INV003'
  },
  {
    id: 'PAY004',
    date: '2024-08-10',
    time: '11:30',
    description: 'Opłata za egzamin próbny',
    type: 'exam',
    amount: 150,
    status: 'failed',
    method: 'card',
    cardLast4: '1234',
    invoiceId: null
  },
  {
    id: 'PAY005',
    date: '2024-08-05',
    time: '13:20',
    description: 'Zwrot - anulowana lekcja',
    type: 'refund',
    amount: -180,
    status: 'completed',
    method: 'transfer',
    invoiceId: 'INV004'
  },
  {
    id: 'PAY006',
    date: '2024-07-30',
    time: '10:00',
    description: 'Pakiet Wakacyjny - 5 lekcji',
    type: 'package',
    amount: 850,
    status: 'pending',
    method: 'transfer',
    invoiceId: 'INV005'
  }
];

const monthlyStats = {
  total: 6230,
  lastMonth: 5450,
  pendingAmount: 850,
  activePackages: 2,
  upcomingPayments: [
    { date: '2024-09-01', amount: 1800, description: 'Rata za pakiet' },
    { date: '2024-09-15', amount: 200, description: 'Lekcja dodatkowa' }
  ]
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Opłacone
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Oczekuje
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Niepowodzenie
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'blik':
        return <Wallet className="h-4 w-4" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4" />;
      default:
        return <Euro className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'package':
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case 'single':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'exam':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-orange-500" />;
      default:
        return <Euro className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredPayments = mockPayments.filter(payment => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
    if (filterType !== 'all' && payment.type !== filterType) return false;
    if (searchTerm && !payment.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const percentageChange = ((monthlyStats.total - monthlyStats.lastMonth) / monthlyStats.lastMonth) * 100;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historia płatności</h1>
          <p className="text-gray-600">Zarządzaj swoimi transakcjami i fakturami</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/payments/packages">
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Moje pakiety
            </Button>
          </Link>
          <Link href="/student/payments/buy-package">
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Kup pakiet
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ten miesiąc</p>
                <p className="text-2xl font-bold">{monthlyStats.total} PLN</p>
                <div className="flex items-center gap-1 mt-1">
                  {percentageChange > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">+{percentageChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">{percentageChange.toFixed(1)}%</span>
                    </>
                  )}
                </div>
              </div>
              <Euro className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Oczekujące</p>
                <p className="text-2xl font-bold">{monthlyStats.pendingAmount} PLN</p>
                <p className="text-xs text-gray-500">1 transakcja</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktywne pakiety</p>
                <p className="text-2xl font-bold">{monthlyStats.activePackages}</p>
                <p className="text-xs text-gray-500">32 kredyty pozostało</p>
              </div>
              <Receipt className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Następna płatność</p>
                <p className="text-xl font-bold">1 września</p>
                <p className="text-xs text-gray-500">1800 PLN</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments Alert */}
      {monthlyStats.upcomingPayments.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong className="text-blue-900">Nadchodzące płatności:</strong>
            <div className="mt-2 space-y-1">
              {monthlyStats.upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">{payment.date} - {payment.description}</span>
                  <span className="font-semibold text-blue-900">{payment.amount} PLN</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj płatności..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="completed">Opłacone</SelectItem>
                <SelectItem value="pending">Oczekujące</SelectItem>
                <SelectItem value="failed">Niepowodzenie</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="package">Pakiety</SelectItem>
                <SelectItem value="single">Pojedyncze</SelectItem>
                <SelectItem value="exam">Egzaminy</SelectItem>
                <SelectItem value="refund">Zwroty</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Okres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cały okres</SelectItem>
                <SelectItem value="week">Ten tydzień</SelectItem>
                <SelectItem value="month">Ten miesiąc</SelectItem>
                <SelectItem value="quarter">Ten kwartał</SelectItem>
                <SelectItem value="year">Ten rok</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Eksportuj
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transakcje</CardTitle>
          <CardDescription>
            Znaleziono {filteredPayments.length} transakcji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    payment.type === 'refund' ? 'bg-orange-100' :
                    payment.status === 'completed' ? 'bg-green-100' :
                    payment.status === 'pending' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    {getTypeIcon(payment.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{payment.description}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{payment.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{payment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(payment.method)}
                        <span>
                          {payment.method === 'card' && payment.cardLast4 
                            ? `•••• ${payment.cardLast4}`
                            : payment.method === 'blik' ? 'BLIK'
                            : payment.method === 'transfer' ? 'Przelew'
                            : payment.method
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        ID: {payment.id}
                      </Badge>
                      {payment.invoiceId && (
                        <Badge variant="outline" className="text-xs">
                          Faktura: {payment.invoiceId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      payment.type === 'refund' ? 'text-orange-600' :
                      payment.status === 'failed' ? 'text-red-600' :
                      'text-gray-900'
                    }`}>
                      {payment.type === 'refund' ? '' : '+'}{payment.amount} PLN
                    </p>
                    {payment.status === 'pending' && (
                      <p className="text-xs text-yellow-600">Oczekuje na płatność</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Szczegóły
                      </DropdownMenuItem>
                      {payment.invoiceId && (
                        <Link href={`/student/payments/invoice/${payment.invoiceId}`}>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Zobacz fakturę
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Pobierz PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Udostępnij
                      </DropdownMenuItem>
                      {payment.status === 'pending' && (
                        <DropdownMenuItem className="text-blue-600">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Opłać teraz
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <Euro className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Brak transakcji do wyświetlenia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metody płatności</CardTitle>
          <CardDescription>Zarządzaj zapisanymi metodami płatności</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Wygasa 12/2025</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Domyślna</Badge>
            </div>
            
            <div className="p-4 rounded-lg border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">BLIK</p>
                  <p className="text-sm text-gray-500">Połączono z 48•••••••23</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Usuń</Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <CreditCard className="h-4 w-4 mr-2" />
            Dodaj nową metodę płatności
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}