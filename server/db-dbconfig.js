// server/db-dbconfig.js
const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/chat_demo';
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDb;
