import React from 'react'
import { Star, Store, Users, TrendingUp, ShoppingBag, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
  const handleLogin = () => {
    // Navigate to login page
    navigate('/login');
  }

  const handleSignup = () => {
    // Navigate to signup page
    navigate('/signup');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">StoreRate</h1>
            </div>
            <div className="flex space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 animate-pulse">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Rate & Review
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Your Favorite Stores
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover amazing stores, share your experiences, and help others make informed shopping decisions. 
              Join thousands of users building the ultimate store rating community.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleSignup}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Rating Stores
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Reviews
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Stores Reviewed</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100K+</h3>
              <p className="text-gray-600">Reviews Posted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StoreRate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover and share store experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Find Local Stores</h3>
              <p className="text-gray-600">
                Discover amazing stores in your neighborhood with detailed location information and directions.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Rate & Review</h3>
              <p className="text-gray-600">
                Share your honest experiences and help others make better shopping decisions.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Trending Insights</h3>
              <p className="text-gray-600">
                Get insights on trending stores and popular shopping destinations in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ShoppingBag className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Rating?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community today and become part of the conversation about local businesses.
            </p>
          </div>
          
          <button
            onClick={handleSignup}
            className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">StoreRate</h3>
          </div>
          <p className="text-gray-400">
            © 2025 StoreRate. Empowering shoppers with authentic store reviews.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage