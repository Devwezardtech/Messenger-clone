import React, { useState, useEffect } from "react";
import api from "../../../components/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Setting() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    setName(storedUser.name || "");
  }, []);

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/auth/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = user.avatar;
      if (avatar) {
        avatarUrl = await uploadPhoto(avatar);
      }

      const res = await api.put(`/api/user/update/${user.id || user._id}`, {
        name,
        password: password || undefined,
        avatar: avatarUrl,
      });

      // update localStorage so Menu.jsx shows new info
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      alert("Profile updated successfully!");
      setTimeout(()=>{
         navigate("/users/menu")
      }, 1000)
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  const toBack = () => {
    navigate("/users/menu")
  }

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className=" px-6 py-6 pb-6 max-w-md mx-auto">
      <div className="flex gap-4 mb-4">
        <button
          onClick={toBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      <h2 className="lg:text-xl font-semibold">Settings</h2>
      </div>

      <form onSubmit={updateProfile} className="flex flex-col gap-4">
        {/* Avatar preview */}
        <div className="flex flex-col items-center">
          <img
            src={avatar ? URL.createObjectURL(avatar) : user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full border mb-2"
          />
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="text-sm"
          />
        </div>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Update name"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
