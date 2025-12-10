import React from 'react'
import type { Metadata } from 'next'
import './css/globals.css'
import { ThemeProvider } from '@/components/theme-provider'

// Using system fonts for intranet deployment (no Google Fonts access)
const systemFontClass = 'font-sans'

export const metadata: Metadata = {
  title: 'PRICE Dashboard - UF College of Dentistry',
  description: 'Pain Research & Intervention Center of Excellence Dashboard - Internal research data management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      </head>
      <body className={systemFontClass}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
