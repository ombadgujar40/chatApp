// src/components/ChatItem.jsx
import React from "react";
import { byId, escapeHtml } from "../utils";

export default function ChatItem({ chat, lastMessage, active, onClick, users }) {
  return (
    <div onClick={onClick} className={`flex gap-3 items-center p-3 rounded-lg cursor-pointer ${active ? "bg-accent/10" : "hover:bg-white-2"}`}>
      <div className="w-10 h-10 rounded-md bg-avatar-gradient flex items-center justify-center font-semibold text-slate-900">
        {chat.type === "group" ? "G" : byId(users, chat.members.find(m => m !== "me"))?.avatar || "D"}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm text-muted">{escapeHtml(chat.title)}</div>
        <div className="text-xs text-muted">{lastMessage ? `${byId(users, lastMessage.sender).name}: ${escapeHtml(lastMessage.text)}` : "No messages yet"}</div>
      </div>
    </div>
  );
}
