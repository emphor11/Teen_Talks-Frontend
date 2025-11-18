// src/pages/FollowTest.jsx
import React, { useState } from "react";
import FollowButton from "../components/FollowButton";

const FollowTest = () => {
  const [users] = useState([
    { id: 9, name: "John Doe", followed: false },
    { id: 13, name: "Emphor", followed: true },
  ]);

  return (
    <div>
      <h1>Follow Test</h1>
      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <strong>{user.name}</strong>{" "}
          <FollowButton targetUserId={user.id} initialFollowed={user.followed} />
        </div>
      ))}
    </div>
  );
};

export default FollowTest;
