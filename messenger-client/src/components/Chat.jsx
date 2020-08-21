import React from "react";
import "./Chat.css";
export default (props) => {
  const { message, isMine, replying, name } = props;
  const renderMessage = (message) => {
    if (message.includes("[img]")) {
      const src = message.split("[img]")[1];
      return <img src={src} alt="" className="chat-img"/>;
    } else {
      return message;
    }
  };
  return (
    <>
      <div
        className={`bubble-container ${isMine ? "mine" : ""}`}
        onClick={props.onClick}
      >
        <div className={`bubble ${isMine ? "bubble-mine" : ""}`}>
          {replying && (
            <div className="chat-reply">
              {!replying.isMine && <h5 className="reply-name">{name}</h5>}
              {renderMessage(replying.message)}
            </div>
          )}
          {renderMessage(message)}
        </div>
      </div>
    </>
  );
};
