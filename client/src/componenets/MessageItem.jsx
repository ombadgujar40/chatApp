// src/components/MessageItem.jsx
import React from "react";
import { CURRENT_USER } from "../data";
import { byId, escapeHtml } from "../utils";

export default function MessageItem({ m, users }) {
  return (
    <div className={`max-w-[70%] p-3 rounded-xl ${m.sender === CURRENT_USER ? "ml-auto bg-me-gradient text-cyan-50" : "bg-white-6"}`}>
      <div className="text-xs text-muted mb-1">
        {byId(users, m.sender).name} · {new Date(m.ts).toLocaleTimeString()}
      </div>
      <div className="text-sm">{escapeHtml(m.text)}</div>
    </div>
  );
}
    