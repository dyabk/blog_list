import { useState } from "react";
import blogService from "../services/blogs";

const CreateNew = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleTitleChange = ({ target }) => setTitle(target.value);
  const handleAuthorChange = ({ target }) => setAuthor(target.value);
  const handleUrlChange = ({ target }) => setUrl(target.value);

  const addBlog = async (event) => {
    event.preventDefault();

    let newBlog = {
      title: title,
      author: author,
      url: url,
    };

    const response = await blogService.create(newBlog);
    console.log(response);

    if (response.status === 201) {
      console.log("response data: ", response.data);
      props.setBlogs(props.blogs.concat(response.data));
      props.handleNotification(
        "Success",
        `A new blog "${title}" by ${author} added`
      );
      setTitle("");
      setAuthor("");
      setUrl("");
    } else {
      props.handleNotification("Error", response.message);
    }
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="input-title">Title:</label>
          <input
            id="input-title"
            name="title"
            onChange={handleTitleChange}
            type="text"
            value={title}
          />
        </div>
        <div>
          <label htmlFor="input-author">Author:</label>
          <input
            id="input-author"
            name="author"
            onChange={handleAuthorChange}
            type="text"
            value={author}
          />
        </div>
        <div>
          <label htmlFor="input-url">URL:</label>
          <input
            id="input-url"
            name="url"
            onChange={handleUrlChange}
            value={url}
            type="text"
          />
        </div>
        <button id="button-create" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
