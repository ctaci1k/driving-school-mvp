// /app/[locale]/instructor/profile/documents/page.tsx

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Upload, Download, Eye, Trash2, Edit,
  Shield, Award, GraduationCap, Car, Heart,
  AlertCircle, CheckCircle, XCircle, Clock,
  ChevronLeft, Plus, Search, Filter, MoreVertical,
  Calendar, User, Building, ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format, differenceInDays } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function DocumentsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)

  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'Licencja instruktora',
      type: 'license',
      category: 'required',
      issuer: 'Ministerstwo Infrastruktury',
      number: 'INS/2016/12345',
      issueDate: '2016-02-15',
      expiryDate: '2026-02-15',
      status: 'active',
      fileUrl: '#',
      fileSize: '2.3 MB',
      verified: true
    },
    {
      id: '2',
      name: 'Prawo jazdy kat. B',
      type: 'driving_license',
      category: 'required',
      issuer: 'Urząd Miasta',
      number: 'DL123456789',
      issueDate: '2005-06-20',
      expiryDate: '2030-06-20',
      status: 'active',
      fileUrl: '#',
      fileSize: '1.8 MB',
      verified: true
    },
    {
      id: '3',
      name: 'Zaświadczenie lekarskie',
      type: 'medical',
      category: 'required',
      issuer: 'Centrum Medyczne',
      number: 'MED/2024/0123',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'expiring',
      fileUrl: '#',
      fileSize: '850 KB',
      verified: true
    },
    {
      id: '4',
      name: 'Certyfikat pierwszej pomocy',
      type: 'certificate',
      category: 'additional',
      issuer: 'Polski Czerwony Krzyż',
      number: 'PCK/2022/5678',
      issueDate: '2022-11-20',
      expiryDate: '2024-11-20',
      status: 'expiring',
      fileUrl: '#',
      fileSize: '1.2 MB',
      verified: true
    },
    {
      id: '5',
      name: 'Kurs doskonalenia',
      type: 'certificate',
      category: 'additional',
      issuer: 'Stowarzyszenie Instruktorów',
      number: 'KD/2023/789',
      issueDate: '2023-06-10',
      expiryDate: '2025-06-10',
      status: 'active',
      fileUrl: '#',
      fileSize: '950 KB',
      verified: false
    },
    {
      id: '6',
      name: 'Umowa o pracę',
      type: 'contract',
      category: 'employment',
      issuer: 'Auto Szkoła Warszawa',
      number: 'UM/2016/001',
      issueDate: '2016-03-01',
      expiryDate: null,
      status: 'active',
      fileUrl: '#',
      fileSize: '450 KB',
      verified: true
    },
    {
      id: '7',
      name: 'Polisa OC',
      type: 'insurance',
      category: 'insurance',
      issuer: 'PZU',
      number: 'OC/2024/123456',
      issueDate: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'active',
      fileUrl: '#',
      fileSize: '1.5 MB',
      verified: true
    }
  ]

  // Document categories
  const categories = [
    { value: 'all', label: 'Wszystkie', count: documents.length },
    { value: 'required', label: 'Wymagane', count: 3 },
    { value: 'additional', label: 'Dodatkowe', count: 2 },
    { value: 'employment', label: 'Zatrudnienie', count: 1 },
    { value: 'insurance', label: 'Ubezpieczenia', count: 1 }
  ]

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group documents by status
  const expiringDocuments = documents.filter(doc => doc.status === 'expiring')
  const activeDocuments = documents.filter(doc => doc.status === 'active')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Aktywny</Badge>
      case 'expiring':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Wkrótce wygasa</Badge>
      case 'expired':
        return <Badge variant="destructive">Wygasły</Badge>
      default:
        return null
    }
  }

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null
    const days = differenceInDays(new Date(expiryDate), new Date())
    return days
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'license': return <Shield className="w-5 h-5 text-blue-500" />
      case 'driving_license': return <Car className="w-5 h-5 text-green-500" />
      case 'medical': return <Heart className="w-5 h-5 text-red-500" />
      case 'certificate': return <Award className="w-5 h-5 text-yellow-500" />
      case 'contract': return <FileText className="w-5 h-5 text-purple-500" />
      case 'insurance': return <Shield className="w-5 h-5 text-orange-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingFile(file)
      setShowUploadDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Moje dokumenty</h1>
          <p className="text-gray-600">Zarządzaj certyfikatami i licencjami</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Dodaj dokument
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Dokumenty wymagające uwagi</AlertTitle>
          <AlertDescription>
            Masz {expiringDocuments.length} dokument(y) które wkrótce wygasną. 
            Zadbaj o ich odnowienie.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wszystkie</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aktywne</p>
                <p className="text-2xl font-bold">{activeDocuments.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wygasające</p>
                <p className="text-2xl font-bold">{expiringDocuments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Zweryfikowane</p>
                <p className="text-2xl font-bold">
                  {documents.filter(d => d.verified).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Szukaj dokumentów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
          <TabsList>
            {categories.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label} ({cat.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dokument</TableHead>
                <TableHead>Wystawca</TableHead>
                <TableHead>Numer</TableHead>
                <TableHead>Data wydania</TableHead>
                <TableHead>Data ważności</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.fileSize}</p>
                      </div>
                      {doc.verified && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Zweryfikowany
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{doc.issuer}</TableCell>
                  <TableCell className="font-mono text-sm">{doc.number}</TableCell>
                  <TableCell>{format(new Date(doc.issueDate), 'dd.MM.yyyy')}</TableCell>
                  <TableCell>
                    {doc.expiryDate ? (
                      <div>
                        <p>{format(new Date(doc.expiryDate), 'dd.MM.yyyy')}</p>
                        {doc.status === 'expiring' && (
                          <p className="text-xs text-yellow-600">
                            za {getDaysUntilExpiry(doc.expiryDate)} dni
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-right">
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
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Udostępnij
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edytuj
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowy dokument</DialogTitle>
            <DialogDescription>
              Prześlij dokument i uzupełnij informacje
            </DialogDescription>
          </DialogHeader>
          
          {uploadingFile && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{uploadingFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <Label>Nazwa dokumentu</Label>
                <Input placeholder="np. Licencja instruktora" className="mt-2" />
              </div>

              <div>
                <Label>Typ dokumentu</Label>
                <select className="w-full p-2 border rounded-lg mt-2">
                  <option>Licencja</option>
                  <option>Certyfikat</option>
                  <option>Zaświadczenie</option>
                  <option>Umowa</option>
                  <option>Inne</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data wydania</Label>
                  <Input type="date" className="mt-2" />
                </div>
                <div>
                  <Label>Data ważności</Label>
                  <Input type="date" className="mt-2" />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Anuluj
            </Button>
            <Button onClick={() => setShowUploadDialog(false)}>
              Zapisz dokument
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}