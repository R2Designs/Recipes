import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { IconButton } from './Button'

/**
 * Bottom sheet on mobile, centred dialog on desktop — one component so every
 * overlay in the app behaves the same way on both.
 */
export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the sheet.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className="relative flex max-h-[88dvh] w-full flex-col rounded-t-[24px] bg-paper shadow-pop sm:max-w-lg sm:rounded-card"
          >
            {/* Grab handle — mobile affordance only. */}
            <div className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-pill bg-line sm:hidden" />

            <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 sm:px-6 sm:pt-6">
              <div>
                <h2 className="text-h3 text-ink">{title}</h2>
                {subtitle && <p className="mt-0.5 text-meta text-ink-soft">{subtitle}</p>}
              </div>
              <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
                <X size={18} />
              </IconButton>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>

            {footer && (
              <div className="shrink-0 border-t border-line bg-surface/80 px-5 py-4 sm:px-6">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
