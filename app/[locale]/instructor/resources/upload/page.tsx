// /app/[locale]/instructor/resources/upload/page.tsx

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, File, X, ChevronLeft, Save, Eye,
  FileText, Video, Image as ImageIcon, Music,
  Archive, AlertCircle, CheckCircle, Loader2,
  Cloud, FolderOpen, Link2, Info, Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

export default function UploadResourcePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file')

  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    targetAudience: [] as string[],
    isPublic: true,
    allowDownload: true,
    requireCompletion: false,
    expiryDate: '',
    url: '',
    notes: ''
  })

  // Categories
  const categories = [
    { value: 'teoria', label: 'Teoria', icon: '📚' },
    { value: 'praktyka', label: 'Praktyka', icon: '🚗' },
    { value: 'testy', label: 'Testy', icon: '✏️' },
    { value: 'prezentacje', label: 'Prezentacje', icon: '📊' },
    { value: 'filmy', label: 'Filmy instruktażowe', icon: '📹' },
    { value: 'dokumenty', label: 'Dokumenty', icon: '📄' },
    { value: 'dodatkowe', label: 'Materiały dodatkowe', icon: '📎' }
  ]

  // Popular tags
  const popularTags = [
    'egzamin', 'teoria', 'praktyka', 'parkowanie', 'manewry',
    'znaki drogowe', 'przepisy', 'pierwsza pomoc', 'bezpieczeństwo',
    'kategoria B', 'plac manewrowy', 'miasto', 'trasa'
  ]

  // Target audiences
  const targetAudiences = [
    { value: 'beginners', label: 'Początkujący' },
    { value: 'intermediate', label: 'Średnio zaawansowani' },
    { value: 'advanced', label: 'Zaawansowani' },
    { value: 'exam', label: 'Przygotowanie do egzaminu' },
    { value: 'all', label: 'Wszyscy' }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Auto-fill title if empty
      if (!resourceData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '')
        setResourceData(prev => ({ ...prev, title: fileName }))
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadedFile(files[0])
      if (!resourceData.title) {
        const fileName = files[0].name.replace(/\.[^/.]+$/, '')
        setResourceData(prev => ({ ...prev, title: fileName }))
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
  }

  const toggleTag = (tag: string) => {
    setResourceData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleUpload = async () => {
    setIsUploading(true)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('Uploading resource:', {
      file: uploadedFile,
      ...resourceData
    })
    
    setTimeout(() => {
      router.push('/instructor/resources')
    }, 1000)
  }

  const isFormValid = () => {
    const hasContent = uploadMethod === 'file' ? uploadedFile !== null : resourceData.url !== ''
    return resourceData.title && 
           resourceData.description && 
           resourceData.category && 
           hasContent
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (type.includes('video')) return <Video className="w-8 h-8 text-blue-500" />
    if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-green-500" />
    if (type.includes('audio')) return <Music className="w-8 h-8 text-purple-500" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-8 h-8 text-orange-500" />
    return <File className="w-8 h-8 text-gray-500" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dodaj materiał</h1>
          <p className="text-gray-600">Udostępnij materiały edukacyjne studentom</p>
        </div>
      </div>

      {/* Upload Method */}
      <Card>
        <CardHeader>
          <CardTitle>Metoda przesyłania</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={uploadMethod} onValueChange={(value: 'file' | 'link') => setUploadMethod(value)}>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="file" />
              <Upload className="w-5 h-5" />
              <div>
                <p className="font-medium">Prześlij plik</p>
                <p className="text-sm text-gray-500">Wgraj plik z dysku</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="link" />
              <Link2 className="w-5 h-5" />
              <div>
                <p className="font-medium">Podaj link</p>
                <p className="text-sm text-gray-500">YouTube, Google Drive, etc.</p>
              </div>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* File Upload or Link Input */}
      {uploadMethod === 'file' ? (
        <Card>
          <CardHeader>
            <CardTitle>Wybierz plik</CardTitle>
            <CardDescription>
              Maksymalny rozmiar: 500 MB. Formaty: PDF, DOC, PPT, XLS, MP4, JPG, PNG
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Przeciągnij plik tutaj lub kliknij, aby wybrać
                </p>
                <Button variant="outline">Wybierz plik</Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.jpg,.jpeg,.png"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {getFileIcon(uploadedFile)}
                  <div className="flex-1">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {isUploading && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Przesyłanie...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Adres URL</CardTitle>
            <CardDescription>
              Podaj link do materiału (YouTube, Google Drive, itp.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="https://..."
              value={resourceData.url}
              onChange={(e) => setResourceData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full"
            />
          </CardContent>
        </Card>
      )}

      {/* Resource Details */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły materiału</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tytuł *</Label>
            <Input
              value={resourceData.title}
              onChange={(e) => setResourceData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="np. Kodeks drogowy 2024"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Opis *</Label>
            <Textarea
              value={resourceData.description}
              onChange={(e) => setResourceData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Opisz zawartość materiału..."
              className="mt-2 h-24"
            />
          </div>

          <div>
            <Label>Kategoria *</Label>
            <Select 
              value={resourceData.category}
              onValueChange={(value) => setResourceData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tagi</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularTags.map(tag => (
                <Badge
                  key={tag}
                  variant={resourceData.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {resourceData.tags.includes(tag) && '✓ '}
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Grupa docelowa</Label>
            <div className="space-y-2 mt-2">
              {targetAudiences.map(audience => (
                <label key={audience.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={resourceData.targetAudience.includes(audience.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setResourceData(prev => ({
                          ...prev,
                          targetAudience: [...prev.targetAudience, audience.value]
                        }))
                      } else {
                        setResourceData(prev => ({
                          ...prev,
                          targetAudience: prev.targetAudience.filter(a => a !== audience.value)
                        }))
                      }
                    }}
                  />
                  <span className="text-sm">{audience.label}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ustawienia dostępności</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Publiczny materiał</Label>
              <p className="text-sm text-gray-500">Wszyscy studenci będą mogli zobaczyć ten materiał</p>
            </div>
            <Switch
              checked={resourceData.isPublic}
              onCheckedChange={(checked) => setResourceData(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Pozwól na pobieranie</Label>
              <p className="text-sm text-gray-500">Studenci będą mogli pobrać materiał</p>
            </div>
            <Switch
              checked={resourceData.allowDownload}
              onCheckedChange={(checked) => setResourceData(prev => ({ ...prev, allowDownload: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Wymagaj ukończenia</Label>
              <p className="text-sm text-gray-500">Oznacz jako obowiązkowy do przejrzenia</p>
            </div>
            <Switch
              checked={resourceData.requireCompletion}
              onCheckedChange={(checked) => setResourceData(prev => ({ ...prev, requireCompletion: checked }))}
            />
          </div>

          <div>
            <Label>Data wygaśnięcia (opcjonalne)</Label>
            <Input
              type="date"
              value={resourceData.expiryDate}
              onChange={(e) => setResourceData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Dodatkowe uwagi</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resourceData.notes}
            onChange={(e) => setResourceData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Instrukcje dla studentów, wskazówki, itp..."
            className="h-24"
          />
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Po dodaniu materiał będzie natychmiast dostępny dla studentów zgodnie z wybranymi ustawieniami.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isUploading}
        >
          Anuluj
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled={!isFormValid() || isUploading}>
            <Eye className="w-4 h-4 mr-2" />
            Podgląd
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!isFormValid() || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Przesyłanie...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Zapisz materiał
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}