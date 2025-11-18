// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (!res.ok) {
        alert(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // ✅ Log the user in immediately after signup
      if (data.user && data.token) {
        login(data.user, data.token);

        // ✅ Fetch profile & redirect
        try {
          const profileRes = await fetch("https://teen-talks-backend.onrender.com/api/v1/profile", {
            headers: { Authorization: `Bearer ${data.token}` },
          });

          const profileData = await profileRes.json();

          if (profileRes.ok && profileData.user) {
            console.log("Profile fetched:", profileData.user);
            navigate(`/profile/${profileData.user.id}`);
          } else {
            console.error("Profile fetch failed:", profileData);
            navigate("/");
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
          navigate("/");
        }
      } else {
        alert("Invalid signup response from server");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 font-[Poppins] text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-gray-700 font-[Poppins]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-gray-700 font-[Poppins]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-gray-700 font-[Poppins]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}