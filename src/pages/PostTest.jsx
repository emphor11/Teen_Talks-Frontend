// src/pages/PostTest.jsx
import React, { useState, useContext } from "react";
import PostForm from "../components/PostForm";
import CommentSection from "../components/CommentSection";
import feedBg from "../assets/feed-bg.jpg";
import { AuthContext } from "../context/AuthContext";

const PostTest = () => {
  const { posts, setPosts } = useContext(AuthContext);

  // LOCAL STATE (for instant preview)
  const [localPosts, setLocalPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    // 1️⃣ Update local preview immediately
    setLocalPosts((prev) => [newPost, ...prev]);

    // 2️⃣ Update global AuthContext
    const updatedGlobalPosts = [newPost, ...posts];
    setPosts(updatedGlobalPosts);

    // 3️⃣ Optional: persist (only if you WANT persistence)
    localStorage.setItem("posts", JSON.stringify(updatedGlobalPosts));
  };

  return (
    <>
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `url(${feedBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* CONTENT */}
      <div className="relative min-h-screen flex flex-col items-center px-4 py-10">

        <h1 className="text-3xl font-bold text-white mb-8">
          Create a Post
        </h1>

        {/* POST FORM */}
        <div className="w-full max-w-xl p-6 bg-[#141414]/65 backdrop-blur-sm border border-white/10 rounded-2xl">
          <PostForm onPostCreated={handlePostCreated} />
        </div>

        {/* LOCAL PREVIEW POSTS */}
        <div className="w-full max-w-2xl flex flex-col gap-6 mt-10 pb-20">
          {localPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <p className="p-4 text-gray-800">{post.content}</p>

              {post.media_url && (
                post.media_url.endsWith(".mp4") ? (
                  <video
                    src={post.media_url}
                    controls
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                )
              )}

              <div className="p-4">
                <CommentSection postId={post.id} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default PostTest;
