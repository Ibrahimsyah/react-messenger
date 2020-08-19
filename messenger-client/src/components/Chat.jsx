import React from "react";
import "./Chat.css";
export default (props) => {
  const { message, mine } = props;
  return (
    <>
      <div
        className={`bubble-container ${mine ? "mine" : ""}`}
        onClick={props.onClick}
      >
        <div className="bubble">{message}</div>
      </div>
    </>
  );
};
