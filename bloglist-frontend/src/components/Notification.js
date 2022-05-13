import React from "react";

const Notification = (props) => {
  if (props.message === null) {
    return null;
  }

  const style = {
    background: "darkgray",
    borderRadius: 5,
    borderStyle: "solid",
    color: props.error ? "red" : "blue",
    fontSize: props.error ? 25 : 20,
    marginBottom: 10,
    padding: 10,
  };

  return (
    <div className="notification" style={style}>
      {props.message}
    </div>
  );
};

export default Notification;
