// server/routes/chats.routes.js
const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chats.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', chatsController.createChat); // create chat
router.get('/', chatsController.listChatsForUser); // list chats for logged-in user
router.get('/:id', chatsController.getChat); // get chat with members

module.exports = router;
