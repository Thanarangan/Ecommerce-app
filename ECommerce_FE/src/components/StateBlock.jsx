import { AlertCircle, PackageSearch } from 'lucide-react'

export function StateBlock({
  action,
  actionLabel = 'Try again',
  description,
  title,
  tone = 'neutral',
}) {
  const Icon = tone === 'error' ? AlertCircle : PackageSearch

  return (
    <div className={`state-block state-block--${tone}`}>
      <span className="state-block__icon" aria-hidden="true">
        <Icon size={26} />
      </span>
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? (
        <button className="button button--secondary" type="button" onClick={action}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
