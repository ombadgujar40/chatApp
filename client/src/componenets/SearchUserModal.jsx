import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/authContext";

export default function SearchUserModal({ isOpen, onClose, onChatCreated }) {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [groupName, setGroupName] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const resp = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(resp.data.user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [token]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const resp = await api.get("/api/users/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: email },
      });
      setResults(resp.data.data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTick = (user) => {
    setSelectedMembers((prev) => [...prev, user.name]);
    setGroupMembers((prev) => [...prev, user._id]);
  };

  const handleAddChat = async () => {
    const arr = groupMembers.concat(me._id);
    if (!groupName) return;
    try {
      const resp = await api.post(
        "/api/chats",
        {
          members: arr,
          title: groupName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(resp);
      onChatCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  };

  const handleRemove = (user) => {
    setSelectedMembers((prev) => prev.filter((name) => name !== user));
    setGroupMembers((prev) => prev.filter((id) => id !== user._id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-2">
          {selectedMembers?.map((user) => (
            <div
              className="flex bg-white/5 rounded-lg px-1 py-2 text-gray-400 border border-sky-400 items-center gap-2"
              key={user}
            >
              {user}
              <div
                className="text-white cursor-pointer hover:text-red-500"
                onClick={() => handleRemove(user)}
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">New Chat</h2>
          <button onClick={onClose} className="text-muted hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-accent text-slate-900 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.length === 0 && !loading && (
            <p className="text-center text-muted text-sm">No users found</p>
          )}
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-avatar-gradient flex items-center justify-center text-xs font-bold text-slate-900">
                  {user.name?.[0]}
                </div>
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-xs text-muted">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => handleTick(user)}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-accent hover:text-slate-900 rounded transition-colors text-white"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {selectedMembers.length > 0 && (
            <div>
              <input
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
                type="text"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
          <button
            onClick={handleAddChat}
            className="px-4 py-2 bg-accent text-slate-900 rounded-lg font-semibold hover:opacity-90"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
}
