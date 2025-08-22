import { useEffect, useState } from "react";
import API from "../services/api";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get("/owners/dashboard");
        setData(res.data); // full { store, ratings }
      } catch (err) {
        console.error("Error fetching owner dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No store found.</p>;

  return (
    <div>
      <h2>My Store</h2>
      <div>
        <h3>{data.store.name}</h3>
        <p>{data.store.address}</p>
        <p>⭐ {data.store.avgRating}</p>

        <button onClick={() => setShowDetails((prev) => !prev)}>
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      {showDetails && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px" }}>
          <h4>User Ratings</h4>
          <ul>
            {data.ratings.length === 0 ? (
              <p>No ratings yet.</p>
            ) : (
              data.ratings.map((r) => (
                <li key={r.user.id}>
                  {r.user.name} ({r.user.email}) → {r.rating} ⭐
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
