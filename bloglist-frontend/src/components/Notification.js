import React from "react";

const Notification = (props) => {
  if (props.message === null) {
    return null;
  }

  const style = {
    background: "darkgray",
    borderRadius: 5,
    borderStyle: "solid",
    color: props.isError ? "purple" : "orange",
    fontSize: props.isError ? 20 : 25,
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
