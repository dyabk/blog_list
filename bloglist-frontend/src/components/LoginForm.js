import { useState } from "react";
import Notification from "./Notification";
import loginService from "../services/login";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = ({ target }) => setUsername(target.value);
  const handlePasswordChange = ({ target }) => setPassword(target.value);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      props.setUser(user);

      window.localStorage.setItem(
        "loggedBloglistAppUser",
        JSON.stringify(user)
      );
    } catch (exception) {
      props.handleNotification("Error", "Wrong credentials");
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification error={props.error} message={props.message} />
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="input-username">Username</label>
          <input
            id="input-username"
            name="Username"
            onChange={handleUsernameChange}
            type="text"
            value={username}
          />
        </div>
        <div>
          <label htmlFor="input-password">Password</label>
          <input
            id="input-password"
            name="Password"
            onChange={handlePasswordChange}
            type="password"
            value={password}
          />
        </div>
        <button id="button-login" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
