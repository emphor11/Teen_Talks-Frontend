import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
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
      const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      login(data.user, data.token, data.posts);
      navigate(`/profile/${data.user.id}`);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google OAuth handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      console.log("Google login response:", data);

      if (data.success) {
        login(data.user, data.token);
        navigate(`/profile/${data.user.id}`);
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google sign-in failed");
    }
  };

  const handleGoogleLoginError = () => {
    alert("Google Sign-in was cancelled or failed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
  
        {/* Aesthetic soft gradient title like Photogram */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 font-[Poppins]">
          Photogram
        </h2>
  
        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition"
          />
  
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl py-2 text-sm shadow-md ${
              loading ? "opacity-70" : "hover:opacity-90"
            } transition`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
  
        {/* Google Login */}
        <div className="flex justify-center mt-6">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>
  
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 font-medium hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}  