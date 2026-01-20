'use client';

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  placeholder?: string;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  placeholder = 'Search...'
}: SearchFilterProps) {
  return (
    <div className="search-filter-container">
      <div className="row g-3 align-items-end">
        <div className="col-md-6">
          <label className="form-label small text-muted fw-semibold">Search</label>
          <div className="search-input-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="form-control"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        {filterOptions && onFilterChange && (
          <div className="col-md-6">
            <label className="form-label small text-muted fw-semibold">Filter</label>
            <select
              className="form-select"
              value={filterValue || ''}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
