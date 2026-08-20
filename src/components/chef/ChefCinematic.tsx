import { useLayoutEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import type { Chef } from '@/types/chef'

/**
 * The chef landing-page opening sequence.
 *
 * Everything here is *scroll-linked* rather than scroll-triggered: every value
 * is a pure function of scroll position, so the sequence plays backwards on
 * the way up for free and lands on the same frame at the same offset every
 * time. Nothing is stateful, nothing has to be "reset".
 *
 * ── Why CSS custom properties instead of per-layer MotionValues ─────────────
 * The obvious build is `useTransform(progress, …)` per layer and hand each one
 * to `style` on a `motion.div`. That was tried first and the transforms were
 * perfect, but the opacities bound to the *same* progress value on the *same*
 * elements settled on values implying a completely different scroll position —
 * verified by deriving progress back out of `scale` and out of `opacity` on
 * one frame and getting two different answers, with no CSS transition or
 * animation in play to explain it.
 *
 * So: one subscription, one place that computes every derived value, and the
 * results published as custom properties on the stage. CSS then does the
 * actual work. It's less idiomatic Motion, but it is deterministic, trivial
 * to reason about, and cheap — a handful of property writes on one element per
 * frame, with the compositor handling the rest.
 *
 * ── On not pixelating ───────────────────────────────────────────────────────
 * A push-in is just `scale()`, and scaling a bitmap past 1:1 is how you get
 * mush. Three things keep this sharp:
 *
 *  1. The source is pre-upscaled to 3200px (scripts/prepare-chef-images.mjs),
 *     so at `MAX_ZOOM` the image is still roughly 1:1 with a retina viewport
 *     rather than being invented by the compositor.
 *  2. `MAX_ZOOM` stays modest. 1.9× reads as a real push-in; 3× would look
 *     like a crop no matter how large the source is.
 *  3. A focus-pull blur ramps in over the last stretch — a lens does that when
 *     it racks focus, and it means the softest frames of the zoom are the ones
 *     being deliberately defocused anyway.
 *
 * ── On the black ────────────────────────────────────────────────────────────
 * The dissolve lands on `--color-paper` (#0a0a0a), not `#000`: that's the
 * app's own background, so when the sticky stage releases and the page carries
 * on in normal flow there is no seam to hide.
 */

const MAX_ZOOM = 1.9

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Progress through [a,b], clamped, mapped onto [from,to]. */
function ramp(p: number, a: number, b: number, from: number, to: number) {
  return from + (to - from) * clamp01((p - a) / (b - a))
}

/** Every value the stage publishes, for one scroll position. */
function framesFor(treatment: Chef['treatment'], p: number): Record<string, string> {
  const common = {
    // The opening frame's furniture — name, dishes, scrim — clears out early.
    '--plate-op': String(ramp(p, 0.02, 0.26, 1, 0)),
    '--plate-y': `${ramp(p, 0.02, 0.26, 0, -9)}%`,
    '--cue-op': String(ramp(p, 0, 0.12, 1, 0)),
  }

  if (treatment === 'frame-collapse') {
    return {
      ...common,
      // Full-bleed frame contracts to a held portrait…
      '--inset': `${ramp(p, 0.1, 0.6, 0, 18)}%`,
      '--radius': `${ramp(p, 0.1, 0.6, 0, 24)}px`,
      '--frame-scale': String(ramp(p, 0.6, 0.9, 1, 0.82)),
      '--frame-op': String(ramp(p, 0.66, 0.92, 1, 0)),
      // …while a counter-zoom keeps the subject the same size on screen, so
      // the world narrows around them rather than the photo just shrinking.
      '--img-scale': String(ramp(p, 0.1, 0.6, 1, 1.34)),
      '--detail-op': String(ramp(p, 0.7, 0.92, 0, 1)),
      '--detail-y': `${ramp(p, 0.7, 0.92, 28, 0)}px`,
    }
  }

  return {
    ...common,
    '--zoom': String(ramp(p, 0.08, 0.72, 1, MAX_ZOOM)),
    '--drift-x': `${ramp(p, 0.08, 0.72, 0, -2.4)}%`,
    '--drift-y': `${ramp(p, 0.08, 0.72, 0, 1.6)}%`,
    '--tilt': `${ramp(p, 0.08, 0.72, 0, -0.7)}deg`,
    '--blur': `${ramp(p, 0.42, 0.74, 0, 7)}px`,
    '--veil-op': String(ramp(p, 0.46, 0.78, 0, 1)),
    '--detail-op': String(ramp(p, 0.74, 0.94, 0, 1)),
    '--detail-y': `${ramp(p, 0.74, 0.94, 28, 0)}px`,
  }
}

/** Tracks scroll over `track` and publishes the frame onto `stage`. */
function useCinematic(
  treatment: Chef['treatment'],
  track: React.RefObject<HTMLDivElement | null>,
  stage: React.RefObject<HTMLDivElement | null>,
) {
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })

  const publish = (p: number) => {
    const el = stage.current
    if (!el) return
    const frame = framesFor(treatment, p)
    for (const key in frame) el.style.setProperty(key, frame[key])
  }

  // Paint frame zero before the first scroll event, or the opening frame
  // flashes unstyled.
  useLayoutEffect(() => {
    publish(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treatment])

  useMotionValueEvent(scrollYProgress, 'change', publish)
}

/** A quiet nudge that the page wants scrolling. */
function ScrollCue() {
  return (
    <div
      aria-hidden
      // Bottom-right rather than centred: the dish strip runs the full width of
      // the opening frame, and a centred cue lands on top of it.
      className="pointer-events-none absolute bottom-5 right-5 sm:bottom-8 sm:right-10"
      style={{ opacity: 'var(--cue-op, 1)' }}
    >
      <span className="grid size-9 animate-bounce place-items-center rounded-full border border-white/25 bg-scrim/30 text-white/80 backdrop-blur-sm">
        <ChevronDown size={16} />
      </span>
    </div>
  )
}

/** The chef's name and dishes, sitting on the opening frame. */
function OpeningPlate({ chef, children }: { chef: Chef; children: ReactNode }) {
  return (
    <div
      // Top padding reserves the app header *and* the floating back button
      // beneath it. Content is bottom-anchored, so this costs nothing when
      // there's room — it only bites on short viewports, where it stops the
      // name riding up underneath the back button.
      className="absolute inset-0 flex flex-col justify-end px-5 pb-5 pt-[124px] sm:px-10 sm:pb-8"
      style={{ opacity: 'var(--plate-op, 1)', transform: 'translateY(var(--plate-y, 0%))' }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-1.5 text-micro uppercase text-white/70">
          {chef.role} · {chef.city}
        </p>
        {/* A phone in landscape is ~390px tall, and this block is bottom-
            anchored — past a certain point it stops fitting and starts riding
            up under the back button. Rather than let that happen, the opening
            frame sheds its least essential parts on short viewports: the
            tagline goes first, then the name comes down a size. */}
        <h1 className="text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.95] heading-display text-white [@media(max-height:560px)]:text-[1.75rem]">
          {chef.name}
        </h1>
        <p className="mt-2.5 line-clamp-2 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-white/85 sm:text-[1.0625rem] [@media(max-height:640px)]:hidden">
          {chef.tagline}
        </p>
        {children}
      </div>
    </div>
  )
}

function DetailPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-y-auto"
      style={{ opacity: 'var(--detail-op, 0)', transform: 'translateY(var(--detail-y, 28px))' }}
    >
      {children}
    </div>
  )
}

interface TreatmentProps {
  chef: Chef
  /** The chef's dishes, rendered onto the opening frame. */
  dishes: ReactNode
  /** The panel the sequence resolves into. */
  detail: ReactNode
}

function Cinematic({ chef, dishes, detail }: TreatmentProps) {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useCinematic(chef.treatment, track, stage)

  const collapse = chef.treatment === 'frame-collapse'

  return (
    <div ref={track} className="relative" style={{ height: '320vh' }}>
      <div ref={stage} className="sticky top-0 h-dvh w-full overflow-hidden bg-paper">
        {collapse ? (
          <div
            className="absolute overflow-hidden bg-paper"
            style={
              {
                top: 'var(--inset, 0%)',
                bottom: 'var(--inset, 0%)',
                left: 'var(--inset, 0%)',
                right: 'var(--inset, 0%)',
                borderRadius: 'var(--radius, 0px)',
                transform: 'scale(var(--frame-scale, 1))',
                opacity: 'var(--frame-op, 1)',
              } as CSSProperties
            }
          >
            <img
              src={chef.hero}
              alt={chef.name}
              className="size-full object-cover"
              style={{
                transform: 'scale(var(--img-scale, 1))',
                transformOrigin: `${chef.heroFocus.x * 100}% ${chef.heroFocus.y * 100}%`,
              }}
              fetchPriority="high"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/35 to-scrim/20"
              style={{ opacity: 'var(--plate-op, 1)' }}
            />
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                transform:
                  'translate(var(--drift-x, 0%), var(--drift-y, 0%)) scale(var(--zoom, 1)) rotate(var(--tilt, 0deg))',
                transformOrigin: `${chef.heroFocus.x * 100}% ${chef.heroFocus.y * 100}%`,
                filter: 'blur(var(--blur, 0px))',
              }}
            >
              <img
                src={chef.hero}
                alt={chef.name}
                className="size-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            {/* Legibility scrim for the opening frame only. */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/35 to-scrim/20"
              style={{ opacity: 'var(--plate-op, 1)' }}
            />
          </>
        )}

        <OpeningPlate chef={chef}>{dishes}</OpeningPlate>
        <ScrollCue />

        {/* Dissolve to the app's own background, so the hand-off to normal
            flow below the sticky track is seamless. */}
        {!collapse && (
          <div className="absolute inset-0 bg-paper" style={{ opacity: 'var(--veil-op, 0)' }} />
        )}

        <DetailPanel>{detail}</DetailPanel>
      </div>
    </div>
  )
}

export function ChefCinematic({ chef, dishes, detail }: TreatmentProps) {
  const reduced = useReducedMotion()

  // A scroll-hijacked cinematic is exactly what prefers-reduced-motion exists
  // to opt out of. Same content, flat.
  if (reduced) {
    return (
      <div>
        <div className="relative h-[62vh] min-h-[380px] w-full overflow-hidden">
          <img src={chef.hero} alt={chef.name} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/35 to-scrim/20" />
          <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 pt-[124px] sm:px-10 sm:pb-8">
            <div className="mx-auto w-full max-w-6xl">
              <p className="mb-1.5 text-micro uppercase text-white/70">
                {chef.role} · {chef.city}
              </p>
              <h1 className="text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[0.95] heading-display text-white">
                {chef.name}
              </h1>
              <p className="mt-2.5 max-w-xl text-[1.0625rem] text-white/85">{chef.tagline}</p>
              {dishes}
            </div>
          </div>
        </div>
        {detail}
      </div>
    )
  }

  return <Cinematic chef={chef} dishes={dishes} detail={detail} />
}
