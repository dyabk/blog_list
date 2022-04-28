const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const totalSum = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(totalSum, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
