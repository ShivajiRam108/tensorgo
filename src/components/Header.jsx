import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              E-Commerce
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Products
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span className="text-gray-800 font-semibold text-sm">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
