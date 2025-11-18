import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ChatList({ conversations, onSelectConversation }) {
  const { user } = useContext(AuthContext);

  // Note: Message updates are handled globally in ChatPage
  // ChatList will re-render automatically when conversations prop updates

  if (!conversations || conversations.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No conversations yet
      </p>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden p-4 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        Chats
      </h2>

      <div className="space-y-3 overflow-y-auto max-h-[70vh]">
        {conversations.map((conv) => {
          // Determine the partner
          const partner =
            conv.user1_id === user.id
              ? { id: conv.user2_id, name: conv.user2_name }
              : { id: conv.user1_id, name: conv.user1_name };

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-100 transition cursor-pointer"
            >
              <img
                src={"/default-avatar.png"}
                alt={partner?.name}
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />

              <div className="flex-1">
                <h3 className="font-medium text-gray-700">{partner?.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {conv.last_message || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
