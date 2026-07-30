'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'

/**
 * Client-side providers for the frontend. next-themes manages the .dark
 * class on <html>: saved choice → localStorage('theme'), default → OS
 * preference, applied pre-paint (no flash), zero hydration warnings.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      {children}
    </ThemeProvider>
  )
}
