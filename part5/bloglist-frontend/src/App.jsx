import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import {
  setBlogs,
  appendBlog,
  updateBlog,
  removeBlog,
} from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducers'
import Blog from './components/Blog/Blog'
import Notification from './components/Notification/Notification'
import CreateBlog from './components/CreateBlogs/CreateBlogs'
import LoginForm from './components/LoginForm/LoginForm'
import Togglable from './components/Togglable/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import User from './components/User/User'
import UserDetails from './components/UserDetails/UserDetails'
import BlogDetails from './components/BlogDetails/BlogDetails'

const App = () => {
  const dispatch = useDispatch()
  const [dataBlogVisible, setDataBlogVisible] = useState({})
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)))
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [dispatch])

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(
        setNotification({ message: 'Login succeeded!', type: 'success' })
      )
      setTimeout(() => dispatch(clearNotification()), 5000)
    } catch (exception) {
      dispatch(setNotification({ message: 'Wrong credentials', type: 'error' }))
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      dispatch(appendBlog(returnedBlog))
      dispatch(
        setNotification({
          message: `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
          type: 'success',
        })
      )
      setTimeout(() => dispatch(clearNotification()), 5000)
    } catch (error) {
      dispatch(
        setNotification({ message: 'Error creating blog', type: 'error' })
      )
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  const handdleDataBlogVisible = (id) => {
    setDataBlogVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: typeof blog.user === 'string' ? blog.user : blog.user.id,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      dispatch(updateBlog(returnedBlog))
    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }

  const handleRemove = async (blog) => {
    if (!blog.author) {
      try {
        await blogService.remove(blog.id)
        dispatch(removeBlog(blog.id))
        dispatch(
          setNotification({
            message: 'The blog has been removed',
            type: 'success',
          })
        )
        setTimeout(() => dispatch(clearNotification()), 5000)
        return
      } catch (error) {
        console.error(error)
        dispatch(
          setNotification({
            message: 'Error trying to remove the blog',
            type: 'error',
          })
        )
        setTimeout(() => dispatch(clearNotification()), 5000)
      }
    }
    const confirmed = window.confirm(
      `Are you sure to remove "${blog.title}" by "${blog.author}"?`
    )
    if (!confirmed) return
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(
        setNotification({
          message: 'The blog has been removed',
          type: 'success',
        })
      )
      setTimeout(() => dispatch(clearNotification()), 5000)
    } catch (error) {
      console.error(error)
      dispatch(
        setNotification({
          message: 'Error trying to remove the blog',
          type: 'error',
        })
      )
      setTimeout(() => dispatch(clearNotification()), 5000)
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm submitLogin={handleLogin} />
      ) : (
        <>
          <nav>
            <Link to="/">Blogs</Link> | <Link to="/users">Users</Link>
            <label> {user.name} logged-in </label>
            <button type="submit" onClick={handleLogout}>
              logout
            </button>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h2> Create a new blog </h2>
                  <Togglable buttonLabel="New blog" ref={blogFormRef}>
                    <CreateBlog createBlog={addBlog} />
                  </Togglable>

                  <h2>Blogs</h2>
                  <div>
                    {[...blogs]
                      .sort((blog1, blog2) => blog2.likes - blog1.likes)
                      .map((blog) => (
                        <Blog key={blog.id} blog={blog} />
                      ))}
                  </div>
                </>
              }
            />
            <Route path="/users" element={<User />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route
              path="/blogs/:id"
              element={
                <BlogDetails
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                />
              }
            />
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
