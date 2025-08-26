// lib/i18n/client.ts

'use client'

import { useTranslations } from 'next-intl'

export function useT() {
  const tCommon = useTranslations('common')
  const tAuth = useTranslations('auth')
  const tNav = useTranslations('navigation')
  const tBooking = useTranslations('booking')
  const tReports = useTranslations('reports')
  const tPayment = useTranslations('payment')
  const tUser = useTranslations('user')
  const tMessages = useTranslations('messages')

  return {
    common: tCommon,
    auth: tAuth,
    nav: tNav,
    booking: tBooking,
    reports: tReports,
    payment: tPayment,
    user: tUser,
    messages: tMessages
  }
}