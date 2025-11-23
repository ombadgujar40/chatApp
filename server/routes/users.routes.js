// server/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, usersController.listUsers); // list users (protected)
router.get('/search', auth, usersController.searchUsers); // search users (protected)
router.get('/:id', auth, usersController.getUser); // get single user

module.exports = router;
