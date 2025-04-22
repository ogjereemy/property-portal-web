import { Listing } from '../types';

interface ListingFormProps {
  newListing: Partial<Listing>;
  setNewListing: (listing: Partial<Listing>) => void;
  formErrors: { [key: string]: string };
  handleCreateListing: () => void;
}

export default function ListingForm({ newListing, setNewListing, formErrors, handleCreateListing }: ListingFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title</label>
          <input
            type="text"
            value={newListing.title}
            onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
            placeholder="e.g., Luxury Villa"
            className={`w-full border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition`}
          />
          {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (AED)</label>
          <input
            type="number"
            value={newListing.price || ''}
            onChange={(e) => setNewListing({ ...newListing, price: parseFloat(e.target.value) })}
            placeholder="e.g., 1000000"
            className={`w-full border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition`}
          />
          {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={newListing.location}
            onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
            placeholder="e.g., Dubai Marina"
            className={`w-full border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition`}
          />
          {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={newListing.description}
            onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
            placeholder="Describe the property..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            rows={5}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Property Image</label>
          <input
            type="file"
            disabled
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            title="Image upload coming soon"
          />
          <p className="text-gray-500 text-sm mt-1">Image upload will be enabled in a future update.</p>
        </div>
        <button
          onClick={handleCreateListing}
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition transform hover:scale-105"
        >
          Create Listing
        </button>
      </div>
    </div>
  );
}