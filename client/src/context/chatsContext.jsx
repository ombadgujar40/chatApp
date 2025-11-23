import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./authContext";
import api from "../utils/axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch all chats for the logged-in user
  const fetchChats = async () => {
    if (!token || !user) {
      setLoadingChats(false);
      return;
    }
    setLoadingChats(true);
    try {
      const response = await api.get("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  // Fetch messages for a selected chat
  const fetchMessages = async (selectedChat) => {
    if (!token || !selectedChat) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      const response = await api.get(`/api/messages/chat/${selectedChat}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a new message
  const sendMessage = async (chatId, content) => {
    if (!token || !chatId || !content) return;
    try {
      const response = await api.post(
        `/api/messages/${chatId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]);
      // Optionally update the last message in the chat list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const setSelectedChatDetails = (selectedChat) => {
    if (selectedChat) {
      setSelectedChat(selectedChat);
    } else {
      setSelectedChat({});
    }
  };

  const fetchLastMessage = async (lastMessageId) => {
    if (!token || !lastMessageId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      const response = await api.get(`/api/chats/lastmsg/${lastMessageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
    } finally {
      setLoadingMessages(false);
    }
  };

  const value = {
    chats,
    selectedChat,
    messages,
    loadingChats,
    loadingMessages,
    fetchChats,
    fetchMessages,
    sendMessage,
    setSelectedChat,
    setSelectedChatDetails,
    setMessages,
    fetchLastMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
