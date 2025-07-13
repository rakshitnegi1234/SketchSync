import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import "./index.css";

const Forms = ({ uuid, socket, setUser }) => {
  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row w-100 px-3 px-md-5 gy-4 justify-content-center">
        {/* Create Room */}
        <div className="col-md-6">
          <div className="card shadow p-4 rounded-4 border-0 h-100">
            <h3 className="text-center fw-bold mb-4 text-primary">
              Create a New Room
            </h3>
            <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
          </div>
        </div>

        {/* Join Room */}
        <div className="col-md-6">
          <div className="card shadow p-4 rounded-4 border-0 h-100">
            <h3 className="text-center fw-bold mb-4 text-success">
              Join a Room
            </h3>
            <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;
