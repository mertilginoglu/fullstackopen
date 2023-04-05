const lodash = require('lodash')

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, post) => acc + post.likes, 0)
}

const favoriteBlog = (blogs) => {
  let post = blogs.reduce(function(prev, current) {
      if (+current.likes > +prev.likes) {
          return current;
      } else {
          return prev;
      }
  })
  let objToReturn = (({ title, author, likes }) => ({ title, author, likes}))(post);
  return objToReturn
}

const mostBlogs = blogs => {
  const authors = lodash.groupBy(blogs, 'author');
  const authorCounts = lodash.mapValues(authors, (authorBlogs) => authorBlogs.length);
  const topAuthor = lodash.maxBy(lodash.keys(authorCounts), (author) => authorCounts[author]);
  return { author: topAuthor, blogs: authorCounts[topAuthor] };
}

const mostLikes = blogs => {
  const authors = lodash.groupBy(blogs, 'author');
  const authorLikes = lodash.mapValues(authors, (authorBlogs) => lodash.sumBy(authorBlogs, 'likes'));
  const topAuthor = lodash.maxBy(lodash.keys(authorLikes), (author) => authorLikes[author]);
  return { author: topAuthor, likes: authorLikes[topAuthor] };
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}