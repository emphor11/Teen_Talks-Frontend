// src/pages/FeedPage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import FollowButton from "../components/FollowButton";
import { useNavigate } from "react-router-dom";
import { startConversation } from "../services/chatAPI";
import { ChatBubbleOvalLeftIcon as ChatBubbleSolid } from "@heroicons/react/24/solid";

const FeedPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchedUser, setSearchedUser] = useState(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 5;

  // 📰 Fetch feed posts
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/posts/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Fetched posts:", data);
        setAllPosts(data);
        setDisplayedPosts(data.slice(0, POSTS_PER_PAGE));
        if (data.length <= POSTS_PER_PAGE) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Feed error:", err);
      }
    };
    fetchFeed();
  }, []);

  // Infinite Scroll Logic
  const lastPostElementRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Observer triggered. Visible. Loading more...");
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayedPosts(prevPosts => {
            const currentLength = prevPosts.length;
            console.log(`Current displayed: ${currentLength}, Total: ${allPosts.length}`);
            const nextPosts = allPosts.slice(currentLength, currentLength + POSTS_PER_PAGE);
            if (currentLength + nextPosts.length >= allPosts.length) {
              setHasMore(false);
            }
            return [...prevPosts, ...nextPosts];
          });
          setIsLoadingMore(false);
        }, 1500); // 1.5 second delay
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, allPosts, isLoadingMore]);


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
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10 tracking-tight">
        Your Feed
      </h1>

      {/* ---------------- MAIN LAYOUT: 2 COLUMNS ---------------- */}
      <div className="flex gap-8 ">

        {/* ---------------- LEFT SIDEBAR ---------------- */}
        <div className="w-80 space-y-6">

          {/* Search User Box */}
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
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
                        px-2 py-1 rounded-xl font-semibold shadow-md 
                        hover:scale-105 transition-all duration-300"
              >
                Search
              </button>
            </div>
          </div>

          {/* Searched User Result */}
          {searchedUser && (
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                {searchedUser.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchedUser.email}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleChatClick(searchedUser.id)}
                  disabled={isStartingChat}
                  className={`px-5 py-2.5 rounded-full text-white text-sm font-semibold transition 
                    ${isStartingChat
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

        {/* ---------------- FEED RIGHT SIDE ---------------- */}
        <div className="max-w-2xl w-full space-y-8">
          {displayedPosts.map((post, index) => {
            if (displayedPosts.length === index + 1) {
              return (
                <div
                  ref={lastPostElementRef}
                  key={post.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* HEADER */}
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

                  {/* CONTENT */}
                  {post.content && (
                    <p className="px-4 pb-3 text-gray-800 text-sm">{post.content}</p>
                  )}

                  {/* MEDIA */}
                  {post.media_url && (
                    post.media_url.endsWith(".mp4") ? (
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
                    )
                  )}

                  {/* ICONS */}
                  <div className="px-4 pt-4 flex gap-2 items-center">
                    <LikeButton postId={post.id} />

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                        className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12
                              c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483
                              4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0
                              2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                      </svg>
                    </button>
                  </div>

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
              );
            } else {
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* HEADER */}
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

                  {/* CONTENT */}
                  {post.content && (
                    <p className="px-4 pb-3 text-gray-800 text-sm">{post.content}</p>
                  )}

                  {/* MEDIA */}
                  {post.media_url && (
                    post.media_url.endsWith(".mp4") ? (
                      <video
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        controls
                        className="w-full aspect-square object-cover bg-black"
                      />
                    ) : (
                      <img
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        className="w-full aspect-square object-cover"
                      />
                    )
                  )}

                  {/* ICONS */}
                  <div className="px-4 pt-4 flex gap-2 items-center">
                    <LikeButton postId={post.id} />

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                        className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12
                              c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483
                              4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0
                              2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                      </svg>
                    </button>
                  </div>

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
              );
            }

          })}
          {isLoadingMore && <div className="text-center py-4 text-gray-500">Loading more posts...</div>}
          {!hasMore && displayedPosts.length > 0 && <div className="text-center py-4 text-gray-500">You have reached the end!</div>}
        </div>
      </div>
    </div>
  );


};

export default FeedPage;
