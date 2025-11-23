// server/routes/messages.routes.js
const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/chats', chatsRoutes);
// app.use('/api/messages', messagesRoutes);

router.post("/", messagesController.createMessage); // create message
router.get("/chat/:chatId", messagesController.getMessagesForChat); // get messages for chat
router.get("/userChat/:userId", messagesController.getMessagesForUser); // get messages for user

module.exports = router;
