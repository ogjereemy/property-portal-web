import { User, Listing } from '../types';
import ListingForm from './ListingForm';
import Filters from './Filters';
import ListingsGrid from './ListingsGrid';

interface MainContentProps {
  user: User | null;
  listings: Listing[];
  filters: { price_max?: string; location?: string };
  setFilters: (filters: { price_max?: string; location?: string }) => void;
  newListing: Partial<Listing>;
  setNewListing: (listing: Partial<Listing>) => void;
  formErrors: { [key: string]: string };
  handleCreateListing: () => void;
  handleFilter: () => void;
}

export default function MainContent({
  user,
  listings,
  filters,
  setFilters,
  newListing,
  setNewListing,
  formErrors,
  handleCreateListing,
  handleFilter,
}: MainContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {user ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.email} ({user.role})
            </h2>
            {user.role === 'agent' && !user.verified && (
              <p className="text-red-600 mt-2 font-medium">Your agent account is not yet verified.</p>
            )}
            {user.role === 'agent' && user.verified && (
              <p className="text-green-600 mt-2 font-medium">You are a verified agent. Create a listing below.</p>
            )}
          </div>
          {user.role === 'agent' && user.verified && (
            <ListingForm
              newListing={newListing}
              setNewListing={setNewListing}
              formErrors={formErrors}
              handleCreateListing={handleCreateListing}
            />
          )}
          <Filters filters={filters} setFilters={setFilters} handleFilter={handleFilter} />
          <ListingsGrid listings={listings} />
        </>
      ) : (
        <div>Please sign in or register to view content.</div>
      )}
    </main>
  );
}