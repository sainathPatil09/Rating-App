import { useEffect, useState } from "react";
import { Users, User, Store, Star, Plus, Search, X, UserCheck, Shield, ShoppingBag } from "lucide-react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");

  // States for forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [showStoreForm, setShowStoreForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner: "",
  });

  const ownerUsers = users.filter((u) => u.role === "OWNER" || u.role === "STORE_OWNER");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/admin/dashboard");
      setStats({
        totalUsers: data.totalUsers,
        totalStores: data.totalStores,
        totalRatings: data.totalRatings,
      });
      setUsers(data.users);
      setStores(data.stores);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchData();
  }, []);

  

  // Handle input changes
  const handleUserChange = (e) =>
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  const handleStoreChange = (e) =>
    setNewStore({ ...newStore, [e.target.name]: e.target.value });

  // Submit handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await API.post("/admin/create-user", newUser);
      const newId = users.length + 1;
      const userToAdd = { ...newUser, id: newId };
      setUsers([...users, userToAdd]);
      
      alert("User added successfully!");
      setShowUserForm(false);
      setNewUser({ name: "", email: "", address: "", password: "", role: "USER" });
    } catch (err) {
      alert("Error adding user");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await API.post("/admin/createStore", newStore);
      const newId = stores.length + 1;
      const storeToAdd = { ...newStore, id: newId, avgRating: 0 };
      setStores([...stores, storeToAdd]);
      
      alert("Store added successfully!");
      setShowStoreForm(false);
      setNewStore({ name: "", email: "", address: "", owner: "" });
    } catch (err) {
      alert("Error adding store");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "STORE_OWNER":
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "STORE_OWNER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
    console.log("Navigate to profile");
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, stores, and monitor platform activity</p>
          </div>
          <button
            onClick={handleProfileNavigation}
            className="flex items-center flex-col text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <User className="h-8 w-8 mr-2" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStores.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Ratings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRatings.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Add User Form */}
          {showUserForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowUserForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={handleUserChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={handleUserChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={newUser.address}
                  onChange={handleUserChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleUserChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add User
                </button>
              </form>
            </div>
          )}

          {/* Users List */}
          <div className="p-6">
            <div className="space-y-3">
              {users
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(filter.toLowerCase()) ||
                    u.email.toLowerCase().includes(filter.toLowerCase()) ||
                    u.role.toLowerCase().includes(filter.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Stores Management</h2>
              <button
                onClick={() => setShowStoreForm(!showStoreForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Store
              </button>
            </div>
          </div>

          {/* Add Store Form */}
          {showStoreForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Store</h3>
                <button
                  onClick={() => setShowStoreForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Store Name"
                  value={newStore.name}
                  onChange={handleStoreChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Store Email"
                  value={newStore.email}
                  onChange={handleStoreChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Store Address"
                  value={newStore.address}
                  onChange={handleStoreChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <select
                  name="owner"
                  value={newStore.owner}
                  onChange={handleStoreChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Store Owner</option>
                  {ownerUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors md:col-span-2"
                >
                  Add Store
                </button>
              </form>
            </div>
          )}

          {/* Stores List */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{store.avgRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Store ID: {store.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;