import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import Content from "./components/Content";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";

const App = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

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
    window.localStorage.clear();
    setUser(null);
    handleNotification("Success", "Logged out");
  };

  const loginForm = () => (
    <LoginForm
      handleNotification={handleNotification}
      setUser={setUser}
      error={error}
      message={message}
    />
  );

  if (user === null) {
    return loginForm();
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification error={error} message={message} />
      <div>
        <p>
          {user.name} logged in
          <button type="button" onClick={handleLogout}>
            logout
          </button>
        </p>
      </div>
      <Content error={error} handleNotification={handleNotification} />
    </div>
  );
};

export default App;
