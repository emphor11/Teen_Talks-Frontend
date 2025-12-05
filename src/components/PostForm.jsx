// src/components/PostForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { data } from "react-router-dom";

const PostForm = ({ onPostCreated }) => {
  const { user, api, login } = useContext(AuthContext); // use api for requests
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !media) return alert("Please add text or media");

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media);
    console.log("form",formData)
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/v1/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("data:", data);
      if (res.ok) {
        setContent("");
        setMedia(null);
        onPostCreated(data.post);
        alert("Post created successfully!");
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto mb-6 border border-gray-100 flex flex-col gap-4"
    >
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none transition h-32 text-gray-700 font-[Poppins]"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
        className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition cursor-pointer text-gray-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
