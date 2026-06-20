'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

export type HubAccent = 'rose' | 'amber' | 'sky' | 'emerald' | 'violet' | 'indigo'

export type HubNavItem = {
  label: string
  desc: string
  path: string
  accent: HubAccent
  icon: ReactNode
}

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

type HubShellProps = {
  title: string
  subtitle: string
  backHref?: string
  backLabel?: string
  children: ReactNode
}

export function HubShell({
  title,
  subtitle,
  backHref,
  backLabel = 'Volver',
  children,
}: HubShellProps) {
  const router = useRouter()

  return (
    <div className="dashboard-container dashboard-home">
      <div className="dashboard-home-bg" aria-hidden="true" />

      <main className="dashboard-main">
        <div className="dashboard-main-stage">
          <aside className="dashboard-flank dashboard-flank--start">
            <Image
              src="/logos/logo-winston-churchill.png"
              alt="Instituto Winston Churchill"
              width={160}
              height={120}
              className="dashboard-flank-logo"
              priority
            />
            <span className="dashboard-flank-label">Instituto Winston Churchill</span>
          </aside>

          <div className="dashboard-main-center">
            <div className="dashboard-mobile-logos" aria-hidden="true">
              <Image
                src="/logos/logo-winston-churchill.png"
                alt=""
                width={88}
                height={66}
                className="dashboard-mobile-logo"
                priority
              />
              <Image
                src="/logos/logo-winston-educativo.png"
                alt=""
                width={88}
                height={66}
                className="dashboard-mobile-logo"
                priority
              />
            </div>

            <div className="dashboard-heading">
              {backHref ? (
                <button
                  type="button"
                  className="hub-back-btn"
                  onClick={() => router.push(backHref)}
                >
                  ← {backLabel}
                </button>
              ) : null}
              <h1 className="dashboard-title">{title}</h1>
              <p className="dashboard-subtitle">{subtitle}</p>
            </div>

            {children}
          </div>

          <aside className="dashboard-flank dashboard-flank--end">
            <Image
              src="/logos/logo-winston-educativo.png"
              alt="Instituto Educativo Winston"
              width={160}
              height={120}
              className="dashboard-flank-logo"
              priority
            />
            <span className="dashboard-flank-label">Instituto Educativo Winston</span>
          </aside>
        </div>
      </main>
    </div>
  )
}

export function HubNavGrid({ items }: { items: HubNavItem[] }) {
  const router = useRouter()

  return (
    <div className="dashboard-nav-grid">
      {items.map((item) => (
        <div
          key={item.path}
          className="dash-nav-item"
          data-accent={item.accent}
          role="button"
          tabIndex={0}
          onClick={() => router.push(item.path)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') router.push(item.path)
          }}
        >
          <div className="dash-nav-icon">{item.icon}</div>
          <div className="dash-nav-body">
            <h2 className="dash-nav-title">{item.label}</h2>
            <p className="dash-nav-desc">{item.desc}</p>
          </div>
          <div className="dash-nav-arrow" aria-hidden="true">
            <ChevronRight />
          </div>
        </div>
      ))}
    </div>
  )
}

export function HubPlaceholder({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="hub-panel-card">
      <h2 className="hub-panel-title">{title}</h2>
      <p className="hub-panel-hint">{hint}</p>
      <Link className="hub-panel-link" href="/">
        ← Volver al hub de Prórrogas y Ajustes
      </Link>
    </div>
  )
}
