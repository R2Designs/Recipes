import { ShieldCheck } from 'lucide-react'

/** The spec's explicit requirement, made visible: nothing here orders itself. */
export function ControlNotice() {
  return (
    <div className="flex items-start gap-3 rounded-card border border-veg/20 bg-veg/6 p-4">
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-veg" />
      <div>
        <p className="text-[0.9375rem] font-bold text-ink">You’re in control</p>
        <p className="mt-0.5 text-meta text-ink-soft">
          Review everything below before ordering. Nothing is added to Instamart or purchased
          until you explicitly confirm.
        </p>
      </div>
    </div>
  )
}
