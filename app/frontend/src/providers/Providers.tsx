import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme-provider'

import QueryProvider from './QueryProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <QueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}
