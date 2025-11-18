// src/pages/FeedPage.jsx
import React, { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import FollowButton from "../components/FollowButton";
import { useNavigate } from "react-router-dom";
import { startConversation } from "../services/chatAPI";
import { ChatBubbleOvalLeftIcon as ChatBubbleSolid } from "@heroicons/react/24/solid";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const navigate = useNavigate();

  // 📰 Fetch feed posts
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/posts/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Feed error:", err);
      }
    };
    fetchFeed();
  }, []);

  // 💬 Start a chat with the searched user
  const handleChatClick = async (receiverId) => {
    try {
      setIsStartingChat(true);
      const res = await startConversation(receiverId);
      if (res.conversation?.id) {
        navigate(`/chat/${res.conversation.id}`);
      } else {
        console.error("No conversation returned:", res);
      }
    } catch (err) {
      console.error("Start chat error:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  // 🔍 Search for a user
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/users/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSearchedUser(data.user);
      else alert(data.message || "User not found");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 💬 Toggle comments for a post
  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      {/* Top Title */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10 tracking-tight">
        Your Feed
      </h1>
  
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ------------------ FEED POSTS ------------------ */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{post.author}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Post Content */}
            {post.content && (
              <p className="px-4 pb-3 text-gray-800 text-sm">{post.content}</p>
            )}
  
            {/* Media */}
            {post.media_url && (
              <>
                {post.media_url.endsWith(".mp4") ? (
                  <video
                    src={`https://teen-talks-backend.onrender.com/api/v1${post.media_url}`}
                    controls
                    className="w-full aspect-square object-cover bg-black"
                  />
                ) : (
                  <img
                    src={`https://teen-talks-backend.onrender.com/api/v1${post.media_url}`}
                    className="w-full aspect-square object-cover"
                  />
                )}
              </>
            )}
  
            {/* Icons Row */}
            <div className="px-4 pt-4 flex gap-4 items-center">
              <LikeButton postId={post.id} />
              <button
                onClick={() => toggleComments(post.id)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChatBubbleSolid
                  className={`w-6 h-6 ${
                    expandedPost === post.id ? "text-pink-500" : "text-gray-700"
                  }`}
                />
              </button>
            </div>
  
            {/* Comments Section */}
            {expandedPost === post.id && (
              <div className="px-4 pb-4 mt-3 bg-gray-50 rounded-xl">
                <CommentSection
                  postId={post.id}
                  initialLiked={post.liked}
                  initialCount={post.like_count}
                />
              </div>
            )}
          </div>
        ))}
  
        {/* ------------------ SEARCH USER ------------------ */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm mt-10">
          <h2 className="font-semibold text-gray-800 mb-3 text-lg">
            Search for a user 🔍
          </h2>
  
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter user ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm
                         focus:ring-2 focus:ring-pink-300 outline-none"
            />
  
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                         px-6 py-3 rounded-xl font-semibold shadow-md 
                         hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </div>
  
        {/* ------------------ SEARCHED USER RESULT ------------------ */}
        {searchedUser && (
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              {searchedUser.name}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{searchedUser.email}</p>
  
            <div className="flex gap-3">
              <button
                onClick={() => handleChatClick(searchedUser.id)}
                disabled={isStartingChat}
                className={`px-5 py-2.5 rounded-full text-white text-sm font-semibold transition 
                  ${
                    isStartingChat
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
              >
                {isStartingChat ? "Starting…" : "Chat"}
              </button>
  
              <FollowButton
                userId={searchedUser.id}
                token={localStorage.getItem("token")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default FeedPage;
