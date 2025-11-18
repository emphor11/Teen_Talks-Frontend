import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Load saved user and posts from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedPosts = localStorage.getItem("posts");

      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("Loaded user from storage:", parsedUser);
      }

      if (storedPosts && storedPosts !== "undefined") {
        const parsedPosts = JSON.parse(storedPosts);
        setPosts(parsedPosts);
        console.log("Loaded posts from storage:", parsedPosts);
      }

    } catch (err) {
      console.error("Error parsing stored user or posts:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("posts");
    }
  }, []);

  // Login stores both user and posts
  const login = (userObj, token, userPosts = []) => {
    if (!userObj || !token) {
      console.warn("login called without user or token");
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("posts", JSON.stringify(userPosts));
    setUser(userObj);
    setPosts(userPosts);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("posts");
    setUser(null);
    setPosts([]);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, posts, setPosts, login, logout, api: API }}>
      {children}
    </AuthContext.Provider>
  );
};
