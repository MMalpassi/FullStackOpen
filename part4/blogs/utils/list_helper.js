const _ = require('lodash')
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum,blog) => sum + blog.likes, 0)
} 

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((fav, blog) =>
    blog.likes > fav.likes ? blog : fav
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(_.keys(grouped), (author) => grouped[author])

  return {
    author: topAuthor,
    blogs: grouped[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = _(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author,
      likes: _.sumBy(posts, 'likes')
    }))
    .maxBy('likes')

  return likesByAuthor || null
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb
}
