'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'




export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider
      enableSystem
      attribute='class'
      defaultTheme='system'
      disableTransitionOnChange
    >
     <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  )
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

