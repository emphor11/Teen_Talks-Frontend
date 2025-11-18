import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePictureUpload = () => {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a picture!");
  setLoading(true);

  const formData = new FormData();
  formData.append("profilePic", file);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://teen-talks-backend.onrender.com/api/v1/users/profile-pic", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    console.log("Response data:", data);

    if (data.success) {
      // ✅ Update state
      const updatedUser = { ...user, profile_pic: data.profile_pic };
      setUser(updatedUser);

      // ✅ Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("user",user)
      alert("Profile picture updated!");
    } else {
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload Error:", err);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex flex-col items-center space-y-3 mt-6">
      <img
        src={
          user?.profile_pic
            ? `https://teen-talks-backend.onrender.com/api/v1${user.profile_pic}`
            : "/default-avatar.png"
        }
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-pink-400 shadow-lg"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-gray-600"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition"
      >
        {loading ? "Uploading..." : "Upload Profile Picture"}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
