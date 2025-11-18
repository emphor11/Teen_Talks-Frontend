import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import MessageInput from "./MessageInput";
import { getMessagesByConversation } from "../services/chatAPI";

export default function ChatBox({ receiver }) {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const conversationId = receiver?.conversation_id;

  // ✅ Load old messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        console.log(`📥 Loading messages for conversation ${conversationId}`);
        const data = await getMessagesByConversation(conversationId);
        const messagesArray = Array.isArray(data) ? data : data.messages || [];
        setMessages(messagesArray);
        console.log(`✅ Loaded ${messagesArray.length} messages for conversation ${conversationId}`);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // ✅ Also refresh messages when socket reconnects (to get any missed messages)
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleReconnect = () => {
      console.log("🔄 Socket reconnected, refreshing messages...");
      // Refresh messages after reconnection to catch any missed ones
      const fetchMessages = async () => {
        try {
          const data = await getMessagesByConversation(conversationId);
          const messagesArray = Array.isArray(data) ? data : data.messages || [];
          setMessages(messagesArray);
        } catch (err) {
          console.error("❌ Failed to refresh messages:", err);
        }
      };
      fetchMessages();
    };

    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("reconnect", handleReconnect);
    };
  }, [socket, conversationId]);

  // ✅ Subscribe to real-time updates - listen for ALL messages
  useEffect(() => {
    if (!socket || !conversationId) {
      console.log("⚠️ No socket or conversationId, not listening for messages");
      return;
    }

    const currentConvId = Number(conversationId);
    console.log(`👂 Listening for messages on conversation ${currentConvId}`);

    // Listen for new incoming messages - process if matches current conversation
    const handleNewMessage = (message) => {
      console.log("📨📨📨 Received newMessage event:", message);
      console.log("📨 Message conversationId:", message.conversation_id, "Type:", typeof message.conversation_id);
      console.log("📨 Current conversationId:", currentConvId, "Type:", typeof currentConvId);
      
      const messageConvId = Number(message.conversation_id);
      console.log("📨 Comparing:", messageConvId, "===", currentConvId, "?", messageConvId === currentConvId);
      
      // MUST match current conversation
      if (messageConvId === currentConvId) {
        console.log("✅✅✅ Message matches! Adding to state...");
        setMessages((prev) => {
          console.log("📦 Current messages count:", prev.length);
          console.log("📦 Message to add:", message);
          console.log("📦 Current messages:", prev);
          
          // Check for duplicates by ID only (not content/sender)
          const exists = prev.some((msg) => Number(msg.id) === Number(message.id));
          
          if (exists) {
            console.log("⚠️ Message with same ID already exists, skipping");
            const existing = prev.find(m => Number(m.id) === Number(message.id));
            console.log("📦 Existing message:", existing);
            return prev;
          }
          
          console.log("✅✅✅ Adding new message to state - NEW MESSAGE COUNT:", prev.length + 1);
          const newMessages = [...prev, message];
          console.log("📦 New messages array:", newMessages);
          console.log("📦 Last message in array:", newMessages[newMessages.length - 1]);
          return newMessages;
        });
        
        // Force a re-render check after state update
        setTimeout(() => {
          setMessages((current) => {
            const stillExists = current.some((msg) => Number(msg.id) === Number(message.id));
            if (!stillExists) {
              console.error("❌❌❌ MESSAGE NOT IN STATE AFTER UPDATE! Adding again...");
              return [...current, message];
            }
            return current;
          });
        }, 100);
      } else {
        console.log(`❌ Message doesn't match - message convId: ${messageConvId}, current: ${currentConvId}`);
      }
    };

    // Listen for confirmation of sent messages
    const handleMessageSent = (message) => {
      console.log("✅ Received messageSent:", message, "Current conversationId:", conversationId);
      // Compare with Number conversion to handle string/int mismatch
      if (Number(message.conversation_id) === Number(conversationId)) {
        setMessages((prev) => {
          // Replace optimistic message with real one and remove duplicates
          const hasRealMessage = prev.some((msg) => msg.id === message.id);
          if (hasRealMessage) {
            console.log("⚠️ Real message already exists, skipping");
            return prev;
          }
          
          console.log("✅ Replacing optimistic message with real one");
          // Replace optimistic message
          return prev.map((msg) => 
            msg.optimistic && msg.content === message.content && msg.sender_id === message.sender_id
              ? message
              : msg
          );
        });
      } else {
        console.log("⚠️ messageSent conversation_id doesn't match:", message.conversation_id, "!=", conversationId);
      }
    };

    // Register listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageError", (error) => {
      console.error("❌ Message send error:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.optimistic));
    });

    console.log(`✅✅✅ Registered socket listeners for conversation ${currentConvId}`);

    // Cleanup on unmount or when conversation changes
    return () => {
      console.log(`🧹 Cleaning up socket listeners for conversation ${currentConvId}`);
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageError");
    };
  }, [socket, conversationId]);

  // Debug: Log messages state changes
  useEffect(() => {
    console.log(`📊 Messages state updated - Total messages: ${messages.length}`);
    console.log(`📊 Messages:`, messages);
  }, [messages]);

  // ✅ Send message (socket handles DB persistence)
  const sendMessage = async (content) => {
    if (!conversationId || !content.trim() || !socket) {
      console.error("❌ Cannot send message - missing conversationId, content, or socket");
      return;
    }

    console.log("📤 Sending message:", { conversationId, receiverId: receiver.id, content });

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const newMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
      optimistic: true, // local marker
    };

    // 🪄 1️⃣ Optimistic UI - show message immediately
    setMessages((prev) => [...prev, newMessage]);

    // ⚡ 2️⃣ Emit real-time message (server will save to DB and broadcast)
    socket.emit("sendMessage", {
      conversationId: Number(conversationId), // Ensure it's a number
      receiverId: Number(receiver.id), // Ensure receiverId is a number
      content
    });

    // The socket event handlers will replace the optimistic message with the real one
    // If socket fails, we can keep optimistic message or show error
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <img
          src={receiver?.profile_pic || "/default-avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="font-semibold text-gray-800">{receiver?.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id || `temp-${msg.content}-${msg.created_at}`}
            className={`flex ${
              msg.sender_id === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs break-words ${
                msg.sender_id === user.id
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
