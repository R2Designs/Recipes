import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import logoFull from '@/assets/logo/logo-full.svg'
import dosa from '@/assets/splash/dosa.webp'
import pasta from '@/assets/splash/pasta.webp'
import salad from '@/assets/splash/salad.webp'
import pavbhaji from '@/assets/splash/pavbhaji.webp'

/**
 * Opening title sequence.
 *
 * Four dishes settle into the corners, the wordmark and loader hold for a beat,
 * then everything leaves the way it came in — each dish flying out through its
 * own corner while the type dissolves — revealing the homepage underneath.
 *
 * Skippable by click or key, and skipped entirely under `prefers-reduced-motion`,
 * because a 2.5s gate on the front door is only charming the first few times.
 */

const HOLD_MS = 2000
const EXIT_MS = 750

interface Dish {
  src: string
  alt: string
  /** Resting position. */
  rest: string
  /** Direction it enters from and exits toward, as a fraction of its own size. */
  vector: { x: number; y: number }
  rotate: number
}

const DISHES: Dish[] = [
  {
    src: dosa,
    alt: '',
    // Mobile rests pulled in toward the vertical centre — a tall, narrow
    // viewport has nowhere near as much corner room as a landscape one, and
    // pinning to the true corners leaves a dead band above/below the type.
    rest: 'top-[8%] left-[-20%] w-[58vw] sm:top-[-9%] sm:left-[-7%] sm:w-[34vw] sm:max-w-[440px]',
    vector: { x: -0.85, y: -0.6 },
    rotate: -12,
  },
  {
    src: pasta,
    alt: '',
    rest: 'top-[6%] right-[-24%] w-[54vw] sm:top-[-10%] sm:right-[-6%] sm:w-[32vw] sm:max-w-[420px]',
    vector: { x: 0.9, y: -0.55 },
    rotate: 10,
  },
  {
    src: salad,
    alt: '',
    rest: 'bottom-[10%] left-[-26%] w-[54vw] sm:bottom-[-12%] sm:left-[-8%] sm:w-[31vw] sm:max-w-[410px]',
    vector: { x: -0.9, y: 0.6 },
    rotate: 8,
  },
  {
    src: pavbhaji,
    alt: '',
    rest: 'bottom-[7%] right-[-18%] w-[48vw] sm:bottom-[-9%] sm:right-[-4%] sm:w-[26vw] sm:max-w-[340px]',
    vector: { x: 0.85, y: 0.65 },
    rotate: -9,
  },
]

export function Splash({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)

  /**
   * `?splash=hold` freezes the sequence at its resting frame and disables the
   * auto-exit — for working on the composition without reloading to catch a
   * 2-second window each time.
   */
  const hold =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('splash') === 'hold'

  // Reduced motion: don't animate, don't gate. Straight to the app.
  useEffect(() => {
    if (reduced && !hold) onDone()
  }, [reduced, hold, onDone])

  useEffect(() => {
    if (reduced || hold) return
    const t = window.setTimeout(() => setLeaving(true), HOLD_MS)
    return () => window.clearTimeout(t)
  }, [reduced, hold])

  /**
   * Backstop: if the tab is backgrounded (app-switch, notification, a
   * screen-recording tool) partway through, `requestAnimationFrame` pauses —
   * which stalls Motion's exit animation and the `onExitComplete` callback it
   * drives. Without this, `onDone` would never fire and the intro would trap
   * the user behind it indefinitely. Comfortably longer than the real
   * animation ever takes, so it never fires in the normal case.
   */
  useEffect(() => {
    if (reduced || hold) return
    const t = window.setTimeout(onDone, HOLD_MS + EXIT_MS + 1500)
    return () => window.clearTimeout(t)
  }, [reduced, hold, onDone])

  // Let people out early — but not instantly. Focus events and stray clicks
  // land in the first few hundred ms of a page load, and killing the intro on
  // one of those looks like a bug rather than a shortcut.
  useEffect(() => {
    if (reduced || hold) return
    let armed = false
    const arm = window.setTimeout(() => {
      armed = true
    }, 700)

    const skip = (e: Event) => {
      if (armed && e.isTrusted) setLeaving(true)
    }

    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(arm)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [reduced, hold])

  if (reduced && !hold) return null

  /** At rest: what every animated element settles to. */
  const atRest = { x: '0%', y: '0%', opacity: 1, rotate: 0, scale: 1 }

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] overflow-hidden bg-paper"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: EXIT_MS / 1000 - 0.35 }}
        >
          {DISHES.map((dish, i) => (
            <motion.img
              key={dish.src}
              src={dish.src}
              alt={dish.alt}
              aria-hidden
              draggable={false}
              className={`absolute select-none ${dish.rest}`}
              initial={
                hold
                  ? atRest
                  : {
                      x: `${dish.vector.x * 105}%`,
                      y: `${dish.vector.y * 105}%`,
                      opacity: 0,
                      rotate: dish.rotate * 1.8,
                      scale: 0.92,
                    }
              }
              animate={atRest}
              exit={{
                x: `${dish.vector.x * 115}%`,
                y: `${dish.vector.y * 115}%`,
                rotate: dish.rotate,
                scale: 0.96,
                opacity: 0.85,
              }}
              transition={{
                duration: leaving ? EXIT_MS / 1000 : 1.05,
                delay: leaving ? i * 0.05 : i * 0.09,
                ease: leaving ? [0.5, 0, 0.75, 0] : [0.16, 1, 0.3, 1],
              }}
            />
          ))}

          {/* ── Centre ─────────────────────────────────── */}
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="flex flex-col items-center">
              <motion.img
                src={logoFull}
                alt="Recipes"
                className="h-[clamp(4.5rem,18vw,11rem)] w-auto"
                initial={hold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.97 }}
                transition={{ duration: leaving ? 0.4 : 0.85, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.p
                className="mt-3 text-center text-[clamp(0.9375rem,2.6vw,1.5rem)] text-ink-mute"
                initial={hold ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{
                  duration: leaving ? 0.32 : 0.7,
                  delay: leaving ? 0 : 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                whats cooking today
              </motion.p>

              {/* Loader */}
              <motion.div
                className="mt-10 h-[5px] w-[clamp(140px,26vw,260px)] overflow-hidden rounded-pill bg-sunk-deep sm:mt-14"
                initial={hold ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: leaving ? 0.28 : 0.5, delay: leaving ? 0 : 0.35 }}
              >
                <motion.div
                  className="h-full rounded-pill bg-saffron-deep"
                  initial={{ width: hold ? '38%' : '0%' }}
                  animate={{ width: hold ? '38%' : '100%' }}
                  transition={{ duration: HOLD_MS / 1000 - 0.25, ease: [0.32, 0.7, 0.4, 1] }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
