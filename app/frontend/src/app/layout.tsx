import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import {
  Bai_Jamjuree as BaiJamjuree,
  Sofia_Sans as Sofia,
} from 'next/font/google'
import './globals.css'

const sofia = Sofia({
  subsets: ['latin'],
  variable: '--sofia-sans',
})

const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  variable: '--bai-jamjuree',
  weight: '700',
})

export const metadata: Metadata = {
  title: 'Queue',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sofia.variable} ${baiJamjuree.variable} ${cn(
          'min-h-screen w-full bg-background font-sofia antialiased',
        )}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
