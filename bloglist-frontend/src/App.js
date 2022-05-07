import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import CreateNew from "./components/CreateNew";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleNotification = (type, text) => {
    if (type === "Error") {
      setError(true);
    }
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
      setError(false);
    }, 5000);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistAppUser");
    setUser(null);
    handleNotification("Success", "User logged out");
  };

  const loginForm = () => (
    <LoginForm
      handleNotification={handleNotification}
      setUser={setUser}
      error={error}
      message={message}
    />
  );

  const blogForm = () => (
    <Togglable buttonLabel="new post">
      <CreateNew
        handleNotification={handleNotification}
        isError={error}
        message={message}
        blogs={blogs}
        setBlogs={setBlogs}
      />
    </Togglable>
  );

  if (user === null) {
    return loginForm();
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification isError={error} message={message} />
      <div>
        <p>
          {user.name} logged in
          <button type="button" onClick={handleLogout}>
            logout
          </button>
        </p>
      </div>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
