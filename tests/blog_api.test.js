const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.blogList);
});

let token = null;
beforeAll(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();

  const response = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  token = response.body.token;
}, 100000);

describe("when there are blogs saved", () => {
  test("blogs are returned in the JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all of the blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.blogList.length);
  });

  test("all blogs have the id property", async () => {
    const response = await api.get("/api/blogs");
    for (const blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data and authorization", async () => {
    const newBlog = {
      title: "Hello world!",
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    let blogs = await Blog.find({});
    blogs = blogs.map((blog) => blog.toJSON());

    expect(blogs).toHaveLength(helper.blogList.length + 1);

    const titles = blogs.map((blog) => blog.title);
    expect(titles).toContain("Hello world!");
  });

  test("fails without proper authorization", async () => {
    const newBlog = {
      title: "Hello world!",
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.blogList.length);

    const titles = blogs.map((blog) => blog.title);
    expect(titles).not.toContain("Hello world!");
  });

  test("fails when a blog has no title", async () => {
    const newBlog = {
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(400);

    let blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.blogList.length);
  });

  test("fails when a blog has no url", async () => {
    const newBlog = {
      title: "Hello world!",
      author: "Dimitri",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog)
      .expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.blogList.length);
  });

  test("defaults the likes property to 0 if it is missing", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(newBlog);

    expect(response.body.likes).toBe(0);
  });
});

describe("deletion of a blog", () => {
  test("returns status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();

    let blogToDelete = {
      title: "Hello world!",
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + token)
      .send(blogToDelete)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    blogToDelete = response.body;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "bearer " + token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const ids = blogsAtEnd.map((blog) => blog.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
});

describe("updating a blog", () => {
  test("returns status code 200 if successful", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: "Hello world!",
      author: "Dimitri",
      url: "https://non-existing.url",
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
