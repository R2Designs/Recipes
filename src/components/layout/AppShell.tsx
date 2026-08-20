import type { ReactNode } from 'react'
import logoFull from '@/assets/logo/logo-full.svg'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { IMAGE_CREDIT } from '@/data/images'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-line pb-20 pt-10 sm:pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center">
          <img src={logoFull} alt="Recipes" className="h-6 w-auto" />
        </div>
        <p className="max-w-md text-meta text-ink-mute">
          {IMAGE_CREDIT.note} Photography via{' '}
          <a
            href={IMAGE_CREDIT.url}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-ink-soft"
          >
            {IMAGE_CREDIT.source}
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
