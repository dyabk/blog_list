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

afterAll(() => {
  mongoose.connection.close();
});
