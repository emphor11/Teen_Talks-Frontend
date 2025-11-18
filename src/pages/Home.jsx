// src/pages/Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="p-6">
      <h1 className="text-2xl">Home</h1>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
    </div>
  );
}
