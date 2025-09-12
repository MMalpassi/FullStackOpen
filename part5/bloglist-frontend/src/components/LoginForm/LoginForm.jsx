import { useState } from 'react'

const LoginForm = ({ submitLogin }) => {
  const [newUsername, setUsername] = useState('')
  const [newPassword, setPassword] = useState('')

  const newLogin = (event) => {
    event.preventDefault()
    submitLogin({
      username: newUsername,
      password: newPassword
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2 data-testid="Login">Login to application</h2>
      <form onSubmit={newLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={newUsername}
            name="Username"
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={newPassword}
            name="Password"
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm