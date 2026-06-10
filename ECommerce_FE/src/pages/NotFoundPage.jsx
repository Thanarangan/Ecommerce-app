import { Link } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'

export function NotFoundPage() {
  return (
    <div className="page-stack">
      <StateBlock
        description="The page you requested does not exist."
        title="Page not found"
      />
      <Link className="button button--primary state-link" to="/">
        Back home
      </Link>
    </div>
  )
}
