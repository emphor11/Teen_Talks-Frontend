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
    <div className="flex flex-col items-center relative ">
      <div className="bg-black rounded-full">
      <img
        src={
          user?.profile_pic
            ? `${user.profile_pic}`
            : "data:image/jpeg;base64,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"
        }
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover shadow-md "
      />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-gray-600"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-1.5 text-sm font-bold font-[Avenir]  text-black 
                   bg-yellow-300 rounded-full 
                   hover:bg-yellow-400 transition shadow"
      >
        {loading ? "Uploading..." : "Upload "}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
