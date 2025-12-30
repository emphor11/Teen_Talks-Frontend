import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CommentSection = ({ postId }) => {
  const { api } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH COMMENTS ================= */
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `https://teen-talks-backend.onrender.com/api/v1/posts/comments/${postId}`
      );
      const data = await res.json();
      setComments(data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  /* ================= ADD COMMENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://teen-talks-backend.onrender.com/api/v1/posts/comments/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setComments([data, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-5 space-y-4">

      {/* ================= COMMENT INPUT (GLASS) ================= */}
      <form onSubmit={handleSubmit} className="relative flex gap-3">
        {/* Glass layer */}
        <div
          className="
            absolute inset-0
            bg-[#141414]/60
            supports-[backdrop-filter]:backdrop-blur-md
            rounded-2xl
            border border-white/10
            -z-10
          "
        />

        <input
          type="text"
          placeholder="Write a comment…"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="
            flex-1
            bg-transparent
            px-4 py-3
            text-sm text-white
            placeholder:text-gray-400
            outline-none
            focus:ring-2 focus:ring-yellow-400/60
            rounded-2xl
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            bg-[#FFFD02]
            text-black
            font-[Avenir]
            font-medium
            px-6 py-2
            rounded-2xl
            hover:bg-yellow-300
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Posting…" : "Comment"}
        </button>
      </form>

      {/* ================= COMMENTS LIST ================= */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="relative rounded-2xl px-4 py-3"
            >
              {/* Glass background */}
              <div
                className="
                  absolute inset-0
                  bg-[#1a1a1a]/55
                  supports-[backdrop-filter]:backdrop-blur-md
                  border border-white/10
                  rounded-2xl
                  -z-10
                "
              />

              {/* Username */}
              <p className="text-sm font-semibold text-yellow-400">
                {c.user_name}
              </p>

              {/* Comment text */}
              <p className="text-sm text-gray-200 mt-1 leading-relaxed">
                {c.content}
              </p>

              {/* Timestamp */}
              <p className="text-xs text-gray-500 mt-2">
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
