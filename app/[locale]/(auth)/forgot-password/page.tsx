// app/[locale]/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { 
  Loader2, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('auth.forgotPassword')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })
  
  const email = watch('email')
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send reset email')
      }
      
      setIsSuccess(true)
    } catch (error: any) {
      setError(error.message || t('somethingWentWrong'))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t('emailSent')}
            </CardTitle>
            <CardDescription className="mt-2">
              {t('checkEmailMessage', { email })}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('importantNote')}</AlertTitle>
              <AlertDescription>
                {t('checkSpamFolder')}
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              {t('emailExpiresIn')}
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              {t('resendEmail')}
            </Button>
            
            <Link
              href={`/${locale}/auth/login`}
              className="w-full"
            >
              <Button variant="default" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToLogin')}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('description')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="pl-10"
                  disabled={isLoading}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                t('sendResetLink')
              )}
            </Button>
          </CardContent>
        </form>
        
        <CardFooter>
          <div className="w-full text-center space-y-2">
            <Link
              href={`/${locale}/auth/login`}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              {t('backToLogin')}
            </Link>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('dontHaveAccount')}{' '}
              <Link
                href={`/${locale}/auth/register`}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
              >
                {t('signUp')}
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}