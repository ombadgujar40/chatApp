import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ChatListStatic from "./ChatList";
import MessageListStatic from "./MessageList";
import { useAuth } from "../context/authContext.jsx";
import { useChat } from "../context/chatsContext.jsx";
import axios from "axios";

// 1. Import Socket Client
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000"; // Your Server URL
var socket;


export default function ChatAppStatic() {
  const { token, user } = useAuth();
  const { fetchChats, selectedChat, messages, setMessages } = useChat();
  const [text, setText] = useState("")
  const [users, setUsers] = useState([])

  // Track socket connection
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    }
  }, [user])

  useEffect(() => {
    if (!selectedChat) return;
    socket.emit("join_chat", selectedChat._id);
  }, [selectedChat]);

  // 3. Listen for incoming messages
  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      // Only update UI if the incoming message belongs to the currently selected chat
      if (selectedChat && selectedChat._id === newMessageReceived.chatId) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      } else {
        // Optional: Handle notification logic here for other chats
      }
    };

    socket.on("message_received", handleMessageReceived);

    // Cleanup listener to prevent duplicates
    return () => {
      socket.off("message_received", handleMessageReceived);
    };
  }, [selectedChat, setMessages]);

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const resp = await axios.get("http://127.0.0.1:5000/api/chats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await resp.data.chats
      setUsers(data)
    } catch (error) {
      console.log(error)
    }
  }

  const sendMessage = async () => {
    try {
      const resp = await axios.post("http://127.0.0.1:5000/api/messages", {
        chatId: selectedChat._id,
        text: text
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await resp.data.message
      // console.log(data)
      // 5. Emit Socket Message after successful DB save
      // Pass the full message object (including populated sender/chat info if possible)
      // If your API response 'data' contains the full message object:
      socket.emit("new_message", { ...data, chatId: selectedChat._id });
      // Update local state immediately
      setMessages([...messages, data]);
      setText("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-gradient p-6">
      <div className="w-full max-w-5xl h-[640px] rounded-xl overflow-hidden grid grid-cols-[320px_1fr] shadow-2xl bg-cardbg-40">

        {/* Sidebar */}
        <aside className="p-4 bg-transparent flex flex-col gap-4 border-r border-white-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-avatar-gradient flex items-center justify-center font-semibold text-slate-900">ME</div>
            <div>
              <div className="font-semibold text-white">You</div>
              <div className="text-sm text-muted">online</div>
            </div>
          </div>

          <SearchBar value="" onChange={() => { }} />
          <ChatListStatic users={users} me={user} />
        </aside>

        {/* Static Chat Window */}
        <main className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white-5">
            <div>
              <div className="font-bold text-amber-600 text-lg">{selectedChat?.title ? selectedChat?.title : selectedChat?.members?.filter(mem => mem._id !== user._id)[0].name}</div>
              <div className="text-sm text-muted">{(selectedChat?.type)?.toUpperCase()}</div>
            </div>
            <div className="text-sm text-muted">You, {user?.name} <br /> {selectedChat?.members.filter(mem => mem._id !== user._id).map(mem => { return (`${mem.name}, `) })}</div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <MessageListStatic messages={messages} />
          </div>

          <div className="px-4 pb-2 text-sm text-muted"> </div>

          {/* Composer still looks there but does nothing */}
          <div className="p-3 border-t border-white/5 flex gap-3 items-center">
            <input
              placeholder="Type a message"
              className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-white/5 text-sm text-muted"
              // disabled
              value={text}
              onChange={(e) => { setText(e.target.value) }}
            />
            <button disabled={false} onClick={sendMessage} className="px-4 py-2 bg-accent text-slate-900 rounded-lg font-semibold opacity-40">
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
