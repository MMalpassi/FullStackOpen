import { useState, useEffect } from 'react'
import Blog from './components/Blog/Blog'
import Notification from './components/Notification/Notification'
import CreateBlog from './components/CreateBlogs/CreateBlogs'
import LoginForm from './components/LoginForm/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username,password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Login succeds!')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }catch (exception){
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage('Error creating blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <div>
      <Notification message={successMessage} error={errorMessage}/>
      {user === null ? 
        <LoginForm/> :
        <>
          <p>{user.name} logged-in
            <button type="submit" onClick={handleLogout}>logout</button>
          </p>
          
          <h2> Create a new blog </h2>
          <CreateBlog createBlog={addBlog}/>

          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      }
    </div>
  )
}

export default App