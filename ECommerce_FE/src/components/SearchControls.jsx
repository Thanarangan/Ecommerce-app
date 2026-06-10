import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export function SearchControls({
  categories,
  category,
  disabled,
  lastQuery,
  onCategoryChange,
  onClear,
  onSearch,
}) {
  const [query, setQuery] = useState(lastQuery || '')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <section className="catalog-controls" aria-label="Catalog filters">
      <form className="search-form" onSubmit={handleSubmit}>
        <Search size={18} aria-hidden="true" />
        <input
          placeholder="Search products"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query || lastQuery ? (
          <button
            aria-label="Clear search"
            className="icon-button"
            type="button"
            onClick={() => {
              setQuery('')
              onClear()
            }}
          >
            <X size={16} />
          </button>
        ) : null}
        <button className="button button--primary" disabled={disabled} type="submit">
          Search
        </button>
      </form>

      <div className="category-filter">
        <span className="category-filter__label">
          <SlidersHorizontal size={16} />
          Category
        </span>
        <div className="category-filter__options">
          {['All', ...categories].map((item) => (
            <button
              className={item === category ? 'chip chip--active' : 'chip'}
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
