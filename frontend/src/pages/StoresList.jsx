import { useEffect, useState } from "react";
import API from "../services/api";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState(""); // <-- search state

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get("/stores");
        setStores(res.data.items);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, []);

  const handleRateStore = async (storeId, value) => {
    try {
      await API.post(`/stores/${storeId}/rate`, { value });
      // Refresh stores after rating
      const res = await API.get("/stores");
      setStores(res.data.items);
    } catch (err) {
      alert(err.response?.data?.msg || "Error rating store");
    }
  };

  // filter stores
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Available Stores</h2>

      {/* 🔍 Search input */}
      <input
        type="text"
        placeholder="Search stores by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "300px" }}
      />

      <ul>
        {filteredStores.map((store) => (
          <li key={store._id} style={{ marginBottom: "20px" }}>
            <h3>{store.name}</h3>
            <p>{store.address}</p>
            <p>
              ⭐ Avg Rating:{" "}
              {store.averageRating ? store.averageRating.toFixed(1) : "No ratings yet"}
            </p>

            {store.userRating ? (
              <p>
                Your Rating: <strong>{store.userRating}</strong> ⭐
              </p>
            ) : (
              <div>
                <label>Rate this store: </label>
                <select
                  onChange={(e) => handleRateStore(store._id, Number(e.target.value))}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} ⭐
                    </option>
                  ))}
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
