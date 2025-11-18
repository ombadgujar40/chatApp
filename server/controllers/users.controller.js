// server/controllers/users.controller.js
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

exports.listUsers = asyncHandler(async (req, res) => {
  if(!req.userId) return res.status(401).json({ ok: false, msg: 'Unauthorized' })
  const users = await User.find().select('-password').lean();
  res.status(200).json({ok: true, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password').lean();
  if (!user) return res.status(404).json({ ok: false, msg: 'User not found' });
  res.json({ ok: true, user });
});
