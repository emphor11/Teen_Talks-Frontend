import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  /* ================= LOAD FROM STORAGE ================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedPosts = localStorage.getItem("posts");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }

      if (storedPosts && storedPosts !== "undefined") {
        setPosts(JSON.parse(storedPosts));
      }
    } catch (err) {
      console.error("Storage parse error:", err);
      localStorage.clear();
    }
  }, []);

  /* ================= SYNC POSTS TO STORAGE ================= */
  useEffect(() => {
    if (posts) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  /* ================= LOGIN ================= */
  const login = (userObj, token, userPosts = []) => {
    if (!userObj || !token) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("posts", JSON.stringify(userPosts));

    setUser(userObj);
    setPosts(userPosts);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("posts");
    setUser(null);
    setPosts([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        posts,
        setPosts,
        login,
        logout,
        api: API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
