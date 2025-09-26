import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog/Blog'
import Notification from './components/Notification/Notification'
import CreateBlog from './components/CreateBlogs/CreateBlogs'
import LoginForm from './components/LoginForm/LoginForm'
import Togglable from './components/Togglable/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [dataBlogVisible, setDataBlogVisible] = useState({})

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage('Login succeeded!')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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

      setBlogs(blogs.map((b) => (b.id === blog.id ? returnedBlog : b)))
    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }

  const handleRemove = async (blog) => {
    if (!blog.author) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => blog.id !== b.id))
        setSuccessMessage('The blog has been removed')
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        return
      } catch (error) {
        console.error(error)
        setErrorMessage('Error trying to remove the blog')
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }
    }
    const confirmed = window.confirm(
      `Are you sure to remove "${blog.title}" by "${blog.author}"?`
    )
    if (!confirmed) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => blog.id !== b.id))
      setSuccessMessage('The blog has been removed')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error(error)
      setErrorMessage('Error trying to remove the blog')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification message={successMessage} error={errorMessage} />
      {user === null ? (
        <LoginForm submitLogin={handleLogin} />
      ) : (
        <>
          <p>
            <label> {user.name} logged-in </label>
            <button type="submit" onClick={handleLogout}>
              logout
            </button>
          </p>

          <h2> Create a new blog </h2>
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <CreateBlog createBlog={addBlog} />
          </Togglable>

          <h2>Blogs</h2>
          <div>
            {[...blogs]
              .sort((blog1, blog2) => blog2.likes - blog1.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  isVisible={dataBlogVisible[blog.id]}
                  toggleVisibility={() => handdleDataBlogVisible(blog.id)}
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
