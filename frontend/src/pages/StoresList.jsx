import { useEffect, useState } from "react";
import { Search, Store, MapPin, Star, Filter, ArrowLeft, Heart, Clock } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function StoreList() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [ratingStore, setRatingStore] = useState(null);
 console.log(stores);
  // Mock data for demonstration
  // const mockStores = [
  //   {
  //     _id: "1",
  //     name: "Fresh Market Store",
  //     address: "123 Main Street, Downtown, City - 12345",
  //     averageRating: 4.2,
  //     userRating: null,
  //     totalRatings: 24,
  //     category: "Grocery",
  //     image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&h=200&fit=crop"
  //   },
  //   {
  //     _id: "2", 
  //     name: "Tech Electronics Hub",
  //     address: "456 Tech Avenue, Silicon Valley, City - 67890",
  //     averageRating: 4.7,
  //     userRating: 5,
  //     totalRatings: 89,
  //     category: "Electronics",
  //     image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
  //   },
  //   {
  //     _id: "3",
  //     name: "Cozy Coffee Corner",
  //     address: "789 Brew Street, Coffee District, City - 11111",
  //     averageRating: 3.8,
  //     userRating: null,
  //     totalRatings: 156,
  //     category: "Cafe",
  //     image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop"
  //   },
  //   {
  //     _id: "4",
  //     name: "Fashion Forward Boutique",
  //     address: "321 Style Boulevard, Fashion District, City - 22222",
  //     averageRating: null,
  //     userRating: null,
  //     totalRatings: 0,
  //     category: "Fashion",
  //     image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop"
  //   }
  // ];

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await API.get("/stores");
        setStores(res.data.items);
        // setStores(mockStores);
      } catch (err) {
        console.error("Error fetching stores:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleRateStore = async (storeId, value) => {
    setRatingStore(storeId);
    try {
      await API.post(`/stores/${storeId}/rate`, { value });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setStores(prevStores => 
        prevStores.map(store => 
          store._id === storeId 
            ? { ...store, userRating: value }
            : store
        )
      );
      
      // Refresh stores after rating
      const res = await API.get("/stores");
      setStores(res.data.items);
    } catch (err) {
      alert(err.response?.data?.msg || "Error rating store");
    } finally {
      setRatingStore(null);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
    console.log("Navigate back to home");
  };

  // Filter and sort stores
  const filteredStores = stores
    .filter((store) => {
      const searchMatch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                         store.address.toLowerCase().includes(search.toLowerCase())
      
      if (ratingFilter === "") return searchMatch;
      
      const rating = store.averageRating;
      switch (ratingFilter) {
        case "5": return searchMatch && rating >= 4.5;
        case "4": return searchMatch && rating >= 4.0 && rating < 4.5;
        case "3": return searchMatch && rating >= 3.0 && rating < 4.0;
        case "unrated": return searchMatch && !rating;
        default: return searchMatch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b._id.localeCompare(a._id);
        default:
          return 0;
      }
    });

  const renderStars = (rating, size = "w-4 h-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingButton = (store) => {
    if (store.userRating) {
      return (
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          <Heart className="w-4 h-4 text-green-600 fill-current" />
          <span className="text-green-700 font-medium">
            You rated: {store.userRating} ⭐
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">Rate this store:</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRateStore(store._id, rating)}
              disabled={ratingStore === store._id}
              className={`group relative p-1 rounded-full transition-all duration-200 ${
                ratingStore === store._id
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-yellow-50 hover:scale-110"
              }`}
            >
              <Star className="w-6 h-6 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" />
              {ratingStore === store._id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Store Directory</h1>
                  <p className="text-sm text-gray-600">{filteredStores.length} stores available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stores by name, address, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">4.5+ Stars</option>
                <option value="4">4.0+ Stars</option>
                <option value="3">3.0+ Stars</option>
                <option value="unrated">Unrated</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStores.map((store) => (
              <div key={store._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Store Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  <img
                    src={store.image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&seed=${store._id}`}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {store.category}
                    </span>
                  </div>
                </div>

                {/* Store Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <p className="text-sm">{store.address}</p>
                    </div>
                  </div>

                  {/* Rating Display */}
                  <div className="mb-4">
                    {store.averageRating ? (
                      <div className="flex items-center space-x-3">
                        {renderStars(store.averageRating)}
                        <span className="text-lg font-semibold text-gray-900">
                          {store.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {renderStars(0)}
                        <span className="text-sm text-gray-500">No ratings yet</span>
                      </div>
                    )}
                  </div>

                  {/* Rating Action */}
                  <div className="border-t pt-4">
                    {renderRatingButton(store)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}