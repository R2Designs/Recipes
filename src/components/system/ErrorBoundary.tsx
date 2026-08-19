import { Component, type ReactNode } from 'react'
import { CookingPot } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Last-resort safety net. Without this, any uncaught error — anywhere in the
 * tree — unmounts the entire app and leaves a blank page with nothing in the
 * UI to explain why. A blank page with no recovery path is the worst
 * possible failure mode for a demo; this trades it for a page that at least
 * explains itself and offers a way back.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }) {
    console.error('Recipes crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
        <div className="flex max-w-sm flex-col items-center">
          <div className="mb-5 grid size-14 place-items-center rounded-full bg-saffron-wash text-saffron-deep">
            <CookingPot size={24} />
          </div>
          <h1 className="text-h3 text-ink">Something went wrong</h1>
          <p className="mt-2 text-body text-ink-soft">
            This screen hit a snag. Reloading usually fixes it.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    )
  }
}
