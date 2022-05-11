import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(baseUrl, blog, config);
    return response;
  } catch (error) {
    return {
      message: "Error: Couldn't create a post.",
      status: 400,
    };
  }
};

const _delete = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response;
  } catch (error) {
    return {
      message: `Error: Couldn't delete blog ${id}`,
      error: 400,
    };
  }
};

const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
    return response.data;
  } catch (error) {
    return {
      message: `Error: Couldn't update blog ${id}`,
      error: 400,
    };
  }
};

export default { getAll, create, update, setToken, _delete };
