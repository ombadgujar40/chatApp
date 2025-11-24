// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./db-dbconfig");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const chatsRoutes = require("./routes/chats.routes");
const messagesRoutes = require("./routes/messages.routes");

// 1. Import HTTP and Socket.io
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

// 3. Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your Client URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

// API prefix
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, msg: "Chat testing server running" })
);

//socket logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User connects and joins their own personal room (so we can send them specific notifications)
  socket.on("setup", (userData) => {
    // console.log(userData?._id)
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Handling sending messages
  socket.on("new_message", (newMessageRecieved) => {
    // console.log(newMessageRecieved)
    var chat = newMessageRecieved.chatId; // Assuming the message object has chatId populated

    if (!chat) return console.log("Chat.users not defined");

    socket.to(chat).emit("message_received", newMessageRecieved);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

// 5. Listen using 'server', not 'app'
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
