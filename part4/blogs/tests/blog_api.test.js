const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const blogs = [
  { 
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]

let defaultUserId = null
let authToken = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'tester', name: 'Tester', passwordHash })
  const savedUser = await user.save()
  defaultUserId = savedUser._id

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'tester', password: 'testpassword' })

  authToken = loginResponse.body.token
  
  const blogObjects = blogs.map(blog => new Blog({ ...blog, user: defaultUserId }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs must have id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog is missing id field')
  })
})

test('POST blog', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://blogs.com/test',
    likes: 3
  }

  const blogsBefore = await Blog.find({})

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, blogsBefore.length + 1, 'No se incrementó la cantidad de blogs')
  const titles = blogsAfter.map(b => b.title)
  assert.ok(titles.includes('Test Blog'), 'New blog not found')
})


test('blogs must have likes field', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://blogs.com/test',
    likes: 0
  }

  const blogs = await Blog.find({})

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0, 'likes field not found or not 0 by default')
})

test('blog must have title field', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://blogs.com/test',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
  
  assert.strictEqual(response.statusCode, 400)
})

test('blog must have url field', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)

  assert.strictEqual(response.statusCode, 400)
})

test('a single field eliminated', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://blogs.com/test',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlogmodified = response.body

  await api
    .patch(`/api/blogs/${newBlogmodified.id}/unset`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ likes: '' })
    .expect(200)

  const result = await api.get(`/api/blogs/${newBlogmodified.id}`)
  const updatedBlog = result.body

  assert.strictEqual(updatedBlog.likes, undefined)
})

test('a blog can be partially updated with PATCH', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const update = { likes: blogToUpdate.likes + 10 }

  const response = await api
    .patch(`/api/blogs/${blogToUpdate.id}/update`)
    .set('Authorization', `Bearer ${authToken}`)
    .send(update)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})


after(async () => {
  await mongoose.connection.close()
})