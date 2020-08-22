import React, { useRef, useEffect } from "react";
import io from "../providers/socket";
import Chat from './Chat'
import "./ChatRoom.css";

export default (props) => {
  var { room, me, chats} = props;
  var ref = useRef();
  var container = useRef();
  const sendMessage = (e) => {
    if (e.key === "Enter") {
      const message = ref.value;
      if (message.length > 0) {
        const payload = {
          from: me.id,
          to: room.user.id,
          roomID: room.id,
          message: message
        }
        io.emit("send-message", payload);
        ref.value = "";
      }
    }
  };

  useEffect(() => {
    container.style.scrollBehavior = "smooth";
    const a = container.querySelectorAll(".bubble");
    setTimeout(() => {
      container.scrollTop = a.length > 0 ? a[a.length - 1].scrollHeight : 0;
    }, 100);
  }, []);

  return (
    <div id="chatroom">
      <div id="chat-header">
        <img src={room.user.image} alt="" className="chat-image" />
        <p style={{ marginLeft: "10px" }}>{room.user.name}</p>
      </div>
      <div id="chat-container" ref={(el) => (container = el)}>
        {chats.map((chat) => (
          <Chat key={chat.id} {...chat} name={room.user.name} />
        ))}
      </div>
      <div id="chat-footer">
        <input
          type="text"
          ref={(el) => (ref = el)}
          id="chat-input"
          placeholder="Input Pesan Disini"
          onKeyDown={sendMessage}
        />
      </div>
    </div>
  );
};
