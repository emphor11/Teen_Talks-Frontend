import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import { getConversations } from "../services/chatAPI";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

export default function ChatPage() {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        const convArray = Array.isArray(data.conversations) ? data.conversations : [];
        setConversations(convArray);

        if (conversationId && convArray.length > 0) {
          const found = convArray.find((c) => c.id === parseInt(conversationId));
          if (found) setSelectedConversation(found);
        }
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };

    loadConversations();
  }, [conversationId]);

  // Global socket listener - handle new messages regardless of selected conversation
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (message) => {
      console.log("🌐 Global: Received newMessage:", message);
      
      // Refresh conversations list to show updated last message
      const refreshConversations = async () => {
        try {
          const data = await getConversations();
          const convArray = Array.isArray(data.conversations) ? data.conversations : [];
          
          // Update conversations
          setConversations((prev) => {
            // Update selection if message matches currently selected conversation
            setSelectedConversation((prevSelected) => {
              if (prevSelected && Number(message.conversation_id) === Number(prevSelected.id)) {
                const updated = convArray.find((c) => c.id === Number(message.conversation_id));
                return updated || prevSelected;
              }
              // If no conversation selected but message matches a conversation, auto-select it
              if (!prevSelected) {
                const matching = convArray.find((c) => c.id === Number(message.conversation_id));
                return matching || null;
              }
              return prevSelected;
            });
            
            return convArray;
          });
        } catch (err) {
          console.error("Error refreshing conversations:", err);
        }
      };

      refreshConversations();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user]);

  const getPartnerInfo = (conv) => {
    if (!conv || !user) return null;
    const isUser1 = conv.user1_id === user.id;
    return {
      conversation_id: conv.id, // 👈 include conversation ID
      id: isUser1 ? conv.user2_id : conv.user1_id,
      name: isUser1 ? conv.user2_name : conv.user1_name,
      profile_pic: "/default-avatar.png",
    };
  };

  const partner = getPartnerInfo(selectedConversation);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-200">
        <ChatList
          conversations={conversations}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      <div className="flex-1">
        {partner ? (
          <ChatBox receiver={partner} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
