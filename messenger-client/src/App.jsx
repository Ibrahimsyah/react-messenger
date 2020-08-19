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

const objectToArray = (obj) => {
  return Object.keys(obj).map((key) => obj[key]);
};
function App() {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [chatList, setChatList] = useState({});
  const [isNewChat, setNewChat] = useState(false);
  const [me, setMe] = useState(null);
  useEffect(() => {
    io.on("message", (message) => {
      let chatData = chatList;
      const senderId = message.sender.user_id;
      if (!chatData[senderId]) {
        chatData[senderId] = {};
      }
      if (!chatData[senderId].messages) {
        chatData[senderId].messages = [];
      }
      if (!selected || senderId !== selected.user_id) {
        if (!chatData[senderId].unread) {
          chatData[senderId].unread = 0;
        }
        chatData[senderId].unread++;
      }
      chatData[senderId].messages.push(message);
      setChatList((a) => ({ ...a, ...chatData }));
    });
    return () => {
      io.removeAllListeners();
    };
  }, [me, selected]);

  const handleSelectFriend = (user) => {
    setSelected(user);
    console.log(user);
    setShowModal(false);
  };

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
      sender: me,
      receiverId: receiverId,
      message: message,
    });
  };

  return (
    <>
      <Modal visible={showModal} footer={null} closable={false}>
        <h3>{isNewChat ? "Select Receiver" : "Who are you?"}</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {isNewChat
            ? users
                .filter((user) => user.user_id !== me.user_id)
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
          <div className="chat-list-header">
            <Button
              onClick={() => {
                setNewChat(true);
                setShowModal(true);
              }}
            >
              New Chat
            </Button>
          </div>
          {objectToArray(chatList).map((userChat, idx) => (
            <div
              className="chat"
              onClick={() => handleClick(userChat)}
              key={idx}
            >
              {userChat.unread}
            </div>
          ))}
        </div>
        <div className="right">
          {selected ? (
            <ChatRoom
              user={selected}
              chats={chatList[selected.user_id]}
              onSendMessage={handleSendMessage}
            />
          ) : (
            "Keep Connected with Friends"
          )}
        </div>
      </div>
    </>
  );
}

export default App;
