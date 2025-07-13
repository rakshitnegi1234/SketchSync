import React, { useEffect, useRef, useState } from "react";

function Chat({ setOpenedChatTab, user, socket }) {
  const msg = useRef(null);
  const [messages, setMessages] = useState([]);

  const handleMessages = () => {
    const messageText = msg.current.value.trim();
    if (!messageText) return;

    socket.emit("message", `${user?.name || "Anonymous"}: ${messageText}`);
    msg.current.value = "";
  };

  useEffect(() => {
    socket.on("samemessage", (MSG) => {
      setMessages((prev) => [...prev, MSG]);
    });

    return () => socket.off("samemessage");
  }, []);

  return (
    <div
      className="position-fixed top-0 start-0 h-100 bg-dark text-white shadow-lg"
      style={{ width: "400px", zIndex: 1050 }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
        <h5 className="mb-0">Live Chat</h5>
        <button
          onClick={() => setOpenedChatTab(false)}
          className="btn btn-outline-light btn-sm"
        >
          Close
        </button>
      </div>

      {/* Chat Messages Box */}
      <div
        className="flex-grow-1 overflow-auto p-3"
        style={{ height: "calc(100% - 130px)" }}
      >
        {messages.length === 0 ? (
          <div className="text-muted text-center">
            Chats will appear here...
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {messages.map((m, i) => (
              <div key={i} className="bg-secondary p-2 rounded text-white">
                {m}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-top border-secondary bg-black">
        <div className="input-group">
          <input
            type="text"
            placeholder="Type your message..."
            className="form-control bg-dark text-white border-secondary"
            ref={msg}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleMessages}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
