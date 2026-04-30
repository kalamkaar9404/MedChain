'use client'

interface FilterBarProps {
  activeFilter: string
  filters: { label: string; value: string }[]
  onFilterChange: (value: string) => void
}

export function FilterBar({ activeFilter, filters, onFilterChange }: FilterBarProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            activeFilter === filter.value
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
