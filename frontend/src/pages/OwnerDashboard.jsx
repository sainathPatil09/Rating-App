import { useEffect, useState } from "react";
import { Store, User, Star, Users, Eye, EyeOff, MapPin, TrendingUp, Award, Calendar } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  console.log(data)
    useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/owners/dashboard");
        setData(res.data); // full { store, ratings }
        // console.log(res.data)
      } catch (err) {
        console.error("Error fetching owner dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getRatingDistribution = () => {
    if (!data?.ratings) return {};
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    data.ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    
    return distribution;
  };

  const getRecentRatings = () => {
    if (!data?.ratings) return [];
    return data.ratings.slice(0, 3);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBgColor = (rating) => {
    if (rating >= 4.5) return "bg-green-50 border-green-200";
    if (rating >= 3.5) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
    console.log("Navigate to profile");
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No store found.</p>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const recentRatings = getRecentRatings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Store className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
            </div>
            <p className="text-gray-600">Monitor your store's performance and customer feedback</p>
          </div>
          <button
            onClick={handleProfileNavigation}
            className="flex items-center flex-col text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <User className="h-8 w-8 mr-2" />
          </button>
        </div>

        {/* Store Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.store.name}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{data.store.address}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{data?.ratings?.length} total reviews</span>
                </div>
              </div>
            </div>

            {/* Rating Overview */}
            <div className="flex flex-col items-center justify-center">
              <div className={`text-6xl font-bold mb-2 ${getRatingColor(data.store.avgRating)}`}>
                {data.store.avgRating}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(data.store.avgRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-center">
                Average rating from {data.store.totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{data.ratings.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">5-Star Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{ratingDistribution[5] || 0}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rating Trend</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">+8%</p>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Recent Reviews</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentRatings.map((review) => (
                <div key={review.id} className={`p-4 rounded-lg border ${getRatingBgColor(review.rating)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{review.user.name}</p>
                      <p className="text-sm text-gray-600">{review.user.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">All Customer Reviews</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {showDetails ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Reviews
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    View All Reviews
                  </>
                )}
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="p-6">
              {data.ratings.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No ratings yet.</p>
                  <p className="text-gray-500">Your first review will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Rating Distribution */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Rating Distribution</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 w-6">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${data.ratings.length > 0 ? (ratingDistribution[rating] / data.ratings.length) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Reviews List */}
                  <div className="space-y-4">
                    {data.ratings.map((review) => (
                      <div key={review.id} className={`p-6 rounded-lg border ${getRatingBgColor(review.rating)}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {review.user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.user.name}</p>
                              <p className="text-sm text-gray-600">{review.user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}