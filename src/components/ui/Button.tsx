import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-saffron text-white shadow-[0_1px_2px_rgb(180_83_9/.3),0_6px_16px_rgb(217_119_6/.28)] hover:bg-saffron-deep',
  secondary: 'bg-surface text-ink border border-line hover:border-ink-mute hover:bg-sunk/40',
  ghost: 'text-ink hover:bg-sunk',
  quiet: 'text-ink-soft hover:text-ink hover:bg-sunk',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-meta rounded-pill gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] rounded-pill gap-2',
  lg: 'h-14 px-7 text-base rounded-pill gap-2.5',
}

const BASE =
  'inline-flex items-center justify-center font-semibold whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40'

interface Common {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
  className?: string
}

type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], full && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  )
}

interface ButtonLinkProps extends Common {
  to: string
  state?: unknown
}

export function ButtonLink({
  to,
  state,
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      state={state}
      className={cn(BASE, VARIANTS[variant], SIZES[size], full && 'w-full', className)}
    >
      {children}
    </Link>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  className?: string
}

export function IconButton({ label, children, className, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full text-ink-soft',
        'transition-colors duration-200 hover:bg-sunk hover:text-ink active:scale-95',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
