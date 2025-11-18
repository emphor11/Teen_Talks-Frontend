import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatBubbleOvalLeftIcon as ChatBubbleSolid } from "@heroicons/react/24/solid";

const CommentSection = ({ postId }) => {
  const { api } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/posts/comments/${postId}`);
      const data = await res.json();
      console.log("Fetched comments:", data);
      setComments(data || []); // ✅ Corrected
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Post a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/posts/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      console.log("Added comment:", data);
      if (res.ok) {
        setComments([data, ...comments]); // ✅ Corrected
        setNewComment("");
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4">
      {/* Comment input */}
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 font-[Poppins] transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-2xl shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </form>

      {/* Comments list */}
      <div className="mt-3 flex flex-col gap-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm font-[Poppins]">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-2xl shadow-inner border border-gray-200 text-gray-700 font-[Poppins]"
            >
              <p className="font-semibold text-sm text-pink-600">{c.user_name}</p>
              <p>{c.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
