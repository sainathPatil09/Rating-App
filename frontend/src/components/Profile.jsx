import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/account/me");
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/account/me", { name, email });
      setMessage(res.data.msg);
      setUser(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error updating profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/account/password", {
        oldPassword,
        newPassword,
      });
      setPasswordMessage(res.data.msg);
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false); // hide after update
    } catch (err) {
      setPasswordMessage(err.response?.data?.msg || "Error updating password");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Profile</h2>

      {/* Profile Update */}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}

      <hr />

      {/* Toggle Button */}
      <button onClick={() => setShowPasswordForm(!showPasswordForm)}>
        {showPasswordForm ? "Cancel" : "Change Password"}
      </button>

      {/* Password Update Section */}
      {showPasswordForm && (
        <form onSubmit={handlePasswordUpdate} style={{ marginTop: "10px" }}>
          <div>
            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Password</button>
        </form>
      )}
      {passwordMessage && <p>{passwordMessage}</p>}
    </div>
  );
}
