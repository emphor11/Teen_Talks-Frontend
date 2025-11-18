import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content.trim());
    setContent("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex p-3 border-t border-gray-200 bg-white">
      <input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        onClick={handleSend}
        className="ml-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:scale-105 transition"
      >
        Send
      </button>
    </div>
  );
}
