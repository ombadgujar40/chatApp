// server/controllers/chats.controller.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const asyncHandler = require("../middlewares/asyncHandler");

exports.createChat = asyncHandler(async (req, res) => {
  const { title, type = "dm", members } = req.body;
  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ ok: false, msg: "members array required" });
  }

  // convert string ids to ObjectId as Mongoose will handle strings too
  const chat = await Chat.create({ title, type, members });
  res.json({ ok: true, chat });
});

exports.listChatsForUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const chats = await Chat.find({ members: userId })
    .populate("members", "name email")
    .lean();
  res.json({ ok: true, chats });
});

exports.getChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id).populate("members", "name email").lean();
  if (!chat) return res.status(404).json({ ok: false, msg: "Chat not found" });
  res.json({ ok: true, chat });
});

exports.getLastMessageForChat = asyncHandler(async (req, res) => {
  const { lastMessageId } = req.params;
  const lastMessage = await Message.findOne({ _id: lastMessageId }).lean();
  res.json({ ok: true, message: lastMessage });
});
