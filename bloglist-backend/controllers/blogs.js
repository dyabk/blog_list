const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = request.user;
  request.body.user = user._id.toString();
  let blog = new Blog(request.body);

  user.blogs = user.blogs.concat(blog._id);

  await user.save();
  await blog.save();

  blog = await Blog.findById(blog.id).populate("user", {
    username: 1,
    name: 1,
  });

  console.log(blog);
  response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  let user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "access denied" });
  }

  user = await User.findById(user._id.toString());
  user.blogs = user.blogs.filter((id) => id.toString() !== request.params.id);

  await user.save();
  await Blog.findByIdAndDelete(request.params.id);

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
