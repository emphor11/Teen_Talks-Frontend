const API_URL = "https://teen-talks-backend.onrender.com/api/v1/chat";

export const getConversations = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const data = await res.json(); // 👈 parse JSON
  console.log("✅ Conversations data:", data); // now you'll actually see the array
  return data;
};

export const getMessagesByConversation = async (conversationId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/messages/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const sendMessageRest = async (conversationId, content) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversationId, content }),
  });
  return res.json();
};

export const startConversation = async (receiverId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`https://teen-talks-backend.onrender.com/api/v1/chat/start/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("DATA:", data);
  return data;
};
