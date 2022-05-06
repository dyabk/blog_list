import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");

      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );
    } catch (exception) {
      setError(true);
      setMessage("Wrong credentials");
      setTimeout(() => {
        setError(false);
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistappUser");
    setUser(null);
    setMessage("User logged out");
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    let newBlog = {
      title,
      author,
      url,
    };

    const response = await blogService.create(newBlog);
    setBlogs(blogs.concat(response.data));
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification isError={error} message={message} />
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  if (user === null) {
    return loginForm();
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <br />
      {blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
