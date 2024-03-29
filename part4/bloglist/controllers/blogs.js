const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {userExtractor} = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if(!request.body.title || !request.body.url) {
    response.status(400).json({error: "Missing field"})
  } else {  
    const blog = new Blog(request.body);
    if (!request.body.likes) blog.likes = 0;
    blog.user = user._id
    const createdBlog = await blog.save();

    user.blogs = user.blogs.concat(createdBlog._id)
    await user.save()

    response.status(201).json(createdBlog);
  } 
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!user || blog.user.toString() !== user._id.toString())  {
    return response.status(401).json({error: 'Wrong user'})
  }
  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )
  await user.save()
  await blog.remove()
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.status(204).json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter;
