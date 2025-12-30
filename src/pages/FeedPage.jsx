// src/pages/FeedPage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import FollowButton from "../components/FollowButton";
import { useNavigate } from "react-router-dom";
import { startConversation } from "../services/chatAPI";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import TopNav from "../components/TopNav";

import feedBg from "../assets/feed-bg.jpg";

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

  /* ================= FETCH FEED ================= */
  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllPosts(data);
      setDisplayedPosts(data.slice(0, POSTS_PER_PAGE));
      if (data.length <= POSTS_PER_PAGE) setHasMore(false);
    };
    fetchFeed();
  }, []);

  /* ================= INFINITE SCROLL ================= */
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedPosts((prev) => {
              const next = allPosts.slice(
                prev.length,
                prev.length + POSTS_PER_PAGE
              );
              if (prev.length + next.length >= allPosts.length) {
                setHasMore(false);
              }
              return [...prev, ...next];
            });
            setIsLoadingMore(false);
          }, 1200);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isLoadingMore, allPosts]
  );

  /* ================= ACTIONS ================= */
  const toggleComments = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://teen-talks-backend.onrender.com/api/v1/users/${searchId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (res.ok) setSearchedUser(data.user);
  };

  const handleChatClick = async (receiverId) => {
    setIsStartingChat(true);
    const res = await startConversation(receiverId);
    navigate(`/chat/${res.conversation.id}`);
    setIsStartingChat(false);
  };

  return (
    <>
      {/* ================= FIXED BACKGROUND ================= */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `url(${feedBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
      <TopNav/>

      {/* ================= CONTENT ================= */}
      <div className="relative min-h-screen px-6 py-12 text-white">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font font-[Avenir] text-center mb-16 tracking-tight">
          Discover
          <span className="block w-20 h-[2px] bg-yellow-500 mx-auto mt-4 rounded-full" />
        </h1>

        <div className="flex gap-12 max-w-7xl mx-auto">

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="w-80 space-y-6 sticky top-24 self-start">
            <div className="bg-[#141414]/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <h2 className="text-lg font  mb-4 text-yellow-400">
                Find People
              </h2>

              <div className="flex gap-3">
                <input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="#Explore"
                  className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-yellow-500"
                />

                <button
                  onClick={handleSearch}
                  className="bg-[#FFFD02] text-black px-4 py-2 rounded-xl font-medium font-[Avenir] hover:bg-yellow-400 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {searchedUser && (
              <div className="bg-[#141414]/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <h3 className="font-semibold">{searchedUser.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {searchedUser.email}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleChatClick(searchedUser.id)}
                    disabled={isStartingChat}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-medium"
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
          </aside>

          {/* ================= FEED ================= */}
          <main className="flex-1 space-y-12 max-w-2xl">

            {displayedPosts.map((post, index) => (
              <article
                key={post.id}
                ref={
                  index === displayedPosts.length - 1
                    ? lastPostElementRef
                    : null
                }
                className="border border-white/10 rounded-3xl overflow-hidden"
              >
                {/* HEADER (GLASS BACKGROUND) */}
                <div className="relative px-5 py-4 flex items-center gap-3">
                  <div
                    className="
                      absolute inset-0
                      bg-[#161616]/60
                      supports-[backdrop-filter]:backdrop-blur-md
                      -z-10
                    "
                  />
                  <div className="relative flex items-center gap-3">
                    {post.dp?(<img src={post.dp} className="rounded-full w-full h-13"/>):
                    <img className="rounded-full w-full h-13" src="data:image/jpeg;base64,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"/>
                    }
                    
                    <div>
                      <p className="font-medium text-sm">
                        {post.author_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTENT (GLASS BACKGROUND) */}
                {post.content && (
                  <div className="relative px-5 pb-4">
                    <div
                      className="
                        absolute inset-0
                        bg-[#161616]/60
                        supports-[backdrop-filter]:backdrop-blur-md
                        -z-10
                      "
                    />
                    <p className="relative text-gray-300 font-extrabold font-[Cursive] leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* MEDIA (SOLID, NO GLASS) */}
                {post.media_url &&
                  (post.media_url.endsWith(".mp4") ? (
                    <video
                      src={post.media_url}
                      controls
                      className="w-full aspect-square object-cover bg-black"
                    />
                  ) : (
                    <img
                      src={post.media_url}
                      className="w-full aspect-square object-cover"
                      alt=""
                    />
                  ))}

                {/* ACTIONS (GLASS BACKGROUND) */}
                <div className="relative px-5 py-4 flex items-center gap-6 text-gray-400">
                  <div
                    className="
                      absolute inset-0
                      bg-[#161616]/60
                      supports-[backdrop-filter]:backdrop-blur-md
                      -z-10
                    "
                  />
                  <div className="relative flex  ">
                    <LikeButton postId={post.id} />
                    <button
                      onClick={() => toggleComments(post.id)}
                      className=" rounded-full hover:text-yellow-400 transition"
                    >
                      <ChatBubbleOvalLeftIcon className="w-5 h-5 -translate-y-2.5 -translate-x-7" />
                    </button>
                  </div>
                </div>

                {/* COMMENTS (GLASS BACKGROUND) */}
                {expandedPost === post.id && (
                  <div className="relative px-5 pb-5 border-t border-white/5">
                    <div
                      className="
                        absolute inset-0
                        bg-[#161616]/60
                        supports-[backdrop-filter]:backdrop-blur-md
                        -z-10
                      "
                    />
                    <div className="relative">
                      <CommentSection postId={post.id} />
                    </div>
                  </div>
                )}
              </article>
            ))}

            {isLoadingMore && (
              <p className="text-center text-gray-500">Loading more…</p>
            )}
            {!hasMore && (
              <p className="text-center text-gray-500">
                You’ve reached the end
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default FeedPage;
