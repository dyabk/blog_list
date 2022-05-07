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

blogsRouter.post("/", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = new Blog(request.body);
  const user = request.user;

  blog.user = user._id.toString();
  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  let savedBlog = await blog.save();
  savedBlog = await savedBlog.populate("user", { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  let user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    console.log("failed");
    return response.status(401).json({ error: "access denied" });
  }

  user = await User.findById(user._id.toString());
  console.log(user);
  user.blogs = user.blogs.filter((id) => id.toString() !== request.params.id);
  console.log(user.blogs);

  console.log(await user.save(), "2321");
  console.log(await Blog.findByIdAndRemove(request.params.id), "221");
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
