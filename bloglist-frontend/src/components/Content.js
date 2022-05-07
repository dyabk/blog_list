import { useState, useEffect, useRef } from "react";
import Blog from "./Blog";
import CreateNew from "./CreateNew";
import blogService from "../services/blogs";
import Togglable from "./Togglable";

const Content = (props) => {
  const [blogs, setBlogs] = useState([]);

  const setSortedBlogs = (blogs) => {
    setBlogs(blogs.sort((a, b) => b.likes - a.likes));
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setSortedBlogs(blogs));
  }, []);

  const addLike = async (id) => {
    const selectedBlog = blogs.find((blog) => blog.id === id);

    const likedBlog = {
      ...selectedBlog,
      likes: selectedBlog.likes + 1,
      user: selectedBlog.user.id,
    };

    try {
      const updatedBlog = await blogService.update(id, likedBlog);
      setSortedBlogs(
        blogs.map((blog) => (blog.id !== id ? blog : updatedBlog))
      );
    } catch (error) {
      props.handleNotification(
        "Error",
        "Something went wrong updating the blog."
      );
    }
  };

  const createNewRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel="create new post" ref={createNewRef}>
      <CreateNew
        handleNotification={props.handleNotification}
        error={props.error}
        message={props.message}
        blogs={blogs}
        setBlogs={setBlogs}
      />
    </Togglable>
  );

  return (
    <div>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} handleLike={addLike} />
      ))}
    </div>
  );
};

export default Content;
