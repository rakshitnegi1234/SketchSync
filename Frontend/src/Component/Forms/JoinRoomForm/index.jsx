import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoomForm({ uuid, socket, setUser }) {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };
    setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/${roomId}`);
  };

  useEffect(() => {
    socket.on("BackOff", (message) => {
      alert(message);
    });
  }, [socket]);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h4 className="fw-bold mb-3 text-center">Join a Room</h4>

        <form onSubmit={handleJoin}>
          {/* Name Input */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Room ID Input */}
          <div className="mb-4">
            <label htmlFor="roomId" className="form-label fw-semibold">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              className="form-control"
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
          </div>

          {/* Join Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Join Whiteboard Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinRoomForm;
