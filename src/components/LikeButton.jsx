import React, { useState, useEffect } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
const LikeButton = ({ postId, initialLiked = false, initialCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Optional: refresh like info once when mounted to stay synced
  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://teen-talks-backend.onrender.com/api/v1/posts/${postId}/like`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log("d",data)
        if (data.success) {
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
      } catch (err) {
        console.error("Error fetching like info:", err);
      }
    };

    fetchLikeInfo();
  }, [postId]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://teen-talks-backend.onrender.com/api/v1/posts/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.count);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={"items-center gap-1 px-3 py-1 rounded-xl text-white font-semibold transition-all "}
    >
      {liked ? (
        <HeartSolid className="w-4 h-4 text-red-500" />
      ) : (
        <HeartOutline className="w-4 h-4 text-gray-700" />
      )}
      <span className="text-sm text-white font-medium">
        {likeCount || 0} Likes
      </span>
      
    </button>
  );
};

export default LikeButton;
