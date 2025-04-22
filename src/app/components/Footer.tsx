export default function Footer() {
    return (
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold">Property Portal</h3>
              <p className="text-gray-300 text-sm mt-3">
                Find your dream home with the leading property platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Buy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Rent</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Agents</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Resources</h3>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Mortgage Calculator</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Guides</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }