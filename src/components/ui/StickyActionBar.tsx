import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * The persistent bottom action bar used on recipe, procurement and cart.
 * Sits above the mobile bottom nav and respects the home-indicator inset.
 */
export function StickyActionBar({
  children,
  className,
  raised,
}: {
  children: ReactNode
  className?: string
  /** Lift above the mobile bottom nav (56px). */
  raised?: boolean
}) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      className={cn(
        // Near-opaque: a translucent bar over a dense ingredient list reads as
        // a rendering glitch, not as depth.
        'fixed inset-x-0 z-30 border-t border-line bg-paper/98 shadow-bar backdrop-blur-xl',
        raised ? 'bottom-14 sm:bottom-0' : 'bottom-0',
        className,
      )}
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {children}
      </div>
    </motion.div>
  )
}
