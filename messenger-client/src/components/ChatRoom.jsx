import React, { useRef, useEffect } from "react";
import io from '../providers/socket'
import "./ChatRoom.css";

export default (props) => {
  var { user, onSendMessage, me } = props;
  var ref = useRef();
  var container = useRef();
  const sendMessage = (e) => {
    if (e.key === "Enter") {
      ref.value = "";
    }
  };

  useEffect(() => {
    container.style.scrollBehavior = 'smooth'
    const a = container.querySelectorAll(".bubble");
    setTimeout(() => {
      container.scrollTop = a.length > 0 ? a[a.length - 1].scrollHeight : 0;
    }, 100);
  });

  useEffect(() => {
    io.emit('join-room', me.id, user.id)
    return () => {
      io.removeListener('join-room')
    }
  }, [user])
  return (
    <div id="chatroom">
      <div id="chat-header">
        <img src={user.image} alt="" className="chat-image" />
        <p style={{ marginLeft: "10px" }}>{user.name}</p>
      </div>
      <div id="chat-container" ref={(el) => (container = el)}>
        {/* {user.messages.map((chat) => (
          <Chat key={chat.id} {...chat} name={user.name} />
        ))} */}
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
