import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";
import loginBG from "../assets/loginBG.jpg"

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
    <div  className="fixed inset-0 -z-20 min-h-screen flex items-center justify-center "
            style={{
              backgroundImage: `url(${loginBG})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}>
      <div className="w-full max-w-sm bg-white shadow-lg bg-gradient-to-r from-[#343434] to-[#242424] justify-center rounded-2xl p-8 border border-black">
  
        {/* Aesthetic soft gradient title like Photogram */}
        <h2 className="text-3xl font-bold text-center bg-white bg-clip-text text-transparent mb-6 font-[Avenir]">
          Teen Talks
        </h2>
  
        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 font-[Avenir] rounded-xl text-sm outline-none focus:border-black focus:ring-2 focus:ring-black transition"
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border font-[Avenir] border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-black focus:ring-2 focus:ring-black transition"
          />
  
          <button
            type="submit"
            disabled={loading}
            className={`bg-black text-white font-bold font-[Avenir] rounded-xl py-2 text-sm shadow-md ${
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
  
        <p className="text-center text-gray-400 mt-6 text-sm font-[Avenir]">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-white font-medium font-[Avenir] hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}  