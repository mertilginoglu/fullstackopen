const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})

test('response contains id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0]._id).toBeDefined()
})

test('post request adds blog to the database', async () => {
  await api.post('/api/blogs').send({
    "title": "postman",
    "author": "mert",
    "url": "mert241.com",
    "likes": 4
  })
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('if request body doesnt contain likes, then add it as 0', async () => {
  response = await api.post('/api/blogs').send({
    "title": "postman",
    "author": "mert",
    "url": "mert241.com",
  })
  expect(response.body.likes).toEqual(0)
})

test('if request body doesnt contain title, then return 400 as response code', async () => {
  response = await api.post('/api/blogs').send({
    "author": "mert",
    "url": "mert241.com",
  }).expect(400)
})

test('if request body doesnt contain url, then return 400 as response code', async () => {
  response = await api.post('/api/blogs').send({
    "title": "postman",
    "author": "mert",
  }).expect(400)
  
})

afterAll(async () => {
  await mongoose.connection.close()
})