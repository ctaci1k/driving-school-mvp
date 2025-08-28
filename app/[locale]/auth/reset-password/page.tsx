// app/[locale]/(auth)/reset-password/page.tsx
// Сторінка скидання паролю з перемикачем мов

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
  ShieldCheck,
  Globe,
  Check
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Типи
interface Language {
  code: string
  name: string
  flag: string
}

// Константи
const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations('auth.resetPassword')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)
  
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

  const handleLanguageChange = (newLocale: string) => {
    setIsChangingLanguage(true)
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    // Preserve the token query parameter
    const url = new URL(window.location.href)
    url.pathname = newPath
    if (token) {
      url.searchParams.set('token', token)
    }
    
    router.push(url.pathname + url.search)
    router.refresh()
  }

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === locale) || AVAILABLE_LANGUAGES[0]
  
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

  // Language Switcher Component
  const LanguageSwitcher = () => (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
            disabled={isChangingLanguage}
          >
            {isChangingLanguage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="mr-1">{currentLanguage.flag}</span>
                <span className="hidden sm:inline-block text-gray-700 dark:text-gray-300">
                  {currentLanguage.name}
                </span>
                <span className="sm:hidden text-gray-700 dark:text-gray-300">
                  {currentLanguage.code.toUpperCase()}
                </span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          {AVAILABLE_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
              disabled={isChangingLanguage}
            >
              <span className="mr-2">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {language.code === locale && (
                <Check className="h-4 w-4 ml-2 text-green-600 dark:text-green-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
  
  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
        <LanguageSwitcher />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
        <LanguageSwitcher />
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      <LanguageSwitcher />
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
                  autoComplete="new-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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