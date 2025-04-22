import { Listing } from '../types';

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
              <p className="text-blue-600 font-bold text-lg">AED {listing.price.toLocaleString()}</p>
              <p className="text-gray-600 font-medium">{listing.location}</p>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{listing.description}</p>
              <button className="mt-4 text-blue-600 font-semibold hover:underline transition">
                Contact Agent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}