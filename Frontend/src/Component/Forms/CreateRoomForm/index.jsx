import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };
    setUser(roomData);
    socket.emit("hostJoined", roomData);
    navigate(`/${roomId}`);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow rounded-4 p-5"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="fw-bold text-center mb-4" style={{ color: "#333" }}>
          🎨 Create a New Room
        </h2>

        <form onSubmit={handleCreateRoom}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="form-label fw-semibold">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control shadow-sm"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Room ID Field with Actions */}
          <div className="mb-4">
            <label htmlFor="roomId" className="form-label fw-semibold">
              Room ID
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control shadow-sm"
                id="roomId"
                value={roomId}
                disabled
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setRoomId(uuid())}
              >
                Generate
              </button>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleCopy}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg shadow-sm">
              Start Whiteboard Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomForm;
