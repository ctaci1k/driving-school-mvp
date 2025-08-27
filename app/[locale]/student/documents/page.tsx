// app/[locale]/student/documents/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Upload,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  File,
  Image,
  Shield,
  CreditCard,
  Car,
  GraduationCap,
  Plus,
  MoreVertical,
  FolderOpen,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  name: string;
  type: 'prawo_jazdy' | 'dowod' | 'zaswiadczenie' | 'faktura' | 'umowa' | 'certyfikat' | 'inne';
  category: string;
  size: number;
  uploadDate: string;
  expiryDate?: string;
  status: 'aktywny' | 'wygasly' | 'oczekuje' | 'odrzucony';
  verified: boolean;
  url: string;
  thumbnailUrl?: string;
  description?: string;
}

const documentTypeLabels = {
  prawo_jazdy: { label: 'Prawo jazdy', icon: CreditCard, color: 'blue' },
  dowod: { label: 'Dowód osobisty', icon: Shield, color: 'purple' },
  zaswiadczenie: { label: 'Zaświadczenie', icon: FileText, color: 'green' },
  faktura: { label: 'Faktura', icon: File, color: 'orange' },
  umowa: { label: 'Umowa', icon: FileText, color: 'indigo' },
  certyfikat: { label: 'Certyfikat', icon: GraduationCap, color: 'pink' },
  inne: { label: 'Inne', icon: File, color: 'gray' }
};

export default function StudentDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [storageUsed, setStorageUsed] = useState(0);
  const storageLimit = 100; // MB

  useEffect(() => {
    // Mock data
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Prawo jazdy',
        type: 'prawo_jazdy',
        category: 'Dokumenty osobiste',
        size: 2.5,
        uploadDate: '2024-08-01',
        expiryDate: '2029-08-01',
        status: 'aktywny',
        verified: true,
        url: '/documents/prawo-jazdy.pdf',
        description: 'Prawo jazdy kategorii B'
      },
      {
        id: '2',
        name: 'Dowód osobisty',
        type: 'dowod',
        category: 'Dokumenty osobiste',
        size: 1.8,
        uploadDate: '2024-08-01',
        expiryDate: '2028-12-31',
        status: 'aktywny',
        verified: true,
        url: '/documents/dowod.pdf',
        description: 'Dowód osobisty'
      },
      {
        id: '3',
        name: 'Zaświadczenie lekarskie',
        type: 'zaswiadczenie',
        category: 'Dokumenty medyczne',
        size: 0.8,
        uploadDate: '2024-07-15',
        expiryDate: '2025-07-15',
        status: 'aktywny',
        verified: false,
        url: '/documents/zaswiadczenie.pdf',
        description: 'Zaświadczenie o braku przeciwwskazań'
      },
      {
        id: '4',
        name: 'Faktura FV/2024/08/001',
        type: 'faktura',
        category: 'Finanse',
        size: 0.3,
        uploadDate: '2024-08-20',
        status: 'aktywny',
        verified: true,
        url: '/documents/faktura-001.pdf',
        description: 'Faktura za pakiet 10 lekcji'
      },
      {
        id: '5',
        name: 'Umowa szkolenia',
        type: 'umowa',
        category: 'Umowy',
        size: 1.2,
        uploadDate: '2024-06-01',
        status: 'aktywny',
        verified: true,
        url: '/documents/umowa.pdf',
        description: 'Umowa na kurs prawa jazdy kat. B'
      },
      {
        id: '6',
        name: 'Certyfikat ukończenia kursu teorii',
        type: 'certyfikat',
        category: 'Certyfikaty',
        size: 0.5,
        uploadDate: '2024-07-30',
        status: 'aktywny',
        verified: true,
        url: '/documents/certyfikat.pdf',
        description: 'Certyfikat ukończenia części teoretycznej'
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      const totalSize = mockDocuments.reduce((acc, doc) => acc + doc.size, 0);
      setStorageUsed(totalSize);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
    setStorageUsed(prev => prev - documentToDelete.size);
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
    
    toast({
      title: "Dokument usunięty",
      description: "Dokument został pomyślnie usunięty",
    });
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const getStatusBadge = (status: Document['status']) => {
    const variants = {
      aktywny: { label: 'Aktywny', className: 'bg-green-100 text-green-700' },
      wygasly: { label: 'Wygasły', className: 'bg-red-100 text-red-700' },
      oczekuje: { label: 'Oczekuje', className: 'bg-yellow-100 text-yellow-700' },
      odrzucony: { label: 'Odrzucony', className: 'bg-gray-100 text-gray-700' }
    };
    return variants[status];
  };

  const documentStats = {
    total: documents.length,
    verified: documents.filter(d => d.verified).length,
    expiring: documents.filter(d => {
      if (!d.expiryDate) return false;
      const daysUntilExpiry = Math.floor(
        (new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    expired: documents.filter(d => d.status === 'wygasly').length
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Moje dokumenty</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoimi dokumentami i certyfikatami
          </p>
        </div>
        <Button onClick={() => router.push('/student/documents/upload')}>
          <Upload className="w-4 h-4 mr-2" />
          Dodaj dokument
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie dokumenty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{documentStats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zweryfikowane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{documentStats.verified}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wygasające
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">{documentStats.expiring}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wygasłe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold">{documentStats.expired}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wykorzystana przestrzeń
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatFileSize(storageUsed)}</span>
                <span className="text-muted-foreground">/ {storageLimit} MB</span>
              </div>
              <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {documentStats.expiring > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            Masz {documentStats.expiring} dokument(y) wygasające w ciągu 30 dni. 
            Pamiętaj o ich odnowieniu.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Dokumenty</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Szukaj dokumentów..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Typ dokumentu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie typy</SelectItem>
                <SelectItem value="prawo_jazdy">Prawo jazdy</SelectItem>
                <SelectItem value="dowod">Dowód osobisty</SelectItem>
                <SelectItem value="zaswiadczenie">Zaświadczenie</SelectItem>
                <SelectItem value="faktura">Faktura</SelectItem>
                <SelectItem value="umowa">Umowa</SelectItem>
                <SelectItem value="certyfikat">Certyfikat</SelectItem>
                <SelectItem value="inne">Inne</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="aktywny">Aktywne</SelectItem>
                <SelectItem value="wygasly">Wygasłe</SelectItem>
                <SelectItem value="oczekuje">Oczekujące</SelectItem>
                <SelectItem value="odrzucony">Odrzucone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nie znaleziono dokumentów</p>
                </div>
              ) : (
                filteredDocuments.map(doc => {
                  const typeInfo = documentTypeLabels[doc.type];
                  const TypeIcon = typeInfo.icon;
                  const statusInfo = getStatusBadge(doc.status);
                  
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-primary" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedDocument(doc)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Podgląd
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Pobierz
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Udostępnij
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setDocumentToDelete(doc);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Usuń
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <h3 className="font-semibold mb-1">{doc.name}</h3>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                        )}

                        <div className="flex items-center justify-between mb-3">
                          <Badge className={statusInfo.className}>
                            {statusInfo.label}
                          </Badge>
                          {doc.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Zweryfikowany
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Rozmiar:</span>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dodano:</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString('pl-PL')}</span>
                          </div>
                          {doc.expiryDate && (
                            <div className="flex justify-between">
                              <span>Wygasa:</span>
                              <span className={
                                new Date(doc.expiryDate) < new Date() ? 'text-red-600' : ''
                              }>
                                {new Date(doc.expiryDate).toLocaleDateString('pl-PL')}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rozmiar</TableHead>
                  <TableHead>Data dodania</TableHead>
                  <TableHead>Data ważności</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Nie znaleziono dokumentów</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map(doc => {
                    const typeInfo = documentTypeLabels[doc.type];
                    const statusInfo = getStatusBadge(doc.status);
                    
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {doc.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{typeInfo.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo.className}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                        <TableCell>{new Date(doc.uploadDate).toLocaleDateString('pl-PL')}</TableCell>
                        <TableCell>
                          {doc.expiryDate ? (
                            <span className={
                              new Date(doc.expiryDate) < new Date() ? 'text-red-600' : ''
                            }>
                              {new Date(doc.expiryDate).toLocaleDateString('pl-PL')}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Podgląd
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Pobierz
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setDocumentToDelete(doc);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Usuń
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń dokument</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć dokument "{documentToDelete?.name}"? 
              Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
            >
              Usuń dokument
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}