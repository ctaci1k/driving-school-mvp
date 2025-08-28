// app/[locale]/auth/login/page.tsx
// Сторінка входу з перемикачем мов

'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Loader2, Mail, Lock, Eye, EyeOff, Globe, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/lib/toast'

// Типи
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

interface Language {
  code: string
  name: string
  flag: string
}

// Константи
const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
]

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('auth.login')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: `/${locale}`,
        rememberMe: data.rememberMe
      })
      
      if (result?.error) {
        setError(t('invalidCredentials'))
        toast.error(t('invalidCredentials'))
      } else {
        if (data.rememberMe) {
          localStorage.setItem('rememberUser', data.email)
        } else {
          localStorage.removeItem('rememberUser')
        }
        
        toast.success(t('loginSuccess'))
        router.push(`/${locale}`)
        router.refresh()
      }
    } catch (error) {
      setError(t('somethingWentWrong'))
      toast.error(t('somethingWentWrong'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (newLocale: string) => {
    setIsChangingLanguage(true)
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
    router.refresh()
  }

  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === locale) || AVAILABLE_LANGUAGES[0]
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      {/* Language Switcher - Fixed Position */}
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

      {/* Login Card */}
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
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t('email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="pl-10"
                  disabled={isLoading}
                  autoComplete="email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t('password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="current-password"
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => {
                    setRememberMe(checked as boolean)
                    register('rememberMe').onChange({
                      target: { value: checked }
                    })
                  }}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('rememberMe')}
                </Label>
              </div>
              
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loggingIn')}
                </>
              ) : (
                t('login')
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('or')}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => toast.info('Google login coming soon')}
              >
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => toast.info('Facebook login coming soon')}
              >
                Facebook
              </Button>
            </div>
          </CardContent>
        </form>
        
        <CardFooter>
          <div className="w-full text-center text-sm">
            {t('dontHaveAccount')}{' '}
            <Link
              href={`/${locale}/auth/register`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              {t('signUp')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}