import React, { useContext, useState } from "react";
// import FollowButton from "../components/FollowButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import ProfilePictureUpload from "../components/ProfilePicture";
import { Star, Clock, MessageCircle, Trash2 } from "lucide-react";


const ProfilePage = () => {
  const { user, posts, setPosts } = useContext(AuthContext);
  // const [searchId, setSearchId] = useState("");
  // const [searchedUser, setSearchedUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const navigate = useNavigate();

  const navPost = () => navigate("/post-test");

  // This now only handles toggling open/closed
  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state immediately
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);

        // Update localStorage to persist the change
        localStorage.setItem("posts", JSON.stringify(updatedPosts));

        alert("Post deleted successfully!");
      } else {
        alert(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Something went wrong");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">

      {/* Banner */}
      <div className="w-full h-40 md:h-56 bg-gradient-to-r from-teal-200 to-cyan-300" />

      {/* Profile Card */}
      <div className="w-full max-w-3xl -mt-16 px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">

          {/* Profile Picture */}
          <div className="w-32 h-42  overflow-hidden   -mt-20 mb-4">
            <ProfilePictureUpload />
          </div>

          {/* Name & Email */}
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 text-sm">@{user.name.toLowerCase()}</p>

          <p className="text-gray-600 mt-2 text-center max-w-md">
            Creative photographer capturing moments that matter ✨
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">342</span> Posts
            <span className="font-semibold text-gray-900">12.5K</span> Followers
            <span className="font-semibold text-gray-900">892</span> Following
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">



          </div>
        </div>
      </div>

      {/* Create Post */}
      <button
        onClick={navPost}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-600"
      >
        Create Post
      </button>

      {/* Posts Section */}
      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex gap-2 items-center">
          <Clock className="w-5 h-5 text-gray-600" /> My Uploaded Posts
        </h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
              >
                {post.media_url && (
                  <>
                    {post.media_url.endsWith(".mp4") ? (
                      <video
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        controls
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <img
                        src={`http://localhost:3000/api/v1${post.media_url}`}
                        alt=""
                        className="w-full aspect-square object-cover"
                      />
                    )}
                  </>
                )}

                <div className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-gray-700 text-sm flex-1">{post.content}</p>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="mt-2 text-blue-600 text-xs font-semibold hover:underline"
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
          <p className="text-gray-500 text-center mt-4">
            You haven't uploaded any posts yet.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate("/feed")}
        className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-md mt-10"
      >
        Go to Feed
      </button>
    </div>
  );

};

export default ProfilePage;
