// app/[locale]/student/documents/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  type: 'driving_license' | 'id' | 'medical' | 'invoice' | 'contract' | 'certificate' | 'other';
  category: string;
  size: number;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending' | 'rejected';
  verified: boolean;
  url: string;
  thumbnailUrl?: string;
  description?: string;
}

export default function StudentDocumentsPage() {
  const router = useRouter();
  const t = useTranslations('student.documents');
  
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

  const documentTypeLabels = {
    driving_license: { label: t('types.drivingLicense'), icon: CreditCard, color: 'blue' },
    id: { label: t('types.id'), icon: Shield, color: 'purple' },
    medical: { label: t('types.medical'), icon: FileText, color: 'green' },
    invoice: { label: t('types.invoice'), icon: File, color: 'orange' },
    contract: { label: t('types.contract'), icon: FileText, color: 'indigo' },
    certificate: { label: t('types.certificate'), icon: GraduationCap, color: 'pink' },
    other: { label: t('types.other'), icon: File, color: 'gray' }
  };

  useEffect(() => {
    // Mock data
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: t('types.drivingLicense'),
        type: 'driving_license',
        category: t('categories.personal'),
        size: 2.5,
        uploadDate: '2024-08-01',
        expiryDate: '2029-08-01',
        status: 'active',
        verified: true,
        url: '/documents/driving-license.pdf',
        description: t('descriptions.drivingLicense')
      },
      {
        id: '2',
        name: t('types.id'),
        type: 'id',
        category: t('categories.personal'),
        size: 1.8,
        uploadDate: '2024-08-01',
        expiryDate: '2028-12-31',
        status: 'active',
        verified: true,
        url: '/documents/id.pdf',
        description: t('descriptions.id')
      },
      {
        id: '3',
        name: t('types.medical'),
        type: 'medical',
        category: t('categories.medical'),
        size: 0.8,
        uploadDate: '2024-07-15',
        expiryDate: '2025-07-15',
        status: 'active',
        verified: false,
        url: '/documents/medical.pdf',
        description: t('descriptions.medical')
      },
      {
        id: '4',
        name: 'INV/2024/08/001',
        type: 'invoice',
        category: t('categories.financial'),
        size: 0.3,
        uploadDate: '2024-08-20',
        status: 'active',
        verified: true,
        url: '/documents/invoice-001.pdf',
        description: t('descriptions.invoice', { count: 10 })
      },
      {
        id: '5',
        name: t('types.contract'),
        type: 'contract',
        category: t('categories.contracts'),
        size: 1.2,
        uploadDate: '2024-06-01',
        status: 'active',
        verified: true,
        url: '/documents/contract.pdf',
        description: t('descriptions.contract')
      },
      {
        id: '6',
        name: t('types.certificate'),
        type: 'certificate',
        category: t('categories.certificates'),
        size: 0.5,
        uploadDate: '2024-07-30',
        status: 'active',
        verified: true,
        url: '/documents/certificate.pdf',
        description: t('descriptions.certificate')
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      const totalSize = mockDocuments.reduce((acc, doc) => acc + doc.size, 0);
      setStorageUsed(totalSize);
      setLoading(false);
    }, 1000);
  }, [t]);

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
      title: t('toast.documentDeleted'),
      description: t('toast.documentDeletedDescription'),
    });
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return t('fileSize.kb', { size: (sizeInMB * 1024).toFixed(0) });
    }
    return t('fileSize.mb', { size: sizeInMB.toFixed(1) });
  };

  const getStatusBadge = (status: Document['status']) => {
    const variants = {
      active: { label: t('status.active'), className: 'bg-green-100 text-green-700' },
      expired: { label: t('status.expired'), className: 'bg-red-100 text-red-700' },
      pending: { label: t('status.pending'), className: 'bg-yellow-100 text-yellow-700' },
      rejected: { label: t('status.rejected'), className: 'bg-gray-100 text-gray-700' }
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
    expired: documents.filter(d => d.status === 'expired').length
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
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button onClick={() => router.push('/student/documents/upload')}>
          <Upload className="w-4 h-4 mr-2" />
          {t('addDocument')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('stats.allDocuments')}
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
              {t('stats.verified')}
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
              {t('stats.expiring')}
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
              {t('stats.expired')}
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
              {t('stats.storageUsed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatFileSize(storageUsed)}</span>
                <span className="text-muted-foreground">{t('fileSize.limit', { limit: storageLimit })}</span>
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
            {t('alert.expiringDocuments', { count: documentStats.expiring })}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('title')}</CardTitle>
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
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filters.typeFilter.label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.typeFilter.all')}</SelectItem>
                <SelectItem value="driving_license">{t('types.drivingLicense')}</SelectItem>
                <SelectItem value="id">{t('types.id')}</SelectItem>
                <SelectItem value="medical">{t('types.medical')}</SelectItem>
                <SelectItem value="invoice">{t('types.invoice')}</SelectItem>
                <SelectItem value="contract">{t('types.contract')}</SelectItem>
                <SelectItem value="certificate">{t('types.certificate')}</SelectItem>
                <SelectItem value="other">{t('types.other')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filters.statusFilter.label')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.statusFilter.all')}</SelectItem>
                <SelectItem value="active">{t('filters.statusFilter.active')}</SelectItem>
                <SelectItem value="expired">{t('filters.statusFilter.expired')}</SelectItem>
                <SelectItem value="pending">{t('filters.statusFilter.pending')}</SelectItem>
                <SelectItem value="rejected">{t('filters.statusFilter.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('empty.noDocuments')}</p>
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
                                {t('actions.preview')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                {t('actions.download')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                {t('actions.share')}
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
                                {t('actions.delete')}
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
                              {t('details.verified')}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>{t('details.size')}:</span>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('details.added')}:</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString('uk-UA')}</span>
                          </div>
                          {doc.expiryDate && (
                            <div className="flex justify-between">
                              <span>{t('details.expires')}:</span>
                              <span className={
                                new Date(doc.expiryDate) < new Date() ? 'text-red-600' : ''
                              }>
                                {new Date(doc.expiryDate).toLocaleDateString('uk-UA')}
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
                  <TableHead>{t('types.other')}</TableHead>
                  <TableHead>{t('filters.typeFilter.label')}</TableHead>
                  <TableHead>{t('filters.statusFilter.label')}</TableHead>
                  <TableHead>{t('details.size')}</TableHead>
                  <TableHead>{t('details.added')}</TableHead>
                  <TableHead>{t('details.expires')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">{t('empty.noDocuments')}</p>
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
                        <TableCell>{new Date(doc.uploadDate).toLocaleDateString('uk-UA')}</TableCell>
                        <TableCell>
                          {doc.expiryDate ? (
                            <span className={
                              new Date(doc.expiryDate) < new Date() ? 'text-red-600' : ''
                            }>
                              {new Date(doc.expiryDate).toLocaleDateString('uk-UA')}
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
                                {t('actions.preview')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                {t('actions.download')}
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
                                {t('actions.delete')}
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
            <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('deleteDialog.description', { name: documentToDelete?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('deleteDialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
            >
              {t('deleteDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}