import React, { useEffect, useState } from "react";

const FollowButton = ({ userId, token }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user follows this person
  useEffect(() => {
    if (!userId || !token) return;
    
    // Ensure userId is a number (handle string or number)
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      console.error("Invalid userId:", userId);
      return;
    }
    
    const fetchStatus = async () => {
      try {
        // Use the correct endpoint for checking follow status
        const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/follow/status/${userIdNum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          // If response is not ok, check if it's HTML (404 page)
          const text = await res.text();
          if (text.startsWith('<!')) {
            throw new Error(`Failed to fetch follow status: ${res.status} ${res.statusText}`);
          }
          throw new Error(`Failed to fetch follow status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Follow status data:", data);
        setIsFollowing(data.isFollowing || false);
      } catch (err) {
        console.error("Follow status error:", err);
        // Set default to false on error
        setIsFollowing(false);
      }
    };
    fetchStatus();
  }, [userId, token]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!userId || !token) return;
    
    // Ensure userId is a number (handle string or number)
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      console.error("Invalid userId:", userId);
      alert("Invalid user ID");
      return;
    }
    
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/follow/${userIdNum}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if response is ok before parsing JSON
      if (!res.ok) {
        const text = await res.text();
        let errorMessage = `Failed to ${isFollowing ? 'unfollow' : 'follow'} user: ${res.status}`;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If not JSON, use default message
        }
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      console.log("Follow response:", data);
      setIsFollowing(data.isFollowing !== undefined ? data.isFollowing : !isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-6 py-2.5 rounded-full font-semibold text-white shadow-md transform transition-all duration-300 ${
        isFollowing
          ? "bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 hover:shadow-lg"
          : "bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 hover:shadow-lg"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : isFollowing ? (
        "Unfollow 💔"
      ) : (
        "Follow 💖"
      )}
    </button>
  );
};

export default FollowButton;
