import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import ProfilePictureUpload from "../components/ProfilePicture";
import { Trash2 } from "lucide-react";
import TopNav from "../components/TopNav";

import bannerImg from "../assets/bannerIng.png";
import bgImg from "../assets/bgImg.png";

const ProfilePage = () => {
  const { user, posts, setPosts } = useContext(AuthContext);
  const [expandedPost, setExpandedPost] = useState(null);
  const navigate = useNavigate();

  const navPost = () => navigate("/post-test");

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://teen-talks-backend.onrender.com/api/v1/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const updatedPosts = posts.filter((p) => p.id !== postId);
        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* ================= FIXED BACKGROUND ================= */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ================= CONTENT LAYER ================= */}
      <div className="relative fixed min-h-screen w-full">
        <TopNav />

        {/* ================= OVERLAY (GROWS WITH CONTENT) ================= */}
        <div className="w-ful l min-h-screen bg-gradient-to-b from-black/30 via-black/60 to-black flex flex-col items-center">

          {/* ================= BANNER ================= */}
          <div
            className="w-full h-48 md:h-64 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bannerImg})` }}
          />

          {/* ================= PROFILE CARD ================= */}
          <div className="w-full max-w-md -mt-24 px-6">
            <div className="relative bg-[#242424] rounded-3xl shadow-2xl px-6 pt-20 pb-8 flex flex-col items-center">

              <div className="absolute -top-14 rounded-full">
                <ProfilePictureUpload />
              </div>

              <h1 className="mt-10 text-xl font-semibold text-white">
                {user.name}
              </h1>

              <p className="text-gray-400 text-sm">
                @{user.name.toLowerCase()}
              </p>

              <p className="mt-4 text-center text-sm text-gray-300 leading-relaxed">
                ⭐ Hello, I'm UI / UX designer. Open to the new Project ⭐
              </p>

              <div className="mt-6 w-full flex justify-between text-center text-white">
                <div>
                  <p className="text-lg font-semibold">342</p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">12.5K</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">892</p>
                  <p className="text-xs text-gray-400">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CREATE POST ================= */}
          <button
            onClick={navPost}
            className="mt-8 bg-[#FFFD02] text-black font-bold px-6 py-2 rounded-xl shadow"
          >
            Create Post
          </button>

          {/* ================= POSTS ================= */}
          <div className="mt-14 w-full max-w-5xl px-6 pb-20">
            <h2 className="text-3xl font-extrabold text-gray-200 mb-6 text-center">
              Posts
            </h2>

            {posts?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#1f1f1f] rounded-2xl shadow border border-white/5 overflow-hidden"
                  >
                    {post.media_url &&
                      (post.media_url.endsWith(".mp4") ? (
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
                      ))}

                    <div className="p-3">
                      <div className="flex justify-between gap-2">
                        <p className="text-gray-300 text-sm flex-1">
                          {post.content}
                        </p>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="mt-2 text-blue-400 text-xs font-medium hover:underline"
                      >
                        {expandedPost === post.id
                          ? "Hide Comments ▲"
                          : "Show Comments ▼"}
                      </button>

                      {expandedPost === post.id && (
                        <div className="mt-3">
                          <CommentSection postId={post.id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-10">
                You haven't uploaded any posts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
