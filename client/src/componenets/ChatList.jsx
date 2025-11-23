import React, { useMemo, useEffect, useState } from "react";
import { users } from "../data.js";
import { useAuth } from "../context/authContext.jsx";
import { useChat } from "../context/chatsContext.jsx";
import axios from "axios";
import SearchUserModal from "./SearchUserModal";

const LastMessage = ({ lastMessageId }) => {
  const { fetchLastMessage } = useChat();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!lastMessageId) return;
    fetchLastMessage(lastMessageId).then((data) => {
      if (data?.ok && data?.message) {
        setText(data.message.text);
      }
    });
  }, [lastMessageId]);

  return <>{text}</>;
};

export default function ChatListStatic({ users, me, onChatCreated, msg }) {
  const { token, loading } = useAuth();
  const { fetchMessages, fetchLastMessage, setSelectedChatDetails } = useChat();
  const [senderid, setSenderid] = useState(null);
  const [receiverid, setReceiverid] = useState(null);
  const [chats, setChats] = useState([]);

  const handleUserClick = async (chat) => {
    setReceiverid(chat._id);
    fetchMessages(chat._id);
    setSelectedChatDetails(chat);
  };

  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter((user) => {
    const chatName = user?.title
      ? user?.title
      : user?.members.filter((mem) => mem?._id !== me?._id)[0]?.name;
    return chatName?.toLowerCase().includes(search.toLowerCase());
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="overflow-auto flex-1 pr-1">
      <div className="mt-2 flex items-center">
        <input
          placeholder="Search..."
          className="w-[90%] ml-1 px-3 py-2 rounded-lg bg-transparent border border-white/5 text-sm text-muted"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="ml-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 font-bold text-[1rem] cursor-pointer py-2 rounded-lg bg-transparent border border-white/5 text-sm text-muted hover:bg-white/5 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      {filteredUsers?.map((user) => {
        return (
          <div
            key={user._id}
            className="flex gap-3 items-center p-3 rounded-lg cursor-pointer bg-accent/10"
            onClick={() => handleUserClick(user)}
          >
            <div className="w-10 h-10 rounded-md bg-avatar-gradient flex items-center justify-center font-semibold text-slate-900">
              {user?.title
                ? user?.title.slice(0, 1)
                : user?.members
                    .filter((mem) => mem?._id !== me?._id)[0]
                    .name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-muted text-sm">
                {user?.title
                  ? user?.title
                  : user?.members.filter((mem) => mem?._id !== me?._id)[0].name}
              </div>
              <div className="text-xs text-muted">
                <LastMessage lastMessageId={user?.lastMessageId} />
              </div>
            </div>
          </div>
        );
      })}

      <SearchUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        me={me}
        onChatCreated={onChatCreated}
      />
    </div>
  );
}
