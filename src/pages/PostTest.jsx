// src/pages/PostTest.jsx
import React, { useState } from "react";
import PostForm from "../components/PostForm";
// import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";

const PostTest = () => {
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // add the new post to top
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        Create a Post
      </h1>
  
      {/* Post Form Container */}
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <PostForm onPostCreated={handlePostCreated} />
      </div>
  
      {/* Posts Feed */}
      <div className="w-full max-w-2xl flex flex-col gap-6 mt-10">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <p className="text-gray-900 font-semibold text-sm">You</p>
                <p className="text-gray-500 text-xs">Just now</p>
              </div>
            </div>
  
            {/* Post Content */}
            <p className="px-4 text-gray-800 text-sm mb-3">{post.content}</p>
  
            {/* Media */}
            {post.media_url && post.media_url.endsWith(".mp4") ? (
              <video
                className="w-full aspect-square object-cover bg-black"
                controls
              >
                <source src={post.media_url} type="video/mp4" />
              </video>
            ) : (
              post.media_url && (
                <img
                  className="w-full aspect-square object-cover"
                  src={post.media_url}
                  alt="post media"
                />
              )
            )}
  
            {/* Divider */}
            <div className="h-px w-full bg-gray-100 mt-4"></div>
  
            {/* Comments */}
            <div className="p-4">
              <CommentSection postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default PostTest;
