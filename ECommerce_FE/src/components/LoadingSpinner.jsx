import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ label = 'Loading' }) {
  return (
    <span className="loading-spinner" role="status" aria-label={label}>
      <Loader2 size={18} />
    </span>
  )
}
