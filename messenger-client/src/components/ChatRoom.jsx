import React, { useRef } from "react";
import "./ChatRoom.css";

export default (props) => {
  var { user, onSendMessage } = props;
  var ref = useRef();

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      const message = e.target.value
      onSendMessage(message, user.user_id)
      ref.value = ''
    }
  };

  return (
    <div id="chatroom">
      <div id="chat-header">{user.name}</div>
      <div id="chat-container">
        {/* {chats.map((chat) => (
          <Chat key={chat.id} {...chat} />
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
