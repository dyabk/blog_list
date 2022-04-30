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

describe("when there are blogs saved", () => {
  test("blogs are returned in the JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all of the blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("all blogs have the id property", async () => {
    const response = await api.get("/api/blogs");
    for (const blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data", async () => {
    const newBlog = {
      title: "Hello world!",
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogs.map((blog) => blog.title);
    expect(titles).toContain("Hello world!");
  });

  test("fails when a blog has no title", async () => {
    const newBlog = {
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 10,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test("fails when a blog has no url", async () => {
    const newBlog = {
      title: "Hello world!",
      author: "Dimitri",
      likes: 15,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test("defaults the likes property to 0 if it is missing", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.body.likes).toBe(0);
  });
});

describe("deletion of a blog", () => {
  test("returns status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((blog) => blog.content);
    expect(contents).not.toContain(blogToDelete.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
