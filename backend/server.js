
// const express = require("express");
// const app = express();
// const { addUser, removeUser, getUser } = require("./utils/users");
// const server = require("http").createServer(app);
// const { Server } = require("socket.io");

// const io = new Server(server);

// // routes
// app.get("/", (req, res) => {
//   res.send("This is mern realtime white board sharing app");
// });

// let roomIdGlobal, imgURLGlobal;
// io.on("connection", (socket) => {
//   socket.on("userJoined", (data) => {
//     const { name, userId, roomId, host, presenter } = data;
//     roomIdGlobal = roomId;         // problem
//     socket.join(roomId);
//     const users = addUser({ name, userId, roomId, host, presenter, socketId:socket.id });
//     socket.emit("userIsJoined", { success: true, users});
//     socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name)
//     socket.broadcast.to(roomId).emit("allUsers", users);
//     socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
//       imgURL: imgURLGlobal,
//     });
//   });

//   socket.on("whiteboardData", (data) => {
//     imgURLGlobal = data;
//     socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
//       imgURL: data,
//      });
//   });

//   socket.on("disconnect",()=>{
//     const user = getUser(socket.id);
    
//     if(user){
//       removeUser(socket.id);
//       socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted",user.name);
//     }
    
//   })
// });

// const port = process.env.PORT || 5000;
// server.listen(port, () => console.log("server is started"));


const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser } = require("./utils/users");
const io = new Server(server);

// routes
app.get("/", (req, res) => {
  res.send("This is mern realtime white board sharing app");
});

let roomIdGlobal, imgURLGlobal;
io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId; // problem
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(roomIdGlobal)
        .emit("messageResponse", { message, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcasted", user.name);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("server is started"));