import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import './pos-totality-theme.css'
import './admin-totality-overrides.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prórrogas y Ajustes | Winston',
  description: 'Gestión de prórrogas y ajustes de pago escolar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeBootstrap = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var d=${JSON.stringify(DEFAULT_THEME)};var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark')t=d;document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(DEFAULT_THEME)});}})();`

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <ThemeProvider>
          <div
            className="pos-totality-theme admin-app-shell"
            data-admin-theme="totality-festival"
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
