import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
    <div className="flex p-3 border-t  bg-[#212121]">
      <input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        className=" w-200  font-[Avenir]  text-white bg-white/15 rounded-2xl px-4 py-2 outline-none  "
      />
      <button
  type="submit"
  className="
    
    w-11 h-11
    rounded-full
    
    transition
    disabled:opacity-50
  "
  onClick={handleSend}
>
  <PaperAirplaneIcon className="w-7 h-7 text-white " />
</button>
    </div>
  );
}
