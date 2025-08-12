import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) return null; // or a loading spinner

  return (
    <nav>
      
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
    </nav>
  );
}
