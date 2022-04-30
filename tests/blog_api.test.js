const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("returns the correct amount", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("returns in the JSON format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("every blog has a property named id", async () => {
  const response = await api.get("/api/blogs");
  for (const blog of response.body) {
    expect(blog.id).toBeDefined();
  }
});

test("POST request successfully creates a new blog post", async () => {
  const newBlog = {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogs.map((b) => b.title);
  expect(contents).toContain("Go To Statement Considered Harmful");
});

test("if the likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    _id: "12322aa71c54a606234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    __v: 0,
  };

  const response = await api.post("/api/blogs").send(newBlog);

  expect(response.body.likes).toBe(0);
});

test("a blog without the title is not added", async () => {
  const newBlog = {
    author: "Dimitri",
    url: "https://agar.io",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test("a blog without the url is not added", async () => {
  const newBlog = {
    author: "Dimitri",
    title: "Test",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
