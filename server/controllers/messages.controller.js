// server/controllers/messages.controller.js
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const asyncHandler = require("../middlewares/asyncHandler");

exports.createMessage = asyncHandler(async (req, res) => {
  const { chatId, text } = req.body;
  const sender = req.userId;
  if (!chatId || !text)
    return res.status(400).json({ ok: false, msg: "chatId and text required" });

  const msg = await Message.create({
    chatId,
    sender,
    text,
    status: "delivered",
  });

  // update chat lastMessageId
  await Chat.findByIdAndUpdate(chatId, { lastMessageId: msg._id });

  const populated = await Message.findById(msg._id)
    .populate("sender", "name email")
    .lean();
  res.json({ ok: true, message: populated });
});

exports.getMessagesForChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 })
    .lean();
  res.json({ ok: true, messages });
});

exports.getMessagesForUser = asyncHandler(async (req, res) => {
  try {
    const loggedUserId = req.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: loggedUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedUserId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
});
