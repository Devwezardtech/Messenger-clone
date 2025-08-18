import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Lucide icons
import {
  ArrowLeft,
  CheckCircle,
  PlusCircle,
  LogIn,
  Trash2,
} from "lucide-react";

// Utility: time ago format
function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return `${days} days ago`;
}

export default function SwitchAccount() {
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("accounts") || "[]");
    const active = JSON.parse(localStorage.getItem("user") || "null");
    setAccounts(Array.isArray(stored) ? stored : []);
    setCurrentUser(active);
  }, []);

  const handleConfirmSwitch = async () => {
    if (!selectedAcc) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name: selectedAcc.name,
        password: passwordInput,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const updated = accounts
        .filter((a) => a.username !== res.data.user.username)
        .concat({
          ...res.data.user,
          lastLogin: new Date().toISOString(),
        });

      localStorage.setItem("accounts", JSON.stringify(updated));
      setAccounts(updated);
      setCurrentUser(res.data.user);

      setSelectedAcc(null);
      setPasswordInput("");
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (username) => {
    const filtered = accounts.filter((a) => a.username !== username);
    setAccounts(filtered);
    localStorage.setItem("accounts", JSON.stringify(filtered));
  };

  const isActive = (acc) =>
    acc?.username && currentUser?.username === acc.username;

  const activeAccount = currentUser || null;
  const otherAccounts = accounts.filter((a) => !isActive(a));

  return (
    <div className="my-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Switch Account</h2>
      </div>

      {/* Current account */}
      {activeAccount && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Current</h3>
          <div className="flex items-center gap-3 border rounded-lg p-3 bg-green-50">
            <img
              src={activeAccount.avatar || "/default-avatar.png"}
              alt={activeAccount.name}
              className="rounded-full w-12 h-12 border"
            />
            <div className="flex flex-col text-left">
              <h4 className="font-medium">{activeAccount.name}</h4>
              <span className="text-sm text-gray-500">
                @{activeAccount.username}
              </span>
              <span className="text-xs text-gray-400">
                Signed in{" "}
                {activeAccount.lastLogin
                  ? timeAgo(activeAccount.lastLogin)
                  : "recently"}
              </span>
            </div>
            <CheckCircle className="ml-auto text-green-600 w-5 h-5" />
          </div>
        </div>
      )}

      {/* Other accounts */}
      {otherAccounts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Accounts history
          </h3>
          <div className="grid gap-3">
            {otherAccounts.map((acc, idx) => (
              <div
                key={acc._id || idx}
                className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-100 transition text-left"
              >
                <button
                  onClick={
                    acc.name === currentUser?.name
                      ? undefined
                      : () => setSelectedAcc(acc)
                  }
                  disabled={acc.name === currentUser?.name}
                  className={`flex items-center gap-3 flex-1 text-left ${
                    acc.name === currentUser?.name
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <img
                    src={acc.avatar || "/default-avatar.png"}
                    alt={acc.name}
                    className="rounded-full w-12 h-12 border"
                  />
                  <div className="flex flex-col">
                    <h4 className="font-medium">{acc.name}</h4>
                    <span className="text-sm text-gray-500">@{acc.username}</span>
                    <span className="text-xs text-gray-400">
                      Last signed in{" "}
                      {acc.lastLogin ? timeAgo(acc.lastLogin) : "previously"}
                    </span>
                  </div>

                  <div className="ml-auto">
                    {acc.name === currentUser?.name ? (
                      <CheckCircle className="text-green-600 w-5 h-5" />
                    ) : (
                      <LogIn className="text-blue-500 w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(acc.username)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add account */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/login")}
          className="w-full p-3 rounded-lg border border-gray-400 hover:bg-gray-100 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Add account
        </button>
      </div>

      {/* Password Modal */}
      {selectedAcc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Verify {selectedAcc.name}
            </h3>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="w-full border rounded p-2 mb-3"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200"
                onClick={() => {
                  setSelectedAcc(null);
                  setPasswordInput("");
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white"
                disabled={loading}
                onClick={handleConfirmSwitch}
              >
                {loading ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
