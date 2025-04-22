interface FiltersProps {
    filters: { price_max?: string; location?: string };
    setFilters: (filters: { price_max?: string; location?: string }) => void;
    handleFilter: () => void;
  }
  
  export default function Filters({ filters, setFilters, handleFilter }: FiltersProps) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Search Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            value={filters.price_max || ''}
            onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
            placeholder="Max Price (AED)"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="Location"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </div>
    );
  }