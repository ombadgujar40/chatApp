
import React, { useMemo, useEffect, useState } from "react";
import { users } from "../data.js"
import { useAuth } from "../context/authContext.jsx";
import { useChat } from "../context/chatsContext.jsx";
import axios from "axios";

export default function ChatListStatic({ users, me }) {
  const { token, loading } = useAuth()
  const { fetchMessages, messages, setSelectedChatDetails } = useChat()
  const [senderid, setSenderid] = useState(null)
  const [receiverid, setReceiverid] = useState(null)
  const [chats, setChats] = useState([])

  const handleUserClick = async (chat) => {
    setReceiverid(chat._id)
    fetchMessages(chat._id)
    setSelectedChatDetails(chat)
  }
  // console.log(me)
  // console.log(users[0]?.members.filter(mem => mem._id !== me._id)[0].name)

  return (

    <div className="overflow-auto flex-1 pr-1">
      {users?.map(user => {
        return (
          <div key={user._id} className="flex gap-3 items-center p-3 rounded-lg cursor-pointer bg-accent/10" onClick={() => handleUserClick(user)}>
            <div className="w-10 h-10 rounded-md bg-avatar-gradient flex items-center justify-center font-semibold text-slate-900">{user.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-muted text-sm">{user?.title ? user?.title : user?.members.filter(mem => mem._id !== me._id)[0].name }</div>
              <div className="text-xs text-muted">{messages?.lastMessageId?.text}</div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
