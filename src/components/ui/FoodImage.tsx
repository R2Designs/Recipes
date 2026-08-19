import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Food photography with retry and a designed fallback.
 *
 * Every image URL in the catalogue was visually verified, but they're hotlinked
 * from a CDN we don't control — and loading two dozen at once reliably trips
 * burst throttling, which surfaces as a spurious `error` on a perfectly good
 * URL. So a failure is retried with backoff before we give up.
 *
 * If it does give up, we resolve to a warm gradient tile derived from the dish
 * name — deterministic, so a dish always gets the same tile, and deliberate
 * enough to read as a design choice rather than a broken image.
 */

interface FoodImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  eager?: boolean
  rounded?: string
}

const MAX_RETRIES = 2

function hueFor(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  // Bias into the warm half of the wheel so fallbacks sit inside the palette.
  return 18 + (h % 60)
}

export function FoodImage({ src, alt, className, fill = true, eager, rounded }: FoodImageProps) {
  // `<img src="">` isn't "no image" — an empty src resolves to the current
  // document URL, which wastes a request and behaves inconsistently across
  // browsers. Mock products have no photography at all yet, so treat a blank
  // src as an immediate, deliberate fallback rather than something to retry.
  const hasSrc = src.length > 0
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(hasSrc ? 'loading' : 'failed')
  // Appended as a cache-buster so the retry is a genuinely new request.
  const [attempt, setAttempt] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  const prevSrc = useRef(src)

  // Reset only when the source genuinely changes. Resetting on mount would
  // clobber a `loaded` set by a cached image whose onLoad beat this effect.
  useEffect(() => {
    if (prevSrc.current === src) return
    prevSrc.current = src
    setState(src.length > 0 ? 'loading' : 'failed')
    setAttempt(0)
  }, [src])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /** A cached image can finish loading before React attaches onLoad. */
  function checkCached(node: HTMLImageElement | null) {
    if (node?.complete && node.naturalWidth > 0) setState('loaded')
  }

  function onError() {
    if (attempt < MAX_RETRIES) {
      const delay = 400 * (attempt + 1) + Math.random() * 300
      timer.current = window.setTimeout(() => setAttempt((a) => a + 1), delay)
    } else {
      setState('failed')
    }
  }

  const hue = hueFor(alt)
  const monogram = alt
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn('relative overflow-hidden bg-sunk', fill && 'size-full', rounded, className)}
      style={
        state === 'failed'
          ? { background: `linear-gradient(140deg, hsl(${hue} 38% 16%), hsl(${hue + 22} 42% 10%))` }
          : undefined
      }
    >
      {state !== 'failed' && (
        <img
          key={attempt}
          ref={checkCached}
          src={attempt === 0 ? src : `${src}&retry=${attempt}`}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={onError}
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            state === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {state === 'failed' && (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="text-2xl font-extrabold tracking-tight opacity-50"
            style={{ color: `hsl(${hue} 55% 78%)` }}
          >
            {monogram}
          </span>
        </div>
      )}

      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-sunk-deep/60" />}
    </div>
  )
}
