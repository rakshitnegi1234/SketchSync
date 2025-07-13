import { useEffect, useRef, useState } from "react";
import Chat from "../../Component/ChatBar";
import WhiteBoard from "../../Component/WhiteBoard";
import "./index.css";

function RoomPage({ socket, user, users }) {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [element, setElement] = useState([]);
  const [openUserTab, setOpenUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Undo
  const handleHistory = () => {
    if (element.length === 1) {
      handleClear();
    } else {
      setElement((prev) => prev.slice(0, -1));
    }
  };

  // Clear
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; // fixed fillReact
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElement([]);
  };

  // Optional: clear socket listeners on unmount
  useEffect(() => {
    return () => {
      socket.off("whiteBoardDataResponse");
    };
  }, [socket]);

  return (
    <div className="container-fluid py-4">
      {/* Floating Chat/User Buttons */}
      <div
        className="position-fixed d-flex gap-2"
        style={{ top: "20px", left: "20px", zIndex: 1050 }}
      >
        <button
          type="button"
          className="btn btn-dark shadow-sm px-3 py-2 rounded-3 fw-semibold"
          onClick={() => setOpenUserTab(true)}
        >
          Users
        </button>

        <button
          type="button"
          className="btn btn-primary shadow-sm px-3 py-2 rounded-3 fw-semibold"
          onClick={() => setOpenedChatTab(true)}
        >
          Chats
        </button>
      </div>

      {/* User Sidebar */}
      {openUserTab && (
        <div
          className="position-fixed top-0 start-0 h-100 bg-dark text-white shadow-lg"
          style={{ width: "300px", zIndex: 1050 }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
            <h5 className="mb-0">Users</h5>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => setOpenUserTab(false)}
            >
              Close
            </button>
          </div>

          <div
            className="overflow-auto px-3 py-4"
            style={{ height: "calc(100% - 60px)" }}
          >
            {users && users.length > 0 ? (
              users.map((usr, index) => (
                <div
                  key={usr.userId || index}
                  className={`text-center py-2 px-3 mb-2 rounded bg-${
                    user?.userId === usr.userId ? "primary" : "secondary"
                  } text-white`}
                >
                  {usr.name} {user?.userId === usr.userId && <span>(You)</span>}
                </div>
              ))
            ) : (
              <div className="text-muted text-center mt-5">
                No users online.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Sidebar */}
      {openedChatTab && (
        <Chat setOpenedChatTab={setOpenedChatTab} user={user} socket={socket} />
      )}

      {/* Title */}
      <h1 className="text-center mb-4 fw-bold">
        SketchSync{" "}
        <span className="text-muted fs-5">
          [Users Online: {users.length || 1}]
        </span>
      </h1>

      {/* Tools Panel */}
      <div className="row justify-content-center align-items-center gy-3 gx-4">
        {/* Tool Selector */}
        <div className="col-auto d-flex align-items-center gap-3 border rounded p-2 shadow-sm bg-white">
          {["pencil", "line", "rect"].map((item) => (
            <div key={item} className="d-flex align-items-center gap-1">
              <label htmlFor={item} className="me-1 text-capitalize">
                {item}
              </label>
              <input
                type="radio"
                name="tool"
                id={item}
                value={item}
                checked={tool === item}
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Color Picker */}
        <div className="col-auto d-flex align-items-center gap-2">
          <label htmlFor="color" className="fw-semibold">
            Select Color:
          </label>
          <input
            type="color"
            id="color"
            className="form-control form-control-color border border-dark"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {/* Undo Button */}
        <div className="col-auto">
          <button className="btn btn-primary shadow-sm" onClick={handleHistory}>
            Undo
          </button>
        </div>

        {/* Clear Button */}
        <div className="col-auto">
          <button className="btn btn-danger shadow-sm" onClick={handleClear}>
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div
        className="canvax-box mt-4 mx-auto rounded shadow border border-dark overflow-hidden"
        style={{ maxWidth: "1200px", height: "600px" }}
      >
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          element={element}
          setElement={setElement}
          tool={tool}
          color={color}
          socket={socket}
          user={user}
        />
      </div>
    </div>
  );
}

export default RoomPage;
