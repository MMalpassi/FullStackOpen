const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    const user = await User.findById(request.user._id)

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title and url are required' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const user = request.user

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'not authorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.patch('/:id/unset', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  try {
    const updateFields = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { $unset: updateFields },
      { new: true }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.patch('/:id/update', async (request, response, next) => {
  try {
    if (request.body._id) delete request.body._id
    if (request.body.id) delete request.body.id

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )

    if (updatedBlog) {
      response.status(200).json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})


module.exports = blogsRouter