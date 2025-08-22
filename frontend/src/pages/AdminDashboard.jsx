import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";

const AdminDashboard = () => {
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
  });

  const ownerUsers = users.filter((u) => u.role === "OWNER");

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await API.get("/admin/dashboard");
      setStats({
        totalUsers: data.totalUsers,
        totalStores: data.totalStores,
        totalRatings: data.totalRatings,
      });
      setUsers(data.users);
      setStores(data.stores);
    };
    fetchDashboard();
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
      await API.post("/admin/users", newUser);
      alert("User added successfully!");
      setShowUserForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding user");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/createStore", newStore);
      alert("Store added successfully!");
      setNewStore({ name: "", email: "", address: "", owner: "" });
      // Optionally refresh dashboard or stores list
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding store");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Stores: {stats.totalStores}</p>
        <p>Total Ratings: {stats.totalRatings}</p>
      </div>

      <h2>Users</h2>
      <button onClick={() => setShowUserForm(!showUserForm)}>Add User</button>
      {showUserForm && (
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleUserChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleUserChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newUser.address}
            onChange={handleUserChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleUserChange}
          />
          <select name="role" value={newUser.role} onChange={handleUserChange}>
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      )}
      <input
        placeholder="Search users..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {users
          .filter(
            (u) =>
              u.name.includes(filter) ||
              u.email.includes(filter) ||
              u.role.includes(filter)
          )
          .map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} - {user.role}
            </li>
          ))}
      </ul>

      <h2>Stores</h2>
      <button onClick={() => setShowStoreForm(!showStoreForm)}>
        Add Store
      </button>
      {showStoreForm && (
        <>
          <h2>Add New Store</h2>
          <form onSubmit={handleAddStore}>
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              value={newStore.name}
              onChange={handleStoreChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              value={newStore.email}
              onChange={handleStoreChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newStore.address}
              onChange={handleStoreChange}
              required
            />
            <select
              name="owner"
              value={newStore.owner}
              onChange={handleStoreChange}
              required
            >
              <option value="">Select Owner</option>
              {ownerUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button type="submit">Add Store</button>
          </form>
        </>
      )}
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            {store.name} - {store.address} - Avg Rating: {store.avgRating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
