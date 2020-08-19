import React, { useEffect, useState } from "react";
import "./App.css";
import socketio from "socket.io-client";
import axios from "axios";
import { Modal, Button } from "antd";
import ChatRoom from "./components/ChatRoom";
import users from "./data/users";

const API_URL = "http://localhost:1234/";
const io = socketio.connect(API_URL);

axios.defaults.baseURL = API_URL;

function App() {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    io.on("message", (res) => {
      console.log(res);
    });
  }, []);

  const handleUserSelection = (user) => {
    setMe(user);
    setShowModal(false);
    io.emit("join", {
      user_id: user.user_id,
    });
  };

  const handleClick = (user) => {
    setSelected(user);
  };

  const handleSendMessage = (message, receiverId) => {
    io.emit("message", {
      senderId: me.user_id,
      receiverId: receiverId,
      message: message,
    });
  };

  return (
    <>
      <Modal visible={showModal} footer={null} closable={false}>
        <h3>Select ur character</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {users.map((user, idx) => (
            <Button key={idx} onClick={() => handleUserSelection(user)}>
              {user.name}
            </Button>
          ))}
        </div>
      </Modal>
      <div className="container">
        <div className="left">
          <div className="chat-list-header">Messenger</div>
          {me &&
            users
              .filter((user) => user.user_id !== me.user_id)
              .map((user, idx) => (
                <div
                  className="chat"
                  onClick={() => handleClick(user)}
                  key={idx}
                >
                  {user.name}
                </div>
              ))}
        </div>
        <div className="right">
          {selected ? (
            <ChatRoom user={selected} onSendMessage={handleSendMessage} />
          ) : (
            "Keep Connected with Friends"
          )}
        </div>
      </div>
    </>
  );
}

export default App;
