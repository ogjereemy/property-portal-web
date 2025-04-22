interface HeaderProps {
    token: string;
    handleLogout: () => void;
    setIsLogin: (isLogin: boolean) => void;
    isLogin: boolean;
  }
  
  export default function Header({ token, handleLogout, setIsLogin, isLogin }: HeaderProps) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Property Portal</h1>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Buy</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Rent</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Agents</a>
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsLogin(true)}
                  className={`font-semibold px-4 py-2 rounded-lg transition transform hover:scale-105 ${
                    isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`font-semibold px-4 py-2 rounded-lg transition transform hover:scale-105 ${
                    !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    );
  }