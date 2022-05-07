const Blog = require("../models/blog");
const User = require("../models/user");

const initialUsers = [
  {
    username: "scasa",
    name: "Santiago Casa",
    password: '!U"(AQM9]b4++FH;',
  },
  {
    username: "agarcia",
    name: "Alejandro Garcia",
    password: "BT!P>vE6~T/3L,V",
  },
];

const blogList = [
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
  {
    title: "Is the end of console gaming coming??",
    author: "ddyNoD",
    url: "https://www.bdffdbw.com/peezt/s-thfeewend-of-gafdng-otiVqSwA",
    likes: 23,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  blogList,
  initialUsers,
  blogsInDb,
  usersInDb,
};
