import React from "react";
import "../index.css";

const Notification = ({ isError, message }) => {
  if (message === null) {
    return null;
  }

  const style = {
    background: "darkgray",
    borderRadius: 5,
    borderStyle: "solid",
    color: "purple",
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
  };

  if (isError) {
    style.color = "orange";
    style.fontSize = 25;
  }

  return (
    <div className="notification" style={style}>
      {message}
    </div>
  );
};

export default Notification;
