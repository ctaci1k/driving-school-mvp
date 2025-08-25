// app/[locale]/(auth)/reset-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

// Password strength checker
const getPasswordStrength = (password: string): number => {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (password.match(/[a-z]+/)) strength += 25
  if (password.match(/[A-Z]+/)) strength += 25
  if (password.match(/[0-9]+/)) strength += 15
  if (password.match(/[$@#&!]+/)) strength += 10
  return strength
}

const getStrengthColor = (strength: number): string => {
  if (strength <= 25) return 'bg-red-500'
  if (strength <= 50) return 'bg-orange-500'
  if (strength <= 75) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getStrengthText = (strength: number, t: any): string => {
  if (strength <= 25) return t('passwordWeak')
  if (strength <= 50) return t('passwordFair')
  if (strength <= 75) return t('passwordGood')
  return t('passwordStrong')
}

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('auth.resetPassword')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const token = searchParams.get('token')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })
  
  const password = watch('password')
  
  useEffect(() => {
    if (!token) {
      setError(t('invalidToken'))
    }
  }, [token, t])
  
  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password))
    } else {
      setPasswordStrength(0)
    }
  }, [password])
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(t('invalidToken'))
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reset password')
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
              {t('passwordResetSuccess')}
            </CardTitle>
            <CardDescription className="mt-2">
              {t('passwordResetSuccessMessage')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">
                {t('securityTip')}
              </AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                {t('securityTipMessage')}
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter>
            <Link href={`/${locale}/auth/login`} className="w-full">
              <Button className="w-full">
                {t('proceedToLogin')}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // Error state - no token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t('invalidLink')}
            </CardTitle>
            <CardDescription className="mt-2">
              {t('invalidLinkMessage')}
            </CardDescription>
          </CardHeader>
          
          <CardFooter className="flex flex-col space-y-2">
            <Link href={`/${locale}/auth/forgot-password`} className="w-full">
              <Button variant="outline" className="w-full">
                {t('requestNewLink')}
              </Button>
            </Link>
            
            <Link href={`/${locale}/auth/login`} className="w-full">
              <Button className="w-full">
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
              <Label htmlFor="password">{t('newPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('newPasswordPlaceholder')}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              
              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <Progress value={passwordStrength} className="h-2" />
                  <p className={`text-xs ${passwordStrength > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                    {getStrengthText(passwordStrength, t)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirmPasswordPlaceholder')}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                  {t('resetting')}
                </>
              ) : (
                t('resetPassword')
              )}
            </Button>
          </CardContent>
        </form>
        
        <CardFooter>
          <div className="w-full text-center text-sm">
            <Link
              href={`/${locale}/auth/login`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}