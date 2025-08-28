// app/[locale]/student/documents/upload/page.tsx

'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Upload,
  FileText,
  X,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  File,
  Image,
  Loader2,
  Calendar,
  Shield,
  CreditCard,
  GraduationCap,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface UploadFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function DocumentsUploadPage() {
  const router = useRouter();
  const t = useTranslations('student.documentsUpload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const documentTypes = [
    { 
      value: 'driving_license', 
      label: t('documentType.types.drivingLicense.label'), 
      icon: CreditCard,
      description: t('documentType.types.drivingLicense.description'),
      required: true 
    },
    { 
      value: 'id', 
      label: t('documentType.types.id.label'), 
      icon: Shield,
      description: t('documentType.types.id.description'),
      required: true 
    },
    { 
      value: 'medical', 
      label: t('documentType.types.medical.label'), 
      icon: FileText,
      description: t('documentType.types.medical.description'),
      required: false 
    },
    { 
      value: 'certificate', 
      label: t('documentType.types.certificate.label'), 
      icon: GraduationCap,
      description: t('documentType.types.certificate.description'),
      required: false 
    },
    { 
      value: 'contract', 
      label: t('documentType.types.contract.label'), 
      icon: FileText,
      description: t('documentType.types.contract.description'),
      required: false 
    },
    { 
      value: 'other', 
      label: t('documentType.types.other.label'), 
      icon: File,
      description: t('documentType.types.other.description'),
      required: false 
    }
  ];

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const acceptedFiles = Array.from(fileList).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidSize) {
        toast({
          title: t('toast.error'),
          description: t('errors.fileTooBig', { name: file.name }),
          variant: "destructive"
        });
        return false;
      }
      
      if (!isImage && !isPDF) {
        toast({
          title: t('toast.error'),
          description: t('errors.invalidFormat', { name: file.name }),
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedType) {
      toast({
        title: t('toast.error'),
        description: t('errors.selectType'),
        variant: "destructive"
      });
      return;
    }

    if (!documentName) {
      toast({
        title: t('toast.error'),
        description: t('errors.enterName'),
        variant: "destructive"
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: t('toast.error'),
        description: t('errors.addFiles'),
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload progress
    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, status: 'uploading' } : f
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, progress } : f
        ));
      }

      setFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, status: 'success', progress: 100 } : f
      ));
    }

    setIsUploading(false);
    setUploadComplete(true);

    toast({
      title: t('toast.success'),
      description: t('toast.documentsUploaded')
    });

    setTimeout(() => {
      router.push('/student/documents');
    }, 2000);
  };

  const selectedTypeInfo = documentTypes.find(t => t.value === selectedType);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return t('upload.fileSize.bytes', { size: bytes });
    if (bytes < 1024 * 1024) return t('upload.fileSize.kb', { size: (bytes / 1024).toFixed(1) });
    return t('upload.fileSize.mb', { size: (bytes / (1024 * 1024)).toFixed(1) });
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('success.title')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('success.description')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('success.redirecting')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Document Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>{t('documentType.title')}</CardTitle>
          <CardDescription>
            {t('documentType.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedType} onValueChange={setSelectedType}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map(type => {
                const Icon = type.icon;
                return (
                  <div key={type.value} className="relative">
                    <RadioGroupItem
                      value={type.value}
                      id={type.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.value}
                      className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{type.label}</p>
                          {type.required && (
                            <Badge variant="secondary" className="text-xs">
                              {t('documentType.required')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Document Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('details.title')}</CardTitle>
          <CardDescription>
            {t('details.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('details.documentName.label')}</Label>
            <Input
              id="name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={selectedTypeInfo ? selectedTypeInfo.label : t('details.documentName.placeholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('details.documentDescription.label')}</Label>
            <Textarea
              id="description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder={t('details.documentDescription.placeholder')}
              rows={3}
            />
          </div>

          {(selectedType === 'driving_license' || selectedType === 'id' || selectedType === 'medical') && (
            <div className="space-y-2">
              <Label htmlFor="expiry">{t('details.expiryDate.label')}</Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>{t('upload.title')}</CardTitle>
          <CardDescription>
            {t('upload.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">{t('upload.dropzone.dragActive')}</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-1">
                  {t('upload.dropzone.dragInactive')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('upload.dropzone.supportedFormats')}
                </p>
              </>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">{t('upload.selectedFiles', { count: files.length })}</h4>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file.size)}
                      </p>
                    </div>
                  </div>

                  {file.status === 'pending' && !isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  {file.status === 'uploading' && (
                    <div className="w-24">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}

                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <FileCheck className="h-4 w-4" />
        <AlertDescription>
          {t('info.verification')}
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isUploading}
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0 || !selectedType || !documentName}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('buttons.uploading')}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {t('buttons.upload')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}