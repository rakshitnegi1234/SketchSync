import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { addUser, getUser, getUsersInRoom, removeUser, users } from "./utils/user.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

let roomIdGlobal = false;
let imgURLGlobal;


io.on("connection", (socket) => {
  console.log("User connected");

   socket.on("hostJoined",(data)=>
  {
    roomIdGlobal = data.roomId;
    socket.join(roomIdGlobal);
    
    
     const newUser =  addUser({...data, socketId : socket.id});
      io.to(roomIdGlobal).emit("allUsers", newUser);
   
  });

  socket.on("userJoined", (userData) => {
    console.log(userData.roomId);

    if(roomIdGlobal === userData.roomId)
    {
     
       socket.join(roomIdGlobal);
       const newUser =  addUser({...userData, socketId : socket.id});
       io.to(roomIdGlobal).emit("allUsers", newUser);
       socket.broadcast.to(roomIdGlobal).emit("userJoinedMessageBroadcasted", userData.name)
       socket.emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });

    }
    else
    {
      console.log(userData.roomId);
      socket.emit("BackOff", "GO join the Correct Room Id BRO...");

    }

  });
    
  socket.on("whiteBoardData", (data) => {
    imgURLGlobal = data;
    socket.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });


  socket.on("message",(data)=>
  {
     io.to(roomIdGlobal).emit("samemessage",data);

  });

  socket.on("disconnect", () => {

    const user = getUser(socket.id);
    
if (user) {
  socket.broadcast.to(user.roomId).emit("userLeftMessageBroadcasted", `${user.name} has left`);
  removeUser(user.userId);
}

  
})
 
});
