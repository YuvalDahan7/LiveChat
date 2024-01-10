const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const QuestionModel = require("./models/Question");

const { Server } = require("socket.io");
app.use(cors());

mongoose.connect("mongodb+srv://YuvalDahan:TennisBall1632@cluster0.aqrxafv.mongodb.net/", {dbName: "LiveCoding"})
const server = http.createServer(app);

app.get('/getQuestion', (req, res) => {
     QuestionModel.find()
    .then(questions => res.json(questions))
    .catch(err => res.json(err))
})

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {

  console.log("User:", socket.id, "-", "Connected");
  socket.on("join_room", (room, callback) => {
    socket.join(room);
    const roomSize = io.sockets.adapter.rooms.get(room).size;
    console.log("Amount of clients at the room:", roomSize);
    if (roomSize === 1) {
        callback("Mentor");
    }
    else {
        callback("Student");
    }
  });

  socket.on("send-changes", (data) => {
    socket.broadcast.emit("receive-changes", data);
  });

  socket.on("edit_code", (data) => {
    console.log(data);
    socket.to(data.room).emit("update_code", data.text);
  });

  socket.on("clear_textArea", () => {
    io.emit("clear_textArea");
    console.log("Text cleared!")
  });
  
  socket.on("leave-room", (room) => {
    console.log("User left the room");
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log("User:", socket.id, "-", "Disconnected");
  });

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
