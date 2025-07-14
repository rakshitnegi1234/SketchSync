import React, { useEffect } from "react";
import Forms from "./Component/Forms/index.jsx";
import { Routes, Route } from "react-router-dom";
import RoomPage from "./Pages/RoomPage/index.jsx";
import io from "socket.io-client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const server = "https://sketchsync-3000.onrender.com";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

function App() {
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userJoinedMessageBroadcasted", (data) => {
      toast.info(`${data} user has Just Joined My Guys`);
    });

    socket.on("userLeftMessageBroadcasted", (data) => {
      toast.info(`${data} user has Left!!! `);
    });
  }, []);

  socket.on("allUsers", (data) => {
    setUsers(data);
  });

  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (
      S4() +
      S4() +
      "_" +
      S4() +
      "_" +
      S4() +
      "_" +
      S4() +
      "_" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="container">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}
        ></Route>
        <Route
          path="/:roomId"
          element={<RoomPage socket={socket} user={user} users={users} />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
