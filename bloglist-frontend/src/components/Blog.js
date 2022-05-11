import React, { useState } from "react";

const Blog = ({ blog, handleDelete, handleLike, user }) => {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [buttonText, setButtonText] = useState("view");

  const toggleInfo = () => {
    setButtonText(showFullInfo ? "view" : "hide");
    setShowFullInfo(!showFullInfo);
  };

  const deleteButton = () => {
    if (user.username !== blog.user.username) {
      return null;
    }

    return (
      <div>
        <button onClick={() => handleDelete(blog)}>delete</button>
      </div>
    );
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const fullInfo = () => (
    <div>
      <div>{blog.url}</div>
      <div>
        Likes: {blog.likes}&nbsp;
        <button className="button-like" onClick={() => handleLike(blog.id)}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      {deleteButton()}
    </div>
  );

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author} &nbsp;
        <button className="button-view" onClick={toggleInfo}>
          {buttonText}
        </button>
      </div>
      {showFullInfo ? fullInfo() : null}
    </div>
  );
};

export default Blog;
