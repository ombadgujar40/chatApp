import React, { useRef, useEffect} from "react";
import { useAuth } from "../context/authContext.jsx";
import { useChat } from "../context/chatsContext.jsx";
import axios from "axios";



export default function MessageListStatic({messages}) {
  // const { messages } = useChat()
  const { token, user } = useAuth();

    // 1. Create Ref
  const messagesEndRef = useRef(null);
   // 2. Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, "0");

    const time = `${hours}:${minutes} ${ampm}`;
    return time;
  }

  return (
    <>
      <div className="space-y-3 max-h-[55vh] overflow-y-scroll custom-scrollbar">
        {messages ? messages?.map(message => {
          return (
            <div className={`max-w-[70%] p-3 rounded-xl ${user?.name === message.sender.name ? "ml-auto bg-me-gradient text-cyan-50 " : "bg-white-6"}`} key={message._id}>
              <div className="text-xs text-muted mb-1">{message.sender.name} • {getTime(message.updatedAt).toString()}</div>
              <div className="text-sm text-amber-50">{message.text}</div>
            </div>
          )
        }) : "Loading..."}
         <div ref={messagesEndRef} />
      </div>
    </>
  );
}
