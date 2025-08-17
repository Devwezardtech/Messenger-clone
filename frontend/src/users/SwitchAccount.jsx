import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function normalizeAccount(a = {}) {
  // unify common fields so comparisons work
  return {
    _id: a._id ?? a.id ?? a.userId ?? a.uid ?? null,
    name: a.name ?? a.fullName ?? a.displayName ?? "Unknown",
    username: a.username ?? a.handle ?? a.userName ?? null,
    avatar: a.avatar ?? a.photoURL ?? a.photo ?? null,
    lastLogin: a.lastLogin ?? a.lastSignedIn ?? a.updatedAt ?? a.createdAt ?? null,
    raw: a,
  };
}

export default function SwitchAccount() {
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("accounts") || "[]");
    const activeRaw = JSON.parse(localStorage.getItem("user") || "null");

    const normalizedList = Array.isArray(storedList)
      ? storedList.map(normalizeAccount)
      : [];

    const normalizedActive = activeRaw ? normalizeAccount(activeRaw) : null;

    // Ensure the active user appears in the list (dedupe by _id or username)
    let merged = normalizedList;
    if (normalizedActive) {
      const activeId = normalizedActive._id;
      const activeUserName = normalizedActive.username;
      const exists = normalizedList.some(
        (a) =>
          (a._id && activeId && a._id === activeId) ||
          (a.username && activeUserName && a.username === activeUserName)
      );
      if (!exists) {
        merged = [normalizedActive, ...normalizedList];
      }
    }

    setAccounts(merged);
    setCurrentUser(normalizedActive);
  }, []);

  const handleSwitch = (account) => {
    // persist back the original object if available
    localStorage.setItem("user", JSON.stringify(account.raw || account));
    // optional: update lastLogin timestamp
    try {
      const list = JSON.parse(localStorage.getItem("accounts") || "[]");
      const accIdx = list.findIndex(
        (a) =>
          (a._id && account._id && a._id === account._id) ||
          (a.id && account._id && a.id === account._id) ||
          (a.username && account.username && a.username === account.username)
      );
      if (accIdx !== -1) {
        list[accIdx] = { ...list[accIdx], lastLogin: new Date().toISOString() };
        localStorage.setItem("accounts", JSON.stringify(list));
      }
    } catch {}
    navigate("/users");
  };

  // split into active + others
  const activeId = currentUser?._id;
  const activeUsername = currentUser?.username;
  const isActive = (acc) =>
    (acc._id && activeId && acc._id === activeId) ||
    (acc.username && activeUsername && acc.username === activeUsername);

  const activeAccount = accounts.find(isActive) || currentUser || null;
  const otherAccounts = accounts.filter((a) => !isActive(a));

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Switch Account</h2>

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
                @{activeAccount.username || activeAccount.name?.toLowerCase()}
              </span>
              <span className="text-xs text-gray-400">
                Signed in {activeAccount.lastLogin ? timeAgo(activeAccount.lastLogin) : "recently"}
              </span>
            </div>
            <span className="ml-auto text-green-600 font-bold text-lg">✔</span>
          </div>
        </div>
      )}

      {/* Other (logged out) accounts */}
      {otherAccounts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Other accounts</h3>
          <div className="grid gap-3">
            {otherAccounts.map((acc) => (
              <button
                key={acc._id || acc.username || acc.name}
                onClick={() => handleSwitch(acc)}
                className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-100 transition text-left"
              >
                <img
                  src={acc.avatar || "/default-avatar.png"}
                  alt={acc.name}
                  className="rounded-full w-12 h-12 border"
                />
                <div className="flex flex-col">
                  <h4 className="font-medium">{acc.name}</h4>
                  <span className="text-sm text-gray-500">
                    @{acc.username || acc.name?.toLowerCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    Last signed in {acc.lastLogin ? timeAgo(acc.lastLogin) : "previously"}
                  </span>
                </div>
                <span className="ml-auto text-gray-400 text-sm">Logged out</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!activeAccount && otherAccounts.length === 0 && (
        <div className="text-sm text-gray-500 mb-6">No saved accounts yet.</div>
      )}

      {/* Add Account */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/login")}
          className="w-full p-3 rounded-lg border border-gray-400 hover:bg-gray-100"
        >
          ➕ Add account
        </button>
      </div>
    </div>
  );
}
