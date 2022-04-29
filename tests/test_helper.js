const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "who can relate?",
    author: "codeNearly",
    url: "https://www.reditsumwer.com/r/letekoad/comments/lr7a7k/who_can_relate/",
    likes: 225,
  },
  {
    title: "Westeros will defend itself against Essosi attack",
    author: "aka_KaZa",
    url: "https://www.reditsumwer.com/r/worldnews/comments/uduea0/sansa_stark_will_defend_her_realm_by_attacking_the_dragons/",
    likes: 75900,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
