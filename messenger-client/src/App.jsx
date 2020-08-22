import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import ChatRoom from "./components/ChatRoom";
import io from "./providers/socket";
import "./App.css";

const objectToArray = (obj) => Object.keys(obj).map((key) => obj[key]);

function App() {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [chatList, setChatList] = useState({});
  const [isNewChat, setNewChat] = useState(false);
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    io.on("user-list", (res) => setUsers(res));
    io.on("room-information", (room) => setRoom(room));
    io.on("new-message", (message) => {
      var list = chatList;

      const user = message.from.id === me.id ? message.to : message.from;
      if (!list[user.id]) {
        list[user.id] = {};
      }
      list[user.id].user = user;
      if (!list[user.id].messages) {
        list[user.id].messages = [];
      }
      message.message.isMine = message.from.id === me.id
      list[user.id].messages.push(message.message);
      setChatList({ ...list });
    });

    return () => {
      io.removeAllListeners();
    };
  }, [me, chatList]);

  useEffect(() => {
    io.emit("get-user");
  }, []);

  const handleAddChat = () => {
    setNewChat(true);
    setShowModal(true);
  };

  const handleUserSelection = (user) => {
    setMe(user);
    setShowModal(false);
    io.emit("join", user.id);
  };

  const handleSelectFriend = (user) => {
    io.removeListener("join-room");
    setSelected(user);
    setShowModal(false);
    io.emit("join-room", me.id, user.id);
  };

  const handleItemListClick = (chat) => {
    setSelected(chat.user)
    io.emit('join-room', me.id, chat.user.id)
  };

  const populateChat = (id) => chatList[id] ? chatList[id].messages : []

  return (
    <>
      <Modal visible={showModal} footer={null} closable={false}>
        <h3>Select ur character</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {isNewChat
            ? users
                .filter((user) => user.id !== me.id)
                .map((user, idx) => (
                  <Button key={idx} onClick={() => handleSelectFriend(user)}>
                    {user.name}
                  </Button>
                ))
            : users.map((user, idx) => (
                <Button key={idx} onClick={() => handleUserSelection(user)}>
                  {user.name}
                </Button>
              ))}
        </div>
      </Modal>
      <div className="container">
        <div className="left">
          <div className="chat-header">
            <div className="title">
              <h1>Messages</h1>
              <Button onClick={handleAddChat}>+</Button>
            </div>
            <input
              type="text"
              placeholder="Cari Orang"
              className="search-bar"
            />
          </div>
          {objectToArray(chatList).map((message, idx) => (
            <div
              className="chat"
              onClick={() => handleItemListClick(message)}
              key={idx}
            >
              <img src={message.user.image} alt="" className="chat-image" />
              <div className="chat-body">
                <h4>{message.user.name}</h4>
                {message.messages[message.messages.length - 1].message}
              </div>
            </div>
          ))}
        </div>
        <div className="right">
          {room ? (
            <ChatRoom room={room} me={me} chats={populateChat(selected.id)} />
          ) : (
            <div className="welcome">
              <img
                src="data:image/png;base64,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"
                alt=""
              />
              <h1>Keep Connected with Friends</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
