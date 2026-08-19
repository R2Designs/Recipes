import { CookingPot } from 'lucide-react'
import { EmptyState } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        icon={<CookingPot size={24} />}
        title="We couldn’t find that dish"
        body="The recipe you’re looking for doesn’t exist, or the link has changed."
        action={<ButtonLink to="/">Back to discovery</ButtonLink>}
      />
    </div>
  )
}
