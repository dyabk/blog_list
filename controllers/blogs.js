const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid " });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog(request.body);

  blog.user = user._id;
  user.blogs = user.blogs.concat(blog._id);

  const savedBlog = await blog.save();
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "access denied" });
  }

  user.blogs = user.blogs.filter((id) => id.toString() !== request.params.id);

  await Blog.findByIdAndRemove(request.params.id);
  await user.save();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  ).populate("user", { username: 1, name: 1 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
