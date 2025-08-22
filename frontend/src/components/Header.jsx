import React, { useContext } from "react";
import { Store } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // adjust path

const Header = ({ handleLogin, handleSignup, handleLogout }) => {
  const { authUser } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">StoreRate</h1>
          </div>

          {/* Right side */}
          <div className="flex space-x-4 items-center">
            {authUser ? (
              <>
                <span className="text-gray-700 font-medium">
                  Role: <span className="capitalize">{authUser.role}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
