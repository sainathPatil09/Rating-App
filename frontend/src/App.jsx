import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import StoresList from "./pages/StoresList";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Store Owner Dashboard */}
          <Route
            path="/owner"
            element={
              <PrivateRoute roles={["OWNER"]}>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />

          {/* Normal Users - Stores List */}
          <Route
            path="/stores"
            element={
              <PrivateRoute roles={["USER"]}>
                <StoresList />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
