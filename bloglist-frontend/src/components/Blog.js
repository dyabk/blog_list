import { useState } from "react";

const Blog = ({ blog, handleLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const hideWhenVisible = { display: detailsVisible ? "none" : "" };
  const showWhenVisible = { display: detailsVisible ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={() => setDetailsVisible(true)}>
        view
      </button>
      <button style={showWhenVisible} onClick={() => setDetailsVisible(false)}>
        hide
      </button>
      <div style={showWhenVisible}>
        {blog.url}
        <br />
        likes {blog.likes}
        <button onClick={() => handleLike(blog.id)}>like</button>
        <br />
        {blog.user.name}
      </div>
    </div>
  );
};

export default Blog;
