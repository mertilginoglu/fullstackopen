const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
});

blogsRouter.post('/', async (request, response) => {

  if(!request.body.title || !request.body.url) {
    response.status(400).json({error: "Missing field"})
  } else {  
    const blog = new Blog(request.body);
    if (!request.body.likes) blog.likes = 0;
    const result = await blog.save();
    response.status(201).json(result);
  } 
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
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
