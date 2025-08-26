// components/client-theme-provider.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function ClientThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}