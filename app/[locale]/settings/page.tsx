// app/[locale]/settings/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Navigation } from '@/components/layouts/navigation'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('user')
  const tCommon = useTranslations('common')
  
  const [language, setLanguage] = useState('pl')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)

  const { data: userSettings } = trpc.user.getSettings.useQuery()
  
  const updateSettings = trpc.user.updateSettings.useMutation({
    onSuccess: () => {
      toast.success(t('settingsSaved'))
      if (language !== locale) {
        router.push(`/${language}/settings`)
      }
    }
  })

  useEffect(() => {
    if (userSettings) {
      setLanguage(userSettings.language)
      setEmailNotifications(userSettings.emailNotifications)
      setSmsNotifications(userSettings.smsNotifications)
    }
  }, [userSettings])

  const handleSave = () => {
    updateSettings.mutate({
      language,
      emailNotifications,
      smsNotifications
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('settings')}</h1>
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t('preferences')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
              >
                <option value="pl">Polski</option>
                <option value="uk">Українська</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">{t('emailNotifications')}</Label>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notif">{t('smsNotifications')}</Label>
              <Switch
                id="sms-notif"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <Button 
              onClick={handleSave}
              disabled={updateSettings.isLoading}
              className="w-full"
            >
              {updateSettings.isLoading ? t('saving') : tCommon('save')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}