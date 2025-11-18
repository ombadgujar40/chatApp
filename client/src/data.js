// src/data.js
export const CURRENT_USER = "me";

export const users = [
  { id: "u1", name: "Alice", avatar: "A" },
  { id: "u2", name: "Bob", avatar: "B" },
  { id: "u3", name: "Cara", avatar: "C" },
  { id: "me", name: "You", avatar: "ME" }
];

const now = Date.now();

export const chats = [
  { id: "c1", type: "dm", title: "Alice", members: ["me", "u1"], lastMessageId: "m2" },
  { id: "c2", type: "dm", title: "Bob", members: ["me", "u2"], lastMessageId: "m4" },
  { id: "c3", type: "group", title: "Dev Team", members: ["me", "u1", "u2", "u3"], lastMessageId: "m6" }
];

export const messages = [
  { id: "m1", chatId: "c1", sender: "u1", text: "Hey! Are you free today?", ts: now - 1000 * 60 * 60, status: "delivered" },
  { id: "m2", chatId: "c1", sender: "me", text: "Yes, free after 5pm", ts: now - 1000 * 60 * 55, status: "delivered" },
  { id: "m3", chatId: "c2", sender: "u2", text: "Please review my PR.", ts: now - 1000 * 60 * 40, status: "delivered" },
  { id: "m4", chatId: "c2", sender: "me", text: "On it — will do in an hour.", ts: now - 1000 * 60 * 30, status: "delivered" },
  { id: "m5", chatId: "c3", sender: "u3", text: "Standup in 5", ts: now - 1000 * 60 * 10, status: "delivered" },
  { id: "m6", chatId: "c3", sender: "u1", text: "Noted", ts: now - 1000 * 60 * 8, status: "delivered" }
];
